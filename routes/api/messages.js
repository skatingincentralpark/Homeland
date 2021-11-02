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
    const conversation = await Conversation.findById(
      req.body.conversationId
    ).populate("members", ["name", "profilepicture", "friends"]);

    if (!conversation) {
      throw new Error("Conversation does not exist");
    }

    if (!conversation.members.find((memb) => memb.equals(req.body.sender))) {
      throw new Error("Sender is not in conversation");
    }

    if (!newMessage.sender.equals(req.user.id)) {
      throw new Error("Sender does not match token");
    }

    conversation.latestMessage = req.body.text;

    const receiverId = conversation.members.find(
      (memb) => !memb.equals(req.body.sender)
    );
    conversation.unread = receiverId;

    await conversation.save();
    const savedMessage = await newMessage.save();

    res.status(200).json({ conversation, savedMessage });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// // @route   GET api/messages/conversationId
// // @desc    Get messages for a conversation
// // @access  Private
// router.get("/:conversationId", auth, async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });

//     const conversation = await Conversation.findById(
//       req.params.conversationId
//     ).populate("members", ["name", "profilepicture", "friends"]);

//     if (req.user.id == conversation.unread) {
//       conversation.unread = null;
//       await conversation.save();
//     }

//     res.status(200).json({ messages, conversation });
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

// @route   GET api/messages/:conversationId
// @desc    Get messages for a conversation (first batch)
// @access  Private
router.get("/:conversationId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .limit(12)
      .sort({ createdAt: -1 });

    // const messages = messages1.reverse();

    const conversation = await Conversation.findById(
      req.params.conversationId
    ).populate("members", ["name", "profilepicture", "friends"]);

    if (req.user.id == conversation.unread) {
      conversation.unread = null;
      await conversation.save();
    }

    res.status(200).json({ messages, conversation });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route   GET api/messages/next/:conversationId/:msgId
// @desc    Get messages for a conversation (after first batch)
// @access  Private
router.get("/next/:conversationId/:msgId", auth, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
      _id: { $lt: req.params.msgId },
    })
      .limit(3)
      .sort({ createdAt: -1 });

    // const messages = messages1.reverse();

    console.log(req.params.msgId);
    console.log(messages);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route   PUT api/messages/conversationId
// @desc    Remove unread for conversation
// @access  Private
router.put("/:conversationId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    conversation.unread = null;

    await conversation.save();

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
