const router = require("express").Router();
const User = require("../models/User");
// register

router.get("/register", async (req, res) => {
  const user = await new User({
    username: "tansssaaassddd22",
    email: "jon@gamilaa.comssaass22",
    password: "12345699sssss22",
  });

  await user.save();
  res.send("ok!!!");
});

module.exports = router;
