const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new mongoose.Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = FriendRequest = mongoose.model(
  "friendrequest",
  FriendRequestSchema
);
