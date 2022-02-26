const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getAllUsers = async (req, res) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(402);
      const users = await User.find({}).select(
        "_id name email verified roles posts followers following"
      );
      res.json(users);
    }
  );
};

const getUserById = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id)
    return res.status(400).json({ error: "Provide ID of the user" });
  const foundUser = await User.findOne({ _id: user_id }).select(
    "_id name email posts followers following roles verified"
  );
  if (!foundUser)
    return res
      .status(400)
      .json({ error: "We could not find a user with the ID you provided" });
  await User.populate(foundUser, [
    {
      path: "followers.user_id",
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

const followUser = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id)
    return res.status(400).json({ error: "Provide ID of the user to follow" });
  const foundUser = await User.findOne({ _id: user_id }).select(
    "_id name email posts followers following roles verified"
  );
  if (!foundUser)
    return res
      .status(400)
      .json({ error: "We could not find a user with the ID you provided" });
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(402);
      try {
        let foundFollow;
        foundUser.followers.forEach((element) => {
          if (element.user_id === decoded.username) {
            foundFollow = element.user_id;
          }
        });
        if (!foundFollow) {
          const followedUser = await User.findOneAndUpdate(
            { _id: user_id },
            {
              $push: {
                followers: [
                  {
                    user_id: decoded.username,
                  },
                ],
              },
            },
            { new: true }
          );
          await User.findOneAndUpdate(
            { _id: decoded.username },
            {
              $push: {
                following: [
                  {
                    user_id: user_id,
                  },
                ],
              },
            }
          );
          await User.populate(followedUser, [
            {
              path: "followers.user_id",
              select: "_id name email",
              model: "User",
            },
            {
              path: "following.user_id",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json({
            _id: followedUser._id,
            name: followedUser.name,
            email: followedUser.email,
            roles: followedUser.roles,
            posts: followedUser.posts,
            followers: followedUser.followers,
            following: followedUser.following,
          });
        } else {
          await User.populate(foundUser, [
            {
              path: "followers.user_id",
              select: "_id name email",
              model: "User",
            },
            {
              path: "following.user_id",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(foundUser);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

const unFollowUser = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id)
    return res
      .status(400)
      .json({ error: "Provide ID of the user to unfollow" });
  const foundUser = await User.findOne({ _id: user_id }).select(
    "_id name email posts followers following roles verified"
  );
  if (!foundUser)
    return res
      .status(400)
      .json({ error: "We could not find a user with the ID you provided" });
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(402);
      try {
        let foundFollow;
        foundUser.followers.forEach((element) => {
          if (element.user_id === decoded.username) {
            foundFollow = element.user_id;
          }
        });
        if (foundFollow) {
          const unFollowedUser = await User.findOneAndUpdate(
            { _id: user_id },
            {
              $pull: {
                followers: { user_id: foundFollow },
              },
            },
            { new: true }
          );
          await User.findOneAndUpdate(
            { _id: decoded.username },
            {
              $pull: {
                following: { user_id: user_id },
              },
            }
          );
          await User.populate(unFollowedUser, [
            {
              path: "followers.user_id",
              select: "_id name email",
              model: "User",
            },
            {
              path: "following.user_id",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json({
            _id: unFollowedUser._id,
            name: unFollowedUser.name,
            email: unFollowedUser.email,
            roles: unFollowedUser.roles,
            posts: unFollowedUser.posts,
            followers: unFollowedUser.followers,
            following: unFollowedUser.following,
          });
        } else {
          await User.populate(foundUser, [
            {
              path: "followers.user_id",
              select: "_id name email",
              model: "User",
            },
            {
              path: "following.user_id",
              select: "_id name email",
              model: "User",
            },
          ]);
          res.status(201).json(foundUser);
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  );
};

module.exports = {
  getAllUsers,
  getUserById,
  followUser,
  unFollowUser,
};
