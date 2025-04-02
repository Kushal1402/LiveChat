const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const UserModel = require("../../models/user");
const TwoFactorAuthenticationModel = require("../../models/twoFactorAuthentication");
const Helper = require("../../helper/index");
const media_handler = require("../../helper/media_handler");
const SendMail = require("../../helper/email");

let jwtr;
if (global.redisClient) {
    jwtr = new JWTR(global.redisClient); // Initialize jwt-redis with global redisClient
} else {
    console.error('Redis client is not initialized');
    throw new Error('Redis client is not connected');
}

// Get user details
exports.getUserDetails = async (req, res, next) => {

    const UserId = req.userData.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(UserId)) {
            return res.status(400).json({ message: "Requested User Id is invalid!" });
        };

        const result = await UserModel.findOne({ _id: UserId }).select('-_id username about email profile_picture two_factor_authentication')

        return res.status(200).json({
            message: "Ok",
            result: result
        })
    } catch (error) {
        next(error);
    }
};

// Update user details
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
                new: true,
                select: '-_id username about email profile_picture two_factor_authentication'
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

// Update user two factor authentication
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

// Update user password
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
            UserId,
            {
                $set: {
                    password: hash,
                },
            },
            {
                new: true
            }
        );

        // Create new token
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

        // Destroy current token
        const OldToken = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = await jwtr.verify(OldToken, process.env.JWT_KEY);
        } catch (error) {
            console.log("Token decode error : ", error);
        };
        const jti = decoded.jti;
        // Destroy the token using jwtr.destroy
        await jwtr.destroy(jti);

        return res.status(200).json({
            token: auth_token,
            message: "Password has been updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// User logout
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

// Send eMail for change-email, 5 = reset-password
exports.send_mail = async (req, res, next) => {

    const objValidation = new niv.Validator(req.body, {
        email: "required|email",
        request_type: "required|in:4,5", // 4 = Change email, 5 = Reset password
        resend: "required|in:1,2", // 1 = send 2 = resend
    });
    const matched = await objValidation.check();
    if (!matched) {
        return res.status(422).json({
            message: "Validation error",
            error: objValidation.errors,
        });
    }
    const { email, request_type, resend } = req.body;

    try {

        let subject = "Vibe Chats - Email Verification";
        let message = "Verification code has been sent to your email address";

        const otp = await Helper.generateRandomString(6, true);
        const token = await Helper.generateUniqueToken();

        if (request_type === 4 && email) {

            // Check if email already exists
            let checkUserEmail = await UserModel.findOne({
                email: {
                    $regex: email,
                    $options: "i",
                },
            });
            if (checkUserEmail) {
                return res.status(409).json({
                    message: "Email already exists",
                });
            };

            const SaveOtp = await TwoFactorAuthenticationModel({
                token: token,
                email: email,
                code: otp
            });
            await SaveOtp.save();

            await SendMail.SendMail(email, subject, otp, Number(request_type));

            if (resend === 2) {
                message = "Verification code has been resent to your email address.";
            };

            return res.status(200).json({
                message: message,
                token: token,
            });
        };

        if (request_type === 5 && email) {

            // Check if associated email user exists
            let checkUserEmail = await UserModel.findOne({
                email: {
                    $regex: email,
                    $options: "i",
                },
            });
            if (!checkUserEmail || checkUserEmail === null || checkUserEmail === undefined) {
                return res.status(409).json({
                    message: "User not found with this email!",
                });
            };

            const SaveOtp = await TwoFactorAuthenticationModel({
                token: token,
                email: email,
                code: otp
            });
            await SaveOtp.save();

            await SendMail.SendMail(email, subject, otp, Number(request_type));

            if (resend === 2) {
                message = "Verification code has been resent to your email address.";
            };

            return res.status(200).json({
                message: message,
                token: token,
            });
        };
    } catch (error) {
        next(error);
    }
};

// Verify otp code
exports.verify_otp = async (req, res, next) => {

    const ObjValidation = new niv.Validator(req.body, {
        token: "required",
        otp: "required|maxLength:6",
        email: "required",
    });
    const matched = await ObjValidation.check();
    if (!matched) {
        return res.status(422).json({
            message: "validation error",
            error: ObjValidation.errors,
        });
    };

    const { email, token, otp } = req.body;

    try {
        const checkOTP = await TwoFactorAuthenticationModel.findOne({
            token: token,
            email: email,
            code: otp,
        });
        if (checkOTP?.code !== Number(otp)) {
            return res.status(402).json({
                message: "Invalid verification code. Please re-enter.",
            });
        }

        // await Helper.deleteOTP(token, otp);

        return res.status(200).json({ message: "Verification code has been successfully verified" });
    } catch (error) {
        next(error);
    }
};

// Reset user password
exports.resetPassword = async (req, res, next) => {
    try {
        const objValidation = new niv.Validator(req.body, {
            new_password: "required|minLength:6",
            email: "required|email",
            token: "required",
            otp: "required|maxLength:6",
        });
        const matched = await objValidation.check();

        if (!matched) {
            return res.status(422).send({
                message: "Validation error",
                errors: objValidation.errors,
            });
        };

        let { new_password, email, token, otp } = req.body;

        // Check if the user is valid
        const UserData = await UserModel.findOne({ email: email });
        if (!UserData || UserData === null || UserData === undefined) {
            return res.status(400).send({ message: "User not found!" });
        };

        // Check if the OTP is matching with the reset-password request 
        const checkOTP = await TwoFactorAuthenticationModel.findOne({
            token: token,
            email: email,
            code: otp,
        });
        if (checkOTP?.code !== Number(otp)) {
            return res.status(402).json({
                message: "Verification failed. Please re-initiate the process.",
            });
        };

        // Set new hash of password in user data
        const hash = await bcrypt.hash(new_password, 10);
        let result = await UserModel.findByIdAndUpdate(
            UserData._id,
            {
                $set: {
                    password: hash,
                },
            },
            {
                new: true
            }
        );

        // Create new token
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

        // Destroy current token
        const OldToken = req.headers.authorization.split(" ")[1];
        let decoded;
        try {
            decoded = await jwtr.verify(OldToken, process.env.JWT_KEY);
        } catch (error) {
            console.log("Token decode error : ", error);
        };
        const jti = decoded.jti;
        // Destroy the token using jwtr.destroy
        await jwtr.destroy(jti);

        // Destroy the token & otp
        await Helper.deleteOTP(token, otp);

        return res.status(200).json({
            token: auth_token,
            message: "Password has been reset successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Update user mail
exports.updateEmail = async (req, res, next) => {
    try {
        const objValidation = new niv.Validator(req.body, {
            email: "required|email|maxLength:50",
            token: "required",
            otp: "required|maxLength:6",
        });
        const matched = await objValidation.check();
        if (!matched) {
            return res.status(422).send({
                message: "Validation error",
                errors: objValidation.errors,
            });
        }
        const UserId = req.userData.id;

        // Check if the OTP is matching with the change-email request 
        const checkOTP = await TwoFactorAuthenticationModel.findOne({
            token: token,
            email: email,
            code: otp,
        });
        if (checkOTP?.code !== Number(otp)) {
            return res.status(402).json({
                message: "Verification failed. Please re-initiate the process.",
            });
        };

        const { email } = req.body;

        // console.log("User : ", UserId, "req.body : ", req.body)

        const result = await UserModel.findByIdAndUpdate(
            UserId,
            {
                $set: {
                    email: email
                }
            },
            {
                new: true,
                select: '-_id username about email profile_picture two_factor_authentication'
            }
        );

        // Destroy the token & otp
        await Helper.deleteOTP(token, otp);

        if (result) {
            return res.status(200).json({
                message: "Email has been successfully updated",
                result: result
            });
        }
    } catch (error) {
        next(error);
    }
};