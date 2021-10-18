const router = require("express").Router();
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");
const auth = require("../../middleware/auth");

// @route   POST api/messages
// @desc    Add new message
// @access  Private
router.post("/", auth, async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const conversation = await Conversation.findById(req.body.conversationId);

    if (!conversation) {
      throw new Error("Conversation does not exist");
    }

    if (!conversation.members.find((memb) => memb.equals(req.body.sender))) {
      throw new Error("Sender is not in conversation");
    }

    if (!newMessage.sender.equals(req.user.id)) {
      throw new Error("Sender does not match token");
    }

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route   GET api/messages/conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get("/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
