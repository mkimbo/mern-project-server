const User = require("../models/user");

module.exports = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken: refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  let userData = {
    name: foundUser.name,
    password: foundUser.password,
    email: foundUser.email,
    refreshToken: "",
    roles: foundUser.roles,
  };
  const updatedUser = await User.findOneAndUpdate(
    { email: foundUser.email },
    userData,
    { new: true }
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};
