const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const UserModel = require("../../models/user");
const TwoFactorAuthenticationModel = require("../../models/twoFactorAuthentication");
const Helper = require("../../helper/index");

let jwtr;
if (global.redisClient) {
    jwtr = new JWTR(global.redisClient); // Initialize jwt-redis with global redisClient
} else {
    console.error('Redis client is not initialized');
    throw new Error('Redis client is not connected');
}

exports.logout = async (req, res, next) => {
    try {
        // console.log("Authorization : ", req.headers.authorization);
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        };

        let decoded;
        try {
            decoded = await jwtr.verify(token, process.env.JWT_KEY);
        } catch (error) {
            return res.status(400).json({ message: "User logged out successfully" })
        }

        const jti = decoded.jti;
        // Destroy the token using jwtr.destroy
        await jwtr.destroy(jti);

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        next(error);
    }
}