const mongoose = require("mongoose");

const User = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  refreshToken: { type: String },
  roles: [],
});

const model = mongoose.model("User", User);

module.exports = model;
