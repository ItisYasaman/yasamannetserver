const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

// Add a new post
router.post("/", auth, async (req, res) => {
  const { title, content, imageUrl, tags, date, featured } = req.body; // Include featured

  if (!tags || tags.length === 0) {
    return res.status(400).json({ message: "Tags are required" });
  }

  try {
    const newPost = new Post({
      title,
      content,
      imageUrl,
      author: req.user.id,
      tags,
      date: new Date(date).toISOString(),
      featured: featured || false,
    });

    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all posts - public access
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get posts by tag - public access
router.get("/tag/:tag", async (req, res) => {
  const { tag } = req.params;
  try {
    const posts = await Post.find({ tags: tag }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single post by ID - public access
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a post
router.put("/:id", auth, async (req, res) => {
  const { title, content, imageUrl, tags, date, featured } = req.body; // Include featured

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.tags = tags || post.tags;
    post.date = new Date(date) || post.date;
    post.featured = featured !== undefined ? featured : post.featured;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark post as featured
router.patch("/:id/feature", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { featured: true },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch featured posts
router.get("/featured", async (req, res) => {
  try {
    console.log("Fetching featured posts"); // Logging

    const posts = await Post.find({ featured: true }).limit(10);
    console.log("Featured posts fetched successfully"); // Logging

    res.json(posts);
  } catch (err) {
    console.error("Error fetching featured posts:", err); // Logging

    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
