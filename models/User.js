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
    default:
      "https://res.cloudinary.com/dkgzyvlpc/image/upload/v1634191332/profile-pictures/Asset_6_vgmp0v.png",
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
        ref: "users",
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
