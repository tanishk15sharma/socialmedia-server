const router = require("express").Router();
const res = require("express/lib/response");
const Post = require("../models/Post");
// create post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
// update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId) {
      return res.status(401).json("you can update only your post");
    }
    await post.updateOne({ $set: req.body });
    res.status(200).json("The post is updated");
  } catch (err) {
    res.status(500).json(err);
  }
});
// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId !== req.body.userId) {
      return res.status(401).json("you can delete only your post");
    }
    await post.deleteOne();
    res.status(200).json("The post is deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
// like/dislike a post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Post liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Post disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// comment a post
router.put("/comments/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $push: { comments: req.body.comment } });
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
    res.status(500).json(err);
  }
});

// get timeline posts

module.exports = router;
