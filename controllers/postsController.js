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
      if (err) return res.sendStatus(402);
      try {
        const newPost = {
          author: decoded.username,
          content: req.body.content,
          date: new Date().getTime(),
        };
        const savedPost = await Posts.create(newPost);
        await User.updateOne({ _id: decoded.username }, { $inc: { posts: 1 } });
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
      if (err) return res.sendStatus(402);
      if (decoded.username !== foundPost.author) return res.sendStatus(403);
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

const likePost = async (req, res) => {
  const { post_id } = req.body;
  if (!post_id)
    return res.status(400).json({ error: "Provide ID of the post to like" });
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
      if (err) return res.sendStatus(402);
      try {
        let foundLike;
        foundPost.likes.forEach((element) => {
          if (element.user_id === decoded.username) {
            foundLike = element.user_id;
          }
        });
        if (!foundLike) {
          const likedPost = await Posts.findOneAndUpdate(
            { _id: post_id },
            {
              $push: {
                likes: [
                  {
                    user_id: decoded.username,
                  },
                ],
              },
            },
            { new: true }
          );
          await User.populate(likedPost, [
            {
              path: "author",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(likedPost);
        } else {
          await User.populate(foundPost, [
            {
              path: "author",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(foundPost);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const removeLike = async (req, res) => {
  const { post_id } = req.body;
  if (!post_id)
    return res.status(400).json({ error: "Provide ID of the post to unlike" });
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
      if (err) return res.sendStatus(402);
      try {
        let foundLike;
        foundPost.likes.forEach((element) => {
          if (element.user_id === decoded.username) {
            foundLike = element.user_id;
          }
        });
        if (foundLike) {
          const unlikedPost = await Posts.findOneAndUpdate(
            {
              _id: post_id,
            },
            {
              $pull: {
                likes: { user_id: foundLike },
              },
            },
            { new: true }
          );
          await User.populate(unlikedPost, [
            {
              path: "author",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(unlikedPost);
        } else {
          await User.populate(foundPost, [
            {
              path: "author",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(foundPost);
        }
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
      if (err) return res.sendStatus(402);
      if (decoded.username !== foundPost.author) return res.sendStatus(403);
      try {
        await Posts.findByIdAndRemove({ _id: post_id });
        await User.updateOne(
          { _id: decoded.username },
          { $inc: { posts: -1 } }
        );
        res.status(201).json({ success: "Post has been deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const getPostById = async (req, res) => {
  const { post_id } = req.query;
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
  likePost,
  removeLike,
  deletePost,
  getPostById,
};
