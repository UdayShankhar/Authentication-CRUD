const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const UserData = require("../models/UserData");

router.put("/updateUserDetails", async (req, res) => {
  try {
    // Extract user details from the request body
    const { id, email, name, phoneNumber } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find and update the user by ID
    const updatedUser = await UserData.findByIdAndUpdate(
      id, // Use the ID from the request body
      {
        $set: { email, name, phoneNumber },
      },
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user details
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred during the update", error: err });
  }
});



router.delete("/find/:id", verifyToken, async (req, res) => {
  try {
    await UserData.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/find/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { page = 1, limit = 20 } = req.query;
      const users = await UserData.find()
        .limit(limit * 1)
        .skip((page - 1) * limit);
      res.status(200).json({ total: users.length, users });
    } else {
      console.log("Logged-in user ID:", req.user.id);

      const { page = 1, limit = 10 } = req.query;
      const userData = await UserData.find({ createdBy: req.user.id })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      if (userData.length === 0) {
        return res.status(404).json({ message: "No data found for this user" });
      }
      res.status(200).json({ total: userData.length, data: userData });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/create-user", verifyToken, async (req, res) => {
  const { name, email, phoneNumber } = req.body;
  console.log(req.body);
  try {
    const newUserData = new UserData({
      name,
      email,
      phoneNumber,
      createdBy: req.user.id, // Attach logged-in user's ID
    });
    console.log(newUserData);

    const savedData = await newUserData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
