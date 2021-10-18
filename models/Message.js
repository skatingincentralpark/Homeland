const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
    },
    sender: {
      type: Schema.Types.ObjectId,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = Message = mongoose.model("message", MessageSchema);
