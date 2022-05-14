const router = require("express").Router();
const User = require("../models/User");
const middleWare = require("../middleware/middleware");
// all users
router.get("/allUsers", middleWare, async (req, res) => {
  try {
    const allUser = await User.find();
    return res.status(200).json(allUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});
// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// edit user
router.put("/edit", middleWare, async (req, res) => {
  const { id } = req.data;

  try {
    const user = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });
    res.status(200).json({ message: "Account updated successfully", user });
  } catch (err) {
    return res.status(500).json(err);
  }
});
// delete user
router.delete("/delete", middleWare, async (req, res) => {
  const { id } = req.data;
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json("Account has been deleted successfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// follow a user

router.put("/follow/:id", middleWare, async (req, res) => {
  const userToFollowId = req.params.id;

  const { id } = req.data; //tanishk id

  if (userToFollowId === id) {
    return res.status(400).json("you cant follow yourself ");
  }

  const user = await User.findById(userToFollowId); //praveen

  if (user.followers.includes(id)) {
    return res.status(400).json("you already following ");
  }

  try {
    await User.findByIdAndUpdate(userToFollowId, {
      $push: { followers: id },
    });

    await User.findByIdAndUpdate(id, {
      $push: { following: userToFollowId },
    });

    return res.status(200).json("user has been followed");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// unfollow a user

router.put("/unfollow/:id", middleWare, async (req, res) => {
  const userToFollowId = req.params.id;

  const { id } = req.data;

  if (userToFollowId === id) {
    return res.status(400).json("you cant unfollow yourself");
  }

  const user = await User.findById(userToFollowId);

  if (!user.followers.includes(id)) {
    return res.status(400).json("you dont follow this user ");
  }

  try {
    await User.findByIdAndUpdate(userToFollowId, {
      $pull: { followers: id },
    });

    await User.findByIdAndUpdate(
      id,

      {
        $pull: { following: userToFollowId },
      }
    );

    return res.status(200).json("user has been unfollowed");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get user friends

module.exports = router;
