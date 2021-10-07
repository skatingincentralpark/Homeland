const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  id: {
    type: Schema.Types.ObjectId,
    ref: "id",
  },
  status: {
    type: String,
    enum: ["FRIEND", "LIKE", "COMMENT", "GENERAL"],
    default: "FRIEND",
  },
  count: {
    type: Number,
    default: 0,
  },
  profilepicture: {
    type: String,
  },
  receivedby: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  readby: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Notification = mongoose.model(
  "notification",
  NotificationSchema
);
