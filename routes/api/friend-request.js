const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");

const User = require("../../models/User");
const FriendRequest = require("../../models/FriendRequest");
const Notification = require("../../models/Notification");

// @route   GET api/friend-request
// @desc    Get friend requests for a single user
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const friendrequests = await FriendRequest.find({
      $or: [{ receiver: req.user.id }, { sender: req.user.id }],
    });

    res.json(friendrequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/friend-request/:id
// @desc    Make a friend request
// @access  Private
router.post("/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.user.id == req.params.id) {
      return res
        .status(400)
        .json({ error: "You cannot send friend request to yourself" });
    }

    if (user.friends.includes(req.user.id)) {
      return res.status(400).json({ error: "Already Friends" });
    }

    const existingFriendRequest = await FriendRequest.findOne({
      sender: req.user.id,
      receiver: req.params.id,
    });
    if (existingFriendRequest) {
      return res.status(400).json({ error: "Friend Request already sent" });
    }
    const existingFriendRequest2 = await FriendRequest.findOne({
      sender: req.params.id,
      receiver: req.user.id,
    });
    if (existingFriendRequest2) {
      return res
        .status(400)
        .json({ error: "They've already sent you a friend request" });
    }

    const newFriendRequest = new FriendRequest({
      sender: req.user.id,
      receiver: req.params.id,
    });

    const friendRequest = await newFriendRequest.save();

    // Notification
    const sender = await FriendRequest.findById(friendRequest.id).populate(
      "sender",
      ["name"]
    );

    const newNotification = new Notification({
      body: `${sender.sender.name} has sent you friend request`,
      sender: req.user.id,
      id: friendRequest.id,
      count: 1,
      receivedby: [req.params.id],
      profilepicture: user.profilepicture,
    });

    await newNotification.save();

    res.json(friendRequest);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// @route   PUT api/friend-request/:request_id
// @desc    Accept a friend request
// @access  Private
router.put(
  "/:request_id",
  [auth, checkObjectId("request_id")],
  async (req, res) => {
    try {
      const friendRequest = await FriendRequest.findById(req.params.request_id);
      if (!friendRequest) {
        return res
          .status(404)
          .json({ error: "Request already accepted or not sent yet" });
      }

      const sender = await User.findById(friendRequest.sender).select(
        "-password"
      );
      const currentUser = await User.findById(req.user.id).select("-password");

      if (sender.friends.includes(friendRequest.receiver)) {
        return res.status(400).json({ error: "Already in your friends list" });
      }
      if (currentUser.friends.includes(friendRequest.sender)) {
        return res.status(400).json({ error: "Already in your friends list" });
      }

      // Create friend object
      const newFriendCurrent = {
        user: req.user.id,
        name: currentUser.name,
        profilepicture: currentUser.profilepicture,
      };

      const newFriendSender = {
        user: friendRequest.sender,
        name: sender.name,
        profilepicture: sender.profilepicture,
      };

      sender.friends.unshift(newFriendCurrent);
      await sender.save();

      currentUser.friends.unshift(newFriendSender);
      await currentUser.save();

      await FriendRequest.deleteOne({ _id: req.params.request_id });

      // Notification
      await Notification.deleteOne({ id: req.params.request_id });
      const user = await User.findById(req.user.id).select("-password");

      const newNotification = new Notification({
        body: `${currentUser.name} has accepted your friend request`,
        sender: currentUser.id,
        id: null,
        status: "GENERAL",
        count: 1,
        receivedby: [friendRequest.sender],
        profilepicture: user.profilepicture,
      });

      await newNotification.save();

      res.status(200).json({ message: "Friend Request Accepted" });
    } catch (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// @route   DELETE api/friend-request/decline/:request_id
// @desc    Decline a friend request
// @access  Private
router.delete(
  "/decline/:request_id",
  [auth, checkObjectId("request_id")],
  async (req, res) => {
    try {
      const friendRequest = await FriendRequest.findById(
        req.params.request_id
      ).populate("receiver", ["name"]);
      if (!friendRequest) {
        return res
          .status(404)
          .json({ error: "Request already declined or not sent yet" });
      }

      await FriendRequest.deleteOne({ _id: req.params.request_id });

      // Notification
      await Notification.deleteOne({ id: req.params.request_id });

      const user = await User.findById(req.user.id).select("-password");

      const newNotification = new Notification({
        body: `${friendRequest.receiver.name} has declined your friend request`,
        sender: req.user.id,
        id: null,
        count: 1,
        status: "GENERAL",
        receivedby: [friendRequest.sender],
        profilepicture: user.profilepicture,
      });

      await newNotification.save();

      res.status(200).json({ message: "Friend Request Declined" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// @route   DELETE api/friend-request/cancel/:request_id
// @desc    Cancel a friend request
// @access  Private
router.delete(
  "/cancel/:request_id",
  [auth, checkObjectId("request_id")],
  async (req, res) => {
    try {
      const friendRequest = await FriendRequest.findById(
        req.params.request_id
      ).populate("receiver");
      if (!friendRequest) {
        return res
          .status(404)
          .json({ error: "Request already canceled or not sent yet" });
      }
      await FriendRequest.deleteOne({ _id: req.params.request_id });

      // Notification
      await Notification.deleteOne({ id: req.params.request_id });

      res.status(200).json({ message: "Friend Request Canceled" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
