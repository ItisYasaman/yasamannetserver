// server/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
  tags: { type: [String], required: true },
  date: { type: Date, required: true },
  featured: { type: Boolean, default: false },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
