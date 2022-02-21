const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res.status(400).json({ error: "All fields are required." });
  // check for duplicate email in the db
  const duplicate = await User.findOne({ email: email });
  if (duplicate)
    return res.status(409).json({ error: "Email is already taken" });
  try {
    //hash the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = {
      _id: email,
      name: email.split("@")[0],
      password: hashedPwd,
      email: email,
      roles: [101],
    };
    const savedUser = await User.create(newUser);
    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
