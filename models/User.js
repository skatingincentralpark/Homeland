const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilepicture: {
    type: String,
    default: "https://media.getty.edu/museum/images/web/enlarge/31280101.jpg",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      profilepicture: {
        type: String,
      },
    },
  ],
  profile: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
