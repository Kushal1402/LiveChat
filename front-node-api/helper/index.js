const TwoFactorAuthenticationModel = require("../models/twoFactorAuthentication");

exports.generateRandomString = async (length = 6, isNumber) => {
    var result = '';

    var characters = isNumber ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (isNumber) {
        result += "123456789".charAt(Math.floor(Math.random() * 9)); // First character cannot be '0'
    } else {
        result += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789".charAt(Math.floor(Math.random() * characters.length - 1));
    };

    for (let i = 0; i < length - 1; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

exports.generateUniqueToken = async () => {
    while (true) {
        const token = await this.generateRandomString(56, false);

        const existsToken = await TwoFactorAuthenticationModel.findOne({ token: token });

        if (!existsToken) {
            return token;
        }
    }
};

exports.deleteOTP = async (token, code) => {
  let deleteOTP = await TwoFactorAuthenticationModel.findOneAndDelete({
    token: {
      $regex: token,
      $options: "i",
    },
    code,
  });
  if (!deleteOTP) {
    console.log("Unable to delete OTP");
  }
  console.log("OTP deleted");
};