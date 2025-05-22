const { Server } = require("socket.io");
const JWTR = require('jwt-redis').default;
require("dotenv").config();
const RedisClient = require('../utils/redis');

const UserModel = require("../models/user");
const ConversationModel = require("../models/conversations");
const MessageModel = require("../models/messages");

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
 * - typing: Notifies conversation about typing status
 *   - Payload: { conversationId }
 * - stop-typing: Notifies conversation about stopped typing status after 5 seconds timeout
 *   - Payload: { conversationId }
 * - send-message: Handles sending messages to a conversation
 *   - Payload: { conversationId, content }
 * - message-sent: Acknowledges successful message sending
 * - error: Emits error messages to the client
 * - mark-messages-read: Marks messages as read in a conversation
 *  - Payload: { conversationId }
 * - messages-read: Notifies conversation about read messages
 *   - Payload: { conversationId, readerId, messageIds, readAt }
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

            // Message typing indicator event - conversationId and userId of the typing user
            socket.on("typing", ({ conversationId }) => {
                if (!conversationId) return;

                socket.to(conversationId).emit("typing", { conversationId, userId: SocketUser.id, isTyping: true });

                setTimeout(() => {
                    socket.to(conversationId).emit("stop-typing", { conversationId, userId: SocketUser.id, isTyping: false });
                }, 5000);
            });

            // Handle Message event
            socket.on("send-message", async ({ conversationId, content }) => {
                const senderId = SocketUser.id;

                if (!conversationId || !isValidObjectId(conversationId) || !isNonEmptyString(content)) {
                    return socket.emit("error", { message: "Invalid conversation ID or message content." });
                }

                try {
                    const message = await MessageModel.create({
                        conversationId,
                        sender: senderId,
                        content,
                    });

                    await ConversationModel.findByIdAndUpdate(conversationId, {
                        lastMessage: message._id,
                    });

                    const fullMessage = await MessageModel.findById(message._id).populate("sender", "username profile_picture").lean();

                    const convo = await ConversationModel.findById(conversationId).lean();
                    const recipients = convo.participants.filter((id) => id.toString() !== senderId.toString());

                    emitToUsers(recipients, "new-message", fullMessage);

                    socket.emit("message-sent", { success: true });
                } catch (err) {
                    console.error("Socket message error:", err);
                    socket.emit("error", { message: "Message failed to send." });
                }
            });

            // Message read receipt event
            socket.on("mark-messages-read", async ({ conversationId }) => {
                const readerId = SocketUser.id;

                if (!conversationId || !isValidObjectId(conversationId)) {
                    return socket.emit("error", { message: "Invalid conversation ID " });
                }

                try {
                    const conversation = await ConversationModel.findById(conversationId).lean();
                    if (!conversation) {
                        return socket.emit("error", { message: "Conversation not found" });
                    }

                    if (!conversation.participants.some(p => p.toString() === readerId)) {
                        return socket.emit("error", { message: "You are not a participant of this conversation" });
                    }

                    // Update unread messages (excluding own messages)
                    const readAtTime = new Date();
                    const updated = await MessageModel.updateMany(
                        {
                            conversationId,
                            sender: { $ne: readerId },
                            "readBy.user": { $ne: readerId }
                        },
                        {
                            $push: {
                                readBy: { user: readerId, readAt: readAtTime }
                            }
                        }
                    );

                    if (updated.modifiedCount > 0) {
                        // Get list of affected message IDs
                        const readMessages = await MessageModel.find(
                            {
                                conversationId,
                                sender: { $ne: readerId },
                                "readBy.user": readerId,
                            },
                            { _id: 1 }
                        ).lean();

                        const messageIds = readMessages.map(msg => msg._id);
                        // Notify all other participants
                        const recipients = conversation.participants.filter(id => id.toString() !== readerId);

                        emitToUsers(recipients, "messages-read", {
                            conversationId,
                            readerId,
                            messageIds,
                            readAt: new Date()
                        });

                        console.log(`User ${readerId} marked ${messageIds.length} messages as read in conversation ${conversationId}`);
                    }
                } catch (err) {
                    console.error("Error marking messages as read:", err);
                    socket.emit("error", { message: "Failed to mark messages as read." });
                }
            });

        } catch (error) {
            console.error("Error in connection handler:", error);
        }

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

// Function to emit messages to conversation users
function emitToUsers(userIds, event, data) {
    if (!userIds || !userIds.length) return;

    // Emit to all users at once through their conversation rooms
    userIds.forEach(userId => {
        io.to(userId).emit(event, data);
    });
    console.log(`Event ${event} emitted to ${userIds.length} users`);
};

module.exports = {
    initSocket,
    broadcastUserProfileUpdate,
};