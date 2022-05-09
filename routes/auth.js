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
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // store data/user
    const user = await newUser.save();
    res.status(200).json(user);
    await user.save();
  } catch (err) {
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
    !validPassword && res.status(400).json("Wrong password");

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
