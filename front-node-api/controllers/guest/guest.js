const niv = require("node-input-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWTR = require('jwt-redis').default;

const UserModel = require("../../models/user");
const TwoFactorAuthenticationModel = require("../../models/twoFactorAuthentication");
const SendMail = require("../../helper/email");
const Helper = require("../../helper/index");

let jwtr;
if (global.redisClient) {
  jwtr = new JWTR(global.redisClient); // Initialize jwt-redis with global redisClient
} else {
  console.error('Redis client is not initialized');
  throw new Error('Redis client is not connected');
}

// Register User
exports.register = async (req, res, next) => {

  const objValidation = new niv.Validator(req.body, {
    username: "required|maxLength:25",
    email: "required|email|maxLength:50",
    password: "required|minLength:6",
  });
  const matched = await objValidation.check();

  if (!matched) {
    return res.status(422).send({
      message: "Validation error",
      errors: objValidation.errors,
    });
  }

  const { username, email, password } = req.body;

  try {

    let hash = "";
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }

    const UserObj = {};

    UserObj.username = username;
    UserObj.email = email;
    UserObj.password = hash;

    const UserSave = new UserModel(UserObj);
    const result = await UserSave.save();

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

    delete result.password;

    return res.status(201).json({
      message: "Your profile has been registered successfully",
      token: auth_token,
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const objValidation = new niv.Validator(req.body, {
      email: "required|email",
      password: "required",
    });

    const matched = await objValidation.check();

    if (!matched) {
      return res.status(422).send({
        message: "Validation error",
        errors: objValidation.errors
      });
    };

    let { email, password } = req.body;

    let user_data = await UserModel.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $toLower: "$email" }, email.trim().toLowerCase()],
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          password: 1,
          about: 1,
          email: 1,
          profile_picture: 1,
          two_factor_authentication: 1,
        }
      }
    ]);

    let user_details = user_data[0];

    if (user_details === null || user_details === undefined) {
      return res.status(406).json({
        message: "No record found with this email address",
      });
    };

    const passwordResult = await bcrypt.compare(password?.trim(), user_details.password);
    if (passwordResult === false) {
      return res.status(406).json({
        message: "Invalid email or password",
      });
    };

    if (user_details.two_factor_authentication) {
      return res.status(307).json({
        message: "2FA authentication is on!"
      });
    };

    const auth_token = await jwtr.sign(
      {
        email: user_details?.email,
        id: user_details?._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "2d",
      }
    );

    if (user_details) delete user_details.password;

    return res.status(200).json({
      message: "User logged in successfully.",
      token: auth_token,
      result: user_details
    });

  } catch (error) {
    next(error);
  }
}

// Send eMail for register, 2fa login or forget-pass
exports.send_mail = async (req, res, next) => {

  const objValidation = new niv.Validator(req.body, {
    email: "required|email",
    request_type: "required|in:1,2,3", // 1 = register, 2 = forget-pass, 3 = 2fa login
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

    if (request_type === 1 && email) {

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

    if (request_type === 2 && email) {

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
    }

    if (request_type === 3 && email) {

      // Check if email already exists
      let checkUserEmail = await UserModel.findOne({
        email: {
          $regex: email,
          $options: "i",
        },
      });
      if (checkUserEmail && checkUserEmail.two_factor_authentication === true) {

        const SaveOtp = await TwoFactorAuthenticationModel({
          token: token,
          email: email,
          code: otp
        });
        await SaveOtp.save();

        subject = "Vibe Chats - Login Verification"

        await SendMail.SendMail(email, subject, otp, Number(request_type));

        if (resend === 2) {
          message = "Verification code has been resent to your email address.";
        };

        return res.status(200).json({
          message: message,
          token: token,
        });
      };
    };
  } catch (error) {
    next(error);
  }
};

// Verify Otp code
exports.verify_otp = async (req, res, next) => {

  const ObjValidation = new niv.Validator(req.body, {
    token: "required",
    otp: "required|maxLength:6",
    request_type: "required|in:1,2,3",
    email: "required",
  });
  const matched = await ObjValidation.check();
  if (!matched) {
    return res.status(422).json({
      message: "validation error",
      error: ObjValidation.errors,
    });
  }

  const { email, request_type, token, otp } = req.body;

  try {
    const checkOTP = await TwoFactorAuthenticationModel.findOne({
      token: token,
      email: email,
      code: otp,
    });
    if (checkOTP?.code !== Number(otp)) {
      return res.status(406).json({
        message: "Invalid verification code. Please re-enter.",
      });
    }

    if (Number(request_type) !== Number(2)) await Helper.deleteOTP(token, otp);

    if (request_type === 3) {

      let user_data = await UserModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $toLower: "$email" }, email.trim().toLowerCase()],
            },
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            password: 1,
            about: 1,
            email: 1,
            profile_picture: 1,
            two_factor_authentication: 1,
          }
        }
      ]);

      let user_details = user_data[0];
      if (user_details === null || user_details === undefined) {
        return res.status(404).json({
          message: "No record found with this email address",
        });
      };

      const auth_token = await jwtr.sign(
        {
          email: user_details?.email,
          id: user_details?._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "2d",
        }
      );

      if (user_details) delete user_details.password;

      return res.status(200).json({
        message: "User verified & logged in successfully.",
        token: auth_token,
        result: user_details
      });
    }

    return res.status(200).json({ message: "Verification code has been successfully verified" });
  } catch (error) {
    next(error);
  }
};

// Reset User Password
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

    const checkEmail = await TwoFactorAuthenticationModel.findOne({
      token: token,
      email: email,
      code: otp,
    });
    if (checkEmail?.code !== Number(otp)) {
      return res.status(409).json({
        message: "Verification failed. Please re-initiate the process",
      });
    }

    const UserData = await UserModel.findOne({ email: email });
    if (!UserData || UserData === null || UserData === undefined) {
      return res.status(404).send({ message: "User not found!" });
    };

    const hash = await bcrypt.hash(new_password, 10);

    await UserModel.findByIdAndUpdate(
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

    await Helper.deleteOTP(token, otp);

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    next(error);
  }
};