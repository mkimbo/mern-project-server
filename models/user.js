const mongoose = require("mongoose");

const User = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  refreshToken: { type: String },
  posts: { type: Number, default: 0 },
  roles: [],
  followers: [{ user_id: { type: String, ref: "User" } }],
  following: [{ user_id: { type: String, ref: "User" } }],
});

const model = mongoose.model("User", User);

module.exports = model;
