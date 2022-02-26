const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const credentials = require("./config/credentials");

//credentials middleware to allow fetching cookies from request
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://jack:project-mern-admin@cluster0.hffg7.mongodb.net/project-mern"
);
//mongoose.connect("mongodb://localhost:27017/project-mern");
//mongodb+srv://<username>:<password>@cluster0.hffg7.mongodb.net/test

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

const server = http.createServer(app);

/* const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
}); */

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
