const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const uuid = require("uuid");
const UserOTPVerification = require("../models/UserOTPverification");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

transporter.verify((error, sucess) => {
  if (error) {
    console.log(error);
  } else {
    console.log(sucess);
  }
});

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
  });

  try {
    const savedUser = await newUser.save();
    const otpResult = await sendOTPverificationEmail({
      id: savedUser._id,
      email: savedUser.email,
    });

    if (otpResult.success) {
      return res.status(200).json({
        message: "Registration successful!",
        userId: savedUser._id,
      });
    } else {
      return res.status(500).json({
        message: "Registration successful, but failed to send OTP.",
        userId: savedUser._id,
        error: otpResult.message,
      });
    }
  } catch (err) {
    console.error("Error during registration:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        message: `${field} already exists. Please choose another.`,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed. Check your input.",
        error: err.errors,
      });
    }
    return res.status(400).json({
      message: "Registration failed.",
      error: err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.emailAddress });
    if (!user) {
      return res.status(401).json({ message: "Email not found!" });
    }
    if (user.password !== req.body.password) {
      return res.status(401).json({ message: "Incorrect password!" });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "2d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/verifyOTP", async (req, res) => {
  console.log(req.body);

  try {
    const { uniqueUserID, OTP } = req.body;
    if (!uniqueUserID || !OTP) {
      return res.json({
        status: "FAILED",
        message: "Empty OTP details are not allowed",
      });
    }

    const UserOTPVerificationRecords = await UserOTPVerification.find({
      uniqueUserID,
    });

    if (UserOTPVerificationRecords.length === 0) {
      return res.json({
        status: "FAILED",
        message: "Please signup or login later",
      });
    }

    const { expiresAt } = UserOTPVerificationRecords[0];

    if (expiresAt < Date.now()) {
      await UserOTPVerification.deleteMany({ uniqueUserID }); // Clean up expired OTPs
      return res.json({
        status: "FAILED",
        message: "OTP has expired. Please request a new one.",
      });
    }

    await User.updateOne({ _id: uniqueUserID }, { verified: true });

    await UserOTPVerification.deleteMany({ uniqueUserID });

    return res.json({
      status: "VERIFIED",
      message: "Verified successfully",
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return res.json({
      status: "FAILED",
      message: error.message || "An unexpected error occurred.",
    });
  }
});



const sendOTPverificationEmail = async ({ id, email }) => {
  try {
    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: { name: "UdayShankhar", address: "shankhar87@gmail.com" },
      to: email,
      subject: "Verify your email",
      html: `
        <p>Enter your unique OTP: <strong>${OTP}</strong> in the app to verify your email.</p>
        <p>Your User ID: <strong>${id}</strong></p>
      `,
    };

    const newOTPVerification = new UserOTPVerification({
      userID: id,
      OTP,
      createdDate: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000,
    });
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: error.message };
  }
};


module.exports = router;
