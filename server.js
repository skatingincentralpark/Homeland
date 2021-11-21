const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/friend-request", require("./routes/api/friend-request"));
app.use("/api/notification", require("./routes/api/notification"));
app.use("/api/conversations", require("./routes/api/conversations"));
app.use("/api/messages", require("./routes/api/messages"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // when connect
  console.log("A user has connected");

  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send and get message
  socket.on("sendMessage", (message) => {
    const user = getUser(message.receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // create and receive posts
  socket.on("createPost", (post) => {
    io.emit("getPosts", post);
  });

  // remove posts
  socket.on("removePost", (postId) => {
    io.emit("removePostUpdate", postId);
  });

  // update posts
  socket.on("updatePost", (postId) => {
    io.emit("updatePost", postId);
  });

  // send and get friend request
  socket.on("updateFriendRequest", (receiverdId) => {
    const user = getUser(receiverdId);
    if (user) {
      io.to(user.socketId).emit("getFriendRequests");
    }
  });

  // when disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("manualDisconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
