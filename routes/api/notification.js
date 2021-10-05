const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Notification = require("../../models/Notification");

// @route   GET api/notification
// @desc    Get all notifications for single user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      receivedby: req.user.id,
    }).sort({ date: -1 });

    if (!notifications)
      return res.status(400).json({ error: "No notifications" });

    res.json(notifications);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// @route   PUT api/notification
// @desc    Adds user id to 'readyby'
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      receivedby: req.user.id,
    }).sort({ date: -1 });

    if (!notifications)
      return res.status(400).json({ error: "No notifications" });

    notifications.forEach((notification) => {
      if (notification.readby.includes(req.user.id)) {
        return;
      } else {
        notification.readby.unshift(req.user.id);
      }
    });

    await notifications.forEach((notification) => notification.save());

    res.json(notifications);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
