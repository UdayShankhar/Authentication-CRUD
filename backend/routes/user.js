const router = require("express").Router()
const User = require("../models/User")
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin, } = require("./verifyToken")

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

// Only if isAdmin is true, we can able to view the user details
// TO make it true, manually we have to change it in MongoDB

router.get("/find/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Only if isAdmin = true, we can able to view all the users list
// To make it true, manually we have to change it in MongoDB

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