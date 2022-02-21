const Posts = require("../models/post");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getAllPosts = async (req, res) => {
  const posts = await Posts.find({}).sort({ date: -1 });
  await User.populate(posts, [
    {
      path: "author",
      select: "_id name email",
      model: "User",
    },
  ]);
  res.json(posts);
};

const createNewPost = (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(403);
      try {
        const newPost = {
          author: decoded.username,
          content: req.body.content,
        };
        const savedPost = await Posts.create(newPost);
        await User.populate(savedPost, [
          {
            path: "author",
            select: "_id name email",
            model: "User",
          },
        ]);
        res.status(201).json(savedPost);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const updatePost = async (req, res) => {
  const { post_id, content } = req.body;
  if (!post_id)
    return res.status(400).json({ error: "Provide ID of the post to update" });
  const foundPost = await Posts.findOne({ _id: post_id });
  if (!foundPost)
    return res
      .status(400)
      .json({ error: "We could not find a post with the ID you provided" });
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || decoded.username !== foundPost.author)
        return res.sendStatus(403);
      try {
        const postData = {
          content: content,
        };
        const updatedPost = await Posts.findOneAndUpdate(
          { _id: post_id },
          postData,
          {
            new: true,
          }
        );
        await User.populate(updatedPost, [
          {
            path: "author",
            select: "_id name email",
            model: "User",
          },
        ]);
        res.status(201).json(updatedPost);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const deletePost = async (req, res) => {
  const { post_id } = req.body;
  if (!post_id)
    return res.status(400).json({ error: "Provide ID of the post to delete" });
  const foundPost = await Posts.findOne({ _id: post_id });
  if (!foundPost)
    return res
      .status(400)
      .json({ error: "We could not find a post with the ID you provided" });
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err || decoded.username !== foundPost.author)
        return res.sendStatus(403);
      try {
        await Posts.findByIdAndRemove({ _id: post_id });
        res.status(201).json({ success: "Post has been deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const getPost = async (req, res) => {
  const { post_id } = req.body;
  if (!post_id)
    return res.status(400).json({ error: "Provide ID of the post" });
  const foundPost = await Posts.findOne({ _id: post_id });
  if (!foundPost)
    return res
      .status(400)
      .json({ error: "We could not find a post with the ID you provided" });
  await User.populate(foundPost, [
    {
      path: "author",
      select: "_id name email",
      model: "User",
    },
  ]);
  res.json(foundPost);
};

module.exports = {
  getAllPosts,
  createNewPost,
  updatePost,
  deletePost,
  getPost,
};
