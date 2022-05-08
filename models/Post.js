const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: string,
      required: true,
    },
    desc: {
      type: string,
    },
    image: {
      type: string,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
