const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

module.exports = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd)
    return res.status(400).json({ error: "Email and password are required." });
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { username: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "360000s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    let userData = {
      refreshToken: refreshToken,
      roles: foundUser.roles,
    };
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      userData,
      {
        new: true,
      }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      email: updatedUser.email,
      accessToken: accessToken,
      roles: updatedUser.roles,
    });
  } else {
    res.sendStatus(401);
  }
};
