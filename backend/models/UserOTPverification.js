const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema(
  {
    userID: String,
    OTP: String,
    createdDate : Date,
    expiresAt : Date
  }
);

module.exports = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);
