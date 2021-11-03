const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    latestMessage: { type: String, default: null },
    unread: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

module.exports = FriendRequest = mongoose.model(
  "conversation",
  ConversationSchema
);
