const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  author: { type: String, required: true, ref: "User" },
  content: { type: String, required: true },
  likes: [{ user_id: { type: String, ref: "User" } }],
  date: { type: Number },
});

const model = mongoose.model("Post", Post);

module.exports = model;
