const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // password: CryptoJS.enc.Utf8.parse(
    //   req.body.password,
    //   process.env.PASS_SEC
    // ).toString(),
    password: req.body.password,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.emailAddress });
    console.log(user);
    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }
    // const decryptedBytes = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SEC
    // );
    // console.log(decryptedBytes);
    // const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

    // console.log("Decrypted Password:", decryptedPassword);

    // if (originalPassword !== req.body.password) {
    //   return res.status(401).json("Wrong credentials!");
    // }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "2d" }
    );
    console.log(accessToken);
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
