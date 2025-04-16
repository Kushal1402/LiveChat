const { Server } = require("socket.io");
const JWTR = require('jwt-redis').default;
require("dotenv").config();

const UserModel = require("../models/user");

let jwtr;
if (global.redisClient) {
  jwtr = new JWTR(global.redisClient);
} else {
  console.error('Redis client is not initialized');
  throw new Error('Redis client is not connected');
}

// Create the Socket.IO instance
const initSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "PUT", "POST"],
        }
    });
    // console.log("🚀 ~ io:", io)

    // Socket.IO authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        };

        try {
            const decoded = jwtr.verify(token, process.env.JWT_KEY);
            socket.user = decoded;
            next();
        } catch (err) {
            console.log("Socket auth error:", err.message);
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    // Socket event handlers
    io.on("connection", async (socket) => {
        console.log("✅ Authenticated client connected: " + socket.id + "User:", socket.user);

        // Mark user as online in redis
        await global.redisClient.set(`user:${socket.user._id}:status`, "online");
        await global.redisClient.set(`user:${socket.user._id}:socket`, socket.id);
        // Update DB
        await UserModel.findByIdAndUpdate(socket.user._id, { status: true });
        // Broadcast online
        socket.broadcast.emit("user-online", { userId : socket.user._id });

        socket.on("message", (data) => {
            console.log("New message arrived");
            io.emit("message", { return_message: data });
        });

        // Handle client disconnect
        socket.on("disconnect", async () => {
            console.log("❌ Client disconnected: " + socket.id);

            // Mark user as offline in redis
            await global.redisClient.set(`user:${socket.user._id}:status`, "offline");
            await UserModel.findByIdAndUpdate(socket.user._id, { status: false });

            socket.broadcast.emit("user-offline", { userId : socket.user._id });
        });
    });

    return io;
};

module.exports = initSocket;