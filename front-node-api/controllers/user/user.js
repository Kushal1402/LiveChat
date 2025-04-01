const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const UserModel = require("../../models/user");
const TwoFactorAuthenticationModel = require("../../models/twoFactorAuthentication");
const Helper = require("../../helper/index");
const media_handler = require("../../helper/media_handler");

let jwtr;
if (global.redisClient) {
    jwtr = new JWTR(global.redisClient); // Initialize jwt-redis with global redisClient
} else {
    console.error('Redis client is not initialized');
    throw new Error('Redis client is not connected');
}

exports.getUserDetails = async (req, res, next) => {

    const UserId = req.userData.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ message: "Requested User Id is invalid!" });
        };

        const result = await UserModel.findOne({ _id: UserId }).select('_id username about email profile_picture image_version two_factor_authentication')

        return res.status(200).json({
            message: "Ok",
            result: result
        })
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const UserId = req.userData.id;

        const { username, about } = req.body;

        // console.log("User : ", UserId, "req.body : ", req.body)

        let uploadMedia, updateObj = {};
        if (req.file) {

            const base64String = req.file.buffer.toString("base64");
            const base64EncodeData = `data:${req.file.mimetype};base64,${base64String}`;

            uploadMedia = await media_handler.uploadMedia("user", base64EncodeData, "image");
            // console.log("Uploaded media data :", uploadMedia);

            updateObj.image_version = uploadMedia.version;
            updateObj.profile_picture = uploadMedia.secure_url;
        };

        if (username && username !== "") updateObj.username = username;
        if (about && about !== "") updateObj.about = about;

        const result = await UserModel.findByIdAndUpdate(
            UserId,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );

        if (result) {
            return res.status(200).json({
                message: "Your details has been successfully updated",
                result: result
            });
        }
    } catch (error) {
        next(error);
    }
};

exports.updateAuthentication = async (req, res, next) => {
    try {
        const objValidation = new niv.Validator(req.body, {
            two_factor_authentication: "required|boolean"
        });
        const matched = await objValidation.check();
        if (!matched) {
            return res.status(422).send({
                message: "Validation error",
                errors: objValidation.errors,
            });
        }
        const id = req.userData.id;

        const two_factor_authentication = req.body.two_factor_authentication;

        await UserModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    two_factor_authentication: two_factor_authentication
                }
            },
            {
                new: true,
            }
        );

        let message = req.body.two_factor_authentication === true ? "Two factor authentication has been successfully enabled" : "Two factor authentication has been successfully disabled"

        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        next(error);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const objValidation = new niv.Validator(req.body, {
            new_password: "required|minLength:6",
            old_password: "required|minLength:6",
        });
        const matched = await objValidation.check();

        if (!matched) {
            return res.status(422).send({
                message: "Validation error",
                errors: objValidation.errors,
            });
        };

        let { new_password, old_password } = req.body;
        const UserId = req.userData.id;

        const UserData = await UserModel.findById(UserId);

        if (!UserData || UserData === null || UserData === undefined) {
            return res.status(400).send({ message: "User not found!" });
        };

        const CompareOldPass = await bcrypt.compare(old_password, UserData.password);
        if (!CompareOldPass) {
            return res.status(409).send({ message: "Invalid current password" });
        };

        if (await bcrypt.compare(new_password, UserData.password)) {
            return res.status(409).send({ message: "Password already in use!" });
        };

        const hash = await bcrypt.hash(new_password, 10);

        let result = await UserModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    password: hash,
                },
            },
            {
                new: true
            }
        );

        const auth_token = await jwtr.sign(
            {
                email: result?.email,
                id: result?._id,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "2d",
            }
        );

        return res.status(200).json({
            token: auth_token,
            message: "Password has been updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

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
};