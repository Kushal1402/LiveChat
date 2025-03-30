const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const User = require("../../models/user");
const TwoFactorAuthentication = require("../../models/twoFactorAuthentication");
const SendMail = require("../../helper/email");

let jwtr;
if (global.redisClient) {
  jwtr = new JWTR(global.redisClient); // Initialize jwt-redis with global redisClient
} else {
  console.error('Redis client is not initialized');
  throw new Error('Redis client is not connected');
}