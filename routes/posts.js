const router = require("express").Router();

const Post = require("../models/Post");
const middleWare = require("../middleware/middleware");

// get all posts
router.get("/allposts", middleWare, async (req, res) => {
  try {
    const allPost = await Post.find().populate("userId");

    return res.status(200).json({ allPost });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get users post (userid)
router.get("/userPosts/:id", middleWare, async (req, res) => {
  try {
    const userPosts = await Post.find({ userId: req.params.id }).populate(
      "userId"
    );
    res.status(200).json({ userPosts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// create post

router.post("/", middleWare, async (req, res) => {
  const { id } = req.data;

  const newPost = new Post({ userId: id, ...req.body });
  try {
    const savedPost = await newPost.save();

    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// update post (send post id)
router.put("/:id", middleWare, async (req, res) => {
  const { id } = req.data;

  try {
    const post = await Post.findById(req.params.id);

    if (post.userId._id.toString() !== id) {
      return res.status(401).json("you can update only your post");
    }
    await post.updateOne({ $set: req.body });
    res.status(200).json("The post is updated");
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a post (send post id)
router.delete("/:id", middleWare, async (req, res) => {
  const { id } = req.data;
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId._id.toString() !== id) {
      return res.status(401).json("you can delete only your post");
    }
    await post.deleteOne();
    res.status(200).json("The post is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// like/dislike a post
router.put("/like/:id", middleWare, async (req, res) => {
  const { id } = req.data;

  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(id)) {
      await post.updateOne({ $push: { likes: id } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: id } });
      res.status(200).json("Post disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// comment a post
router.put("/comments/:id", middleWare, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    await post.updateOne({ $push: { comments: req.body } });
    res.status(200).json("comment added");
  } catch (err) {
    res.status(500).json(err);
  }
});
// get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
