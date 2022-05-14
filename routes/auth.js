const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token");
const middleWare = require("../middleware/middleware");

// register

router.post("/register", async (req, res) => {
  try {
    // create new user
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = generateToken(newUser._id);
    // store data/user
    const user = await newUser.save();
    res.status(201).json({
      success: true,
      message: "signup successfully",
      user,
      token,
    });
    await user.save();
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "user already exixts",
      });
    }

    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword &&
      res.status(400).json({
        success: false,
        status: 400,
        message: "Password wrong",
      });
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "login successfully",
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// for refresh
router.get("/verify", middleWare, async (req, res) => {
  const { id } = req.data;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
