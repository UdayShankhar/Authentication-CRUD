const router = require("express").Router()
const User = require("../models/User")
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } = require("./verifyToken")

// If the JWT token is valid, anyone can edit,create,view or delete user
// To avoid this, in verifyToken.js, I have wriiten seperate conditions

// CONDITIONS
// 1) If token is verified anyone can edit,create,view or delete user
// 2) Token and Authorization both should be valid can edit,create,view or delete user
// 3) Token and isAdmin should be true can edit,create,view or delete user

// With these conditions,we can able to customize the app according to our need

router.put("/:id", verifyToken, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).json(updatedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

router.delete("/find/:id", verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted')
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/find/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Pagination has been done and I have set the limit to 1
// If we want to fetch 10 users at a time, In PostMan, under params section

// 1) Give key as page and value to 1
// 2) Give key as limit and value as 10 // This will give 10 users in a single page

router.get("/", verifyToken, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query
        const users = await User.find().limit(limit * 1).skip((page - 1) * limit)
        res.status(200).json({ total: users.length, users })
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router