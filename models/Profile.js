const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  highschool: {
    type: String,
  },
  college: {
    type: String,
  },
  job: {
    type: String,
  },
  location: {
    type: String,
  },
  relationshipstatus: {
    type: String,
  },
  interests: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  date: {
    type: Date,
    default: Date,
  },
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
