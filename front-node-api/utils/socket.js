const { Server } = require("socket.io");
const JWTR = require('jwt-redis').default;
require("dotenv").config();
const RedisClient = require('../utils/redis');

const UserModel = require("../models/user");
const ConversationModel = require("../models/conversations");

let jwtr;
let redisClient;
let io;

/**
 * Initializes Socket.IO with authentication middleware and event handlers
 * 
 * @param {Object} server - HTTP/HTTPS server instance to attach Socket.IO
 * @returns {Object} io - Configured Socket.IO server instance
 * 
 * @description
 * This function sets up a Socket.IO server with authentication middleware that verifies
 * JWT tokens for each connection. It manages user presence tracking in Redis and MongoDB.
 * 
 * @events
 * Socket.IO Server Events:
 * - connection: Triggered when an authenticated client connects
 *   - Updates user status to online in Redis and MongoDB
 *   - Joins user to their conversation rooms
 *   - Emits "isOnline" event to notify friends
 * 
 * Socket Events:
 * - disconnect: Triggered when a client disconnects
 *   - Updates user status to offline in Redis and MongoDB
 *   - Removes socket ID and conversation mapping from Redis
 *   - Emits "isOnline" event with offline status to notify friends
 * - message: (Commented out) Would handle incoming messages
 * 
 * Emitted Events:
 * - isOnline: Notifies friends about user's online/offline status
 *   - Payload: { userId, status, sender_lastActive? }
 * - user-profile-updated: Notifies conversations about user profile updates
 *   - Payload: { userId, updatedProfile }
 */
// Create the Socket.IO instance
const initSocket = (server) => {

    redisClient = RedisClient;
    jwtr = new JWTR(redisClient);

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "PUT", "POST"],
        }
    });
    // console.log("🚀 ~ io:", io)

    // Socket.IO authentication middleware
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error: Token missing"));

        try {
            const decoded = await jwtr.verify(token, process.env.JWT_KEY);
            socket.user = decoded;
            next();
        } catch (err) {
            console.log("Socket auth error:", err.message);
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    // Socket event handlers
    io.on("connection", async (socket) => {
        console.log("✅ Authenticated client connected: " + socket.id + "\n  User: ", socket.user);

        let SocketUser = socket.user;
        // Join user's personal room 
        socket.join(SocketUser.id);

        // Create a personal room for the user - execute create room & status updates in parallel
        try {
            const [UserExistingConversations] = await Promise.all([
                // Get user conversations
                ConversationModel.find({ participants: SocketUser.id }, "_id participants").sort({ updatedAt: -1 }),
                
                // Update redis status
                redisClient.set(`user:${SocketUser.id}:status`, "online"),
                redisClient.set(`user:${SocketUser.id}:socket`, socket.id),
                
                // Update DB status
                UserModel.findByIdAndUpdate(SocketUser.id, { status: true })
            ]);
            // Join conversation rooms & store in Redis
            if (UserExistingConversations.length) {
                const roomIds = UserExistingConversations.map(convo => convo._id.toString());
                
                socket.join(roomIds);
                
                redisClient.set(`user:${SocketUser.id}:conversations`, JSON.stringify(roomIds));
                
                console.log(`User ${SocketUser.id} joined ${roomIds.length} rooms`, "\nand the rooms are : ", socket.rooms);
            };
            
            // Notify friends that user is online
            emitToConnectedFriends(io, SocketUser.id, UserExistingConversations, "isOnline", { userId: SocketUser.id, status: true, });
        } catch (error) {
            console.error("Error in connection handler:", error);
        }

        // socket.on("message", (data) => {
        //     console.log("New message arrived", data);
        //     io.emit("message", { return_message: data });
        // });

        // Handle client disconnect
        socket.on("disconnect", async () => {
            console.log("❌ Client disconnected: " + socket.id);

            // Execute status updates in parallel
            try {
                // Update status in Redis and MongoDB
                await Promise.all([
                    // Update redis status
                    redisClient.set(`user:${SocketUser.id}:status`, "offline"),
                    redisClient.del(`user:${SocketUser.id}:socket`),
                    
                    // Update DB status
                    UserModel.findByIdAndUpdate(SocketUser.id, { status: false, lastActive: new Date() })
                ]);

                // Get conversations directly from Redis
                const conversationsJson = await redisClient.get(`user:${SocketUser.id}:conversations`);
                const roomIds = conversationsJson ? JSON.parse(conversationsJson) : [];

                // If we need participant details for notifications
                let UserExistingConversationsOffline = [];
                if (roomIds.length > 0) {
                    UserExistingConversationsOffline = await ConversationModel.find(
                        { _id: { $in: roomIds } },
                        "_id participants"
                    );
                };
                
                // Notify friends that user is offline
                emitToConnectedFriends(io, SocketUser.id, UserExistingConversationsOffline, "isOnline", { userId: SocketUser.id, status: false, sender_lastActive: new Date() });
                
                // Leave conversation rooms
                if (roomIds.length > 0) {
                    socket.leave(roomIds);
                    console.log(`User ${SocketUser.id} left ${roomIds.length} rooms`);

                    // Remove conversation IDs from Redis
                    await redisClient.del(`user:${SocketUser.id}:conversations`);
                }
            } catch (error) {
                console.error("Error in disconnect handler:", error);
            }
        });
    });

    return io;
};

// Function to emit status update events to connected friends
function emitToConnectedFriends(io, userId, conversations, event, data) {
    if (!conversations || !conversations.length) return;
    
    // Find all unique friend IDs across conversations
    const friendIds = new Set();
    conversations.forEach(convo => {
        if (convo.participants && Array.isArray(convo.participants)) {
            convo.participants.forEach(pid => {
                const participantId = pid.toString();
                if (participantId !== userId.toString()) {
                    friendIds.add(participantId);
                }
            });
        }
    });
    console.log("Friend IDs to notify:", friendIds);
    
    if (friendIds.size > 0) {
        // Emit to all friends at once through their conversation rooms
        Array.from(friendIds).forEach(friendId => {
            io.to(friendId).emit(event, data);
        });
        console.log(`Event ${event} emitted to ${friendIds.size} friends`);
    }
};

async function broadcastUserProfileUpdate(userId, updatedProfile) {
    try {
        redisClient = RedisClient;

        // Get the user's conversation list from Redis
        const redisData = await redisClient.get(`user:${userId}:conversations`);
        if (!redisData) return; // Nothing to broadcast if no convos found

        const conversationIds = redisData ? JSON.parse(redisData) : [];

        // Broadcast to all relevant conversation rooms
        conversationIds.forEach((conversationId) => {
            io.to(conversationId).emit("user-profile-updated", {
                userId,
                updatedProfile,
            });
        });

        console.log(`✅ Profile update broadcasted for user: ${userId}`);
    } catch (error) {
        console.error("❌ Error in broadcasting user profile update:", error);
    }
};

module.exports = {
    initSocket,
    broadcastUserProfileUpdate,
};