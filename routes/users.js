const router = require("express").Router();
const User = require("../models/User");
const middleWare = require("../middleware/middleware");
const Post = require("../models/Post");
// all users
router.get("/allUsers", middleWare, async (req, res) => {
  try {
    const allUser = await User.find();
    return res.status(200).json(allUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// edit user
router.put("/edit", middleWare, async (req, res) => {
  const { id } = req.data;

  try {
    let user = await User.findById(id);

    const { name, website, profileImage, bio, profileCover } = req.body;
    user.name = name || user.name;
    user.website = website || user.website;
    user.profileImage = profileImage || user.profileImage;
    user.bio = bio || user.bio;
    user.profileCover = profileCover || user.profileCover;

    const updatedUser = await user.save();
    console.log(updatedUser, user);
    res
      .status(200)
      .json({ message: "Account updated successfully", updatedUser });
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

  const { id } = req.data;

  if (userToFollowId === id) {
    return res.status(400).json("you cant follow yourself ");
  }

  const user = await User.findById(userToFollowId);

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

// get user following
router.get("/myFollowing/:userId", async (req, res) => {
  try {
    let followingList = [];
    const user = await User.findById(req.params.userId);

    const myFriends = await Promise.all(
      user.following.map((friendId) => User.findById(friendId))
    );
    myFriends.map((friend) => {
      const { _id, username, name, profileImage } = friend;
      followingList.push({ _id, username, name, profileImage });
    });
    return res.status(200).json({ followingList });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get user followers

router.get("/myFollowers/:userId", async (req, res) => {
  try {
    let followersList = [];
    const user = await User.findById(req.params.userId);

    const myFriends = await Promise.all(
      user.followers.map((friendId) => User.findById(friendId))
    );
    myFriends.map((friend) => {
      const { _id, username, name, profileImage } = friend;
      followersList.push({ _id, username, name, profileImage });
    });
    return res.status(200).json({ followersList });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get a user

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// add post to bookmarks
router.post("/bookmark/:postId", middleWare, async (req, res) => {
  try {
    const { id } = req.data;
    const { postId } = req.params;

    const user = await User.findById(id);
    let updateBookmark = false;

    await user.bookmarks.forEach(async (id, index) => {
      if (id.toString() === postId.toString()) {
        user.bookmarks.splice(index, 1);
        updateBookmark = true;
        await user.save();
      }
    });

    if (updateBookmark) {
      return res.json({ success: true, bookmarks: user.bookmarks });
    }

    user.bookmarks.unshift(postId);
    await user.save();
    return res.json({ success: true, bookmarks: user.bookmarks });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get all bookmarks
router.get("/bookmarks", middleWare, async (req, res) => {
  try {
    const { id } = req.data;
    const bookmarks = await User.findById(id)
      .populate({
        path: "bookmarks",
        populate: {
          path: "userId",
          select: "name username profileImage",
        },
      })
      .select("bookmarks -_id")
      .lean();

    return res.json({ success: true, bookmarks });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
