const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id)
    return res.status(400).json({ error: "Provide ID of the user" });
  const foundUser = await User.findOne({ _id: user_id });
  if (!foundUser)
    return res
      .status(400)
      .json({ error: "We could not find a user with the ID you provided" });
  await User.populate(foundUser, [
    {
      path: "follower.user_id",
      select: "_id name email",
      model: "User",
    },
    {
      path: "following.user_id",
      select: "_id name email",
      model: "User",
    },
  ]);
  res.json(foundUser);
};
