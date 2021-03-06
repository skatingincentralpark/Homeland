const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { body, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "profilepicture", "friends"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/photos/:usesrId
// @desc    User specific: Get first batch of photos (9)
// @access  Private
router.get("/photos/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
      image: { $exists: true },
    })
      .limit(9)
      .sort({
        date: -1,
      });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [auth, [body("interests", "Interests is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { interests, ...rest } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      interests: Array.isArray(interests)
        ? interests
        : interests.split(",").map((skill) => skill.trim()),
      ...rest,
    };

    try {
      // Using upsert option (creates new doc if no match is found)
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).populate("user", ["name", "profilepicture", "friends"]);

      const user = await User.findById(req.user.id);

      user.profile = true;
      await user.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id", checkObjectId("user_id"), async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "profilepicture", "friends"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    // delete user from other user's friend's list
    const userFriends = await User.findOne(
      { _id: req.user.id },
      { "friends.user": true }
    );
    userFriends?.friends.map(async (friend) => {
      await User.updateOne(
        { _id: friend.user },
        { $pull: { friends: { user: req.user.id } } }
      );
    });

    // delete messages
    // find conversations
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    });
    conversations.map(async (conv, i) => {
      await Message.deleteMany({
        conversationId: conv._id,
      });
    });

    await Promise.all([
      // Remove user posts
      Post.deleteMany({ user: req.user.id }),
      // Remove profile
      Profile.findOneAndRemove({ user: req.user.id }),
      // Remove user
      User.findOneAndRemove({ _id: req.user.id }),
      // delete conversations
      Conversation.deleteMany({
        members: { $in: [req.user.id] },
      }),
      // delete notifications
      Notification.deleteMany({
        $or: [{ receivedby: req.user.id }, { sender: req.user.id }],
      }),
      // delete friend requests
      FriendRequest.deleteMany({
        $or: [{ receiver: req.user.id }, { sender: req.user.id }],
      }),
      // delete user's comments & likes
      Post.updateMany(
        {
          comments: { $elemMatch: { user: req.user.id } },
        },
        { $pull: { comments: { user: req.user.id } } }
      ),
      Post.updateMany(
        {
          likes: { $elemMatch: { user: req.user.id } },
        },
        { $pull: { likes: { user: req.user.id } } }
      ),
    ]);

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
