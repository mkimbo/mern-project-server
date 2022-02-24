const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(402);
      const users = await User.find({}).select("_id name email verified roles");
      res.json(users);
    }
  );
};
