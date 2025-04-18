const { Server } = require("socket.io");
const JWTR = require('jwt-redis').default;
require("dotenv").config();

const UserModel = require("../models/user");

let jwtr;
let redisClient;

// Create the Socket.IO instance
const initSocket = (server, redis) => {

    redisClient = redis;
    jwtr = new JWTR(redisClient);

    const io = new Server(server, {
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
        console.log("✅ Authenticated client connected: " + socket.id + "  User:", socket.user);

        let SocketUser = socket.user;

        // Mark user as online in redis
        await redisClient.set(`user:${SocketUser.id}:status`, "online");
        await redisClient.set(`user:${SocketUser.id}:socket`, socket.id);
        
        // Update DB
        await UserModel.findByIdAndUpdate(SocketUser.id, { status: true });
        // Broadcast online
        socket.broadcast.emit("user-online", { userId : SocketUser.id });

        socket.on("message", (data) => {
            console.log("New message arrived", data);
            io.emit("message", { return_message: data });
        });

        // Handle client disconnect
        socket.on("disconnect", async () => {
            console.log("❌ Client disconnected: " + socket.id);

            // Mark user as offline in redis
            await redisClient.set(`user:${SocketUser.id}:status`, "offline");
            await UserModel.findByIdAndUpdate(SocketUser.id, { status: false });

            socket.broadcast.emit("user-offline", { userId : SocketUser.id });
        });
    });

    return io;
};

module.exports = initSocket;