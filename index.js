const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const credentials = require("./config/credentials");

const PORT = process.env.PORT || 80;

//credentials middleware to allow fetching cookies from request
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

mongoose.connect(process.env.MONGO_DB_URI);
//mongodb+srv://<username>:<password>@cluster0.hffg7.mongodb.net/project-mern

app.post("/api/login", require("./controllers/loginController"));
app.post("/api/register", require("./controllers/registerController"));
app.get("/api/refreshToken", require("./controllers/refreshTokenController"));
app.get("/api/users", require("./controllers/usersController").getAllUsers);
app.get(
  "/api/getUserById",
  require("./controllers/usersController").getUserById
);
app.post(
  "/api/followUser",
  require("./controllers/usersController").followUser
);
app.post(
  "/api/unFollowUser",
  require("./controllers/usersController").unFollowUser
);
app.get("/api/logout", require("./controllers/logoutController"));
app.get("/api/getPosts", require("./controllers/postsController").getAllPosts);
app.get(
  "/api/getPostById",
  require("./controllers/postsController").getPostById
);
app.post(
  "/api/createPost",
  require("./controllers/postsController").createNewPost
);
app.post(
  "/api/updatePost",
  require("./controllers/postsController").updatePost
);
app.post("/api/likePost", require("./controllers/postsController").likePost);
app.post(
  "/api/removeLike",
  require("./controllers/postsController").removeLike
);
app.post(
  "/api/deletePost",
  require("./controllers/postsController").deletePost
);

app.listen(PORT, () => {
  console.log("SERVER RUNNING");
});
