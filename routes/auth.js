const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
// register

router.post("/register", async (req, res) => {
  try {
    // this will create new password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // store data/user
    const user = await newUser.save();
    res.status(200).json(user);
    await user.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
