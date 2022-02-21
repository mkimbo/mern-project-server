const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

module.exports = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) return res.sendStatus(403);
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.username) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    res.json({
      username: foundUser.name,
      email: foundUser.email,
      accessToken: accessToken,
      roles: foundUser.roles,
    });
  });
};
