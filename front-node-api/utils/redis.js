const { createClient } = require('redis');
require("dotenv").config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16398.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16398
    }
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));

redisClient.on("reconnecting", () => console.warn("🔁 Attempting to reconnect to Redis..."));

(async () => {
    try {
        await redisClient.connect();
        console.log("🔌 Redis client connected successfully");
    } catch (err) {
        console.error("Error connecting Redis client:", err);
    }
})();
module.exports = redisClient;