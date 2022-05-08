const router = require("express").Router();
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account updated successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account");
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
// follow a user

router.put("/follow/:id", async (req, res) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.body.userId;

  if (userToFollowId === currentUserId) {
    return res.status(400).json("you cant follow yourself ");
  }

  const user = await User.findById(userToFollowId);
  const currentUser = await User.findById(currentUserId);

  if (user.followers.includes(currentUserId)) {
    return res.status(400).json("you already following ");
  }

  try {
    await User.findByIdAndUpdate(userToFollowId, {
      $push: { followers: currentUserId },
    });

    await User.findByIdAndUpdate(
      currentUserId,

      {
        $push: { following: userToFollowId },
      }
    );

    return res.status(200).json("user has been followed");
  } catch (err) {
    return res.status(500).json(err);
  }
});

// unfollow a user

router.put("/unfollow/:id", async (req, res) => {
  const userToFollowId = req.params.id;
  const currentUserId = req.body.userId;

  if (userToFollowId === currentUserId) {
    return res.status(400).json("you cant unfollow yourself ");
  }

  const user = await User.findById(userToFollowId);
  const currentUser = await User.findById(currentUserId);

  if (!user.followers.includes(currentUserId)) {
    return res.status(400).json("you dont follow this user ");
  }

  try {
    await User.findByIdAndUpdate(userToFollowId, {
      $pull: { followers: currentUserId },
    });

    await User.findByIdAndUpdate(
      currentUserId,

      {
        $pull: { following: userToFollowId },
      }
    );

    return res.status(200).json("user has been unfollowed");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
