const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
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
