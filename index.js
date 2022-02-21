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

mongoose.connect("mongodb://localhost:27017/project-mern");

app.post("/api/login", require("./controllers/loginController"));
app.post("/api/register", require("./controllers/registerController"));
app.get("/api/refreshToken", require("./controllers/refreshTokenController"));
app.get("/api/users", require("./controllers/usersController"));
app.get("/api/logout", require("./controllers/logoutController"));
app.get("/api/getPosts", require("./controllers/postsController").getAllPosts);
app.post(
  "/api/createPost",
  require("./controllers/postsController").createNewPost
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
