const router = require("express").Router();
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
// like a post
// comment a post
// get a post
// get timeline posts

module.exports = router;
