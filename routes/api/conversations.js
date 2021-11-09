const router = require("express").Router();
const Conversation = require("../../models/Conversation");
const auth = require("../../middleware/auth");

// @route   POST api/conversations
// @desc    Create new conversation
// @access  Private
router.post("/", [auth], async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    if (!req.body.senderId || !req.body.receiverId) {
      res.status(500).json(err);
    }

    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @route   GET api/conversations/userId
// @desc    Get a user's conversations
// @access  Private
router.get("/:userId", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .populate("members", ["name", "profilepicture", "friends"])
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
});

// @route   GET api/conversations/find/:firstUserId/:secondUserId
// @desc    Get a user conversation including two user ids
// @access  Private
router.get("/find/:firstUserId/:secondUserId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
