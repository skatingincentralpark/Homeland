const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const { body, validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

const Post = require("../../models/Post");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

const config = require("config");
const cloudName = config.get("cloudName");
const apiKey = config.get("apiKey");
const apiSecret = config.get("apiSecret");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post("/", [auth], async (req, res) => {
  try {
    if (
      req.body.text.length === 1 &&
      !req.body.text[0].trim() &&
      !req.body.image
    ) {
      throw new Error("Please enter text");
    }

    const user = await User.findById(req.user.id).select("-password");

    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      image: undefined,
      name: user.name,
      profilepicture: user.profilepicture,
    });

    if (req.body.image) {
      newPost.image = req.body.image;
    }

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// @route   GET api/posts
// @desc    Universal: Get first batch of posts
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().limit(3).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/next/:postid
// @desc    Universal: Get posts after first batch
// @access  Private
router.get("/next/:postId", auth, async (req, res) => {
  try {
    const posts = await Post.find({
      _id: { $lt: req.params.postId },
    })
      .limit(3)
      .sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/user/:userId
// @desc    User specific: Get first batch of posts
// @access  Private
router.get("/user/:userId", auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).limit(3).sort({
      date: -1,
    });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/user/:userId/next/:postId
// @desc    User specific: Get posts after first batch
// @access  Private
router.get("/user/:userId/next/:postId", auth, async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.params.userId,
      _id: { $lt: req.params.postId },
    })
      .limit(3)
      .sort({
        date: -1,
      });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get("/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post by ID
// @access  Private
router.delete("/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.image) {
      const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
      const imageToDelete = post.image.match(regex)[1];

      cloudinary.uploader.destroy(imageToDelete, function (result) {
        console.log("success");
      });
    }

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorised" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id).select("-password");

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id, name: user.name });

    // ------ NOTIFICATION ------ //
    // If user is liking own post, don't create notification
    if (req.user.id == post.user) {
      await post.save();
      return res.json(post.likes);
    }

    // Check if notification exists
    const notification = await Notification.findOne({
      id: req.params.id,
      status: "LIKE",
    });

    // Get name & profilepic for notification body (finds name that isn't post author)
    const { name } = post.likes.find((like) => !like.user.equals(post.user));
    const notificationDisplayUser = post.likes.find(
      (like) => !like.user.equals(post.user)
    );

    const { profilepicture } = await User.findById(
      notificationDisplayUser.user
    ).select("-password");

    // Two scenarios: notification exists or doesn't
    // Exists: Refresh notification// Doesn't Exist: Create new notification
    if (notification) {
      notification.count = notification.count + 1;
      notification.readby = [];
      notification.body = `${name} and ${notification.count - 1} ${
        notification.count > 2
          ? "others have liked your post"
          : "other person have liked your post"
      }`;
      notification.sender = req.user.id;
      notification.date = Date.now();
      notification.profilepicture = profilepicture;

      await notification.save();
    } else {
      newNotification = new Notification({
        body: `${name} has liked your post`,
        sender: req.user.id,
        id: req.params.id,
        status: "LIKE",
        count: 1,
        receivedby: [post.user],
        profilepicture: profilepicture,
      });

      await newNotification.save();
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id).select("-password");

    // Check if the post has not yet been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Remove the like
    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    // ------ NOTIFICATION ------ //
    // If user is unliking own post, don't touch notification
    if (req.user.id == post.user) {
      await post.save();
      return res.json(post.likes);
    }

    const notification = await Notification.findOne({
      id: req.params.id,
      status: "LIKE",
    });

    // Get name for notification body (finds name that isn't post author)
    let name;
    if (post.likes.length > 0) {
      const like = post.likes.find((like) => !like.user.equals(post.user));
      name = like.name;
    }

    // Three scenarios (after an unlike):
    // 0 people left // 1 person left // 2 people left // 2+ people left
    // Remove notification if it's last like
    notification.count = notification.count - 1;
    if (notification.count === 0) {
      await Notification.findOneAndRemove({
        id: req.params.id,
        status: "LIKE",
      });
    } else if (notification.count === 1) {
      notification.body = `${name} has liked your post`;
      await notification.save();
    } else if (notification.count === 2) {
      notification.body = `${name} and 1 other person has liked your post`;
      await notification.save();
    } else {
      notification.body = `${name} and ${
        notification.count - 1
      } other people have liked your post`;
      await notification.save();
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comments/:id
// @desc    Comment on a post
// @access  Private
router.post("/comments/:id", [auth, checkObjectId("id")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);

    // For notification: checks if user has commented before, must be called before comment object is created
    const commentedBefore = post.comments.find((comment) =>
      comment.user.equals(req.user.id)
    );

    const newComment = {
      text: req.body,
      name: user.name,
      profilepicture: user.profilepicture,
      user: req.user.id,
    };

    post.comments.unshift(newComment);

    // // ------ NOTIFICATION ------
    // // check if user commenting has commented before
    // // if they have, refresh notification
    // // add to line 291 a new if check,
    // // reset read by and date..

    // // If user is commenting on own post, don't create notification
    // if (req.user.id == post.user) {
    //   await post.save();
    //   return res.json(post.comments);
    // }

    // const notification = await Notification.findOne({
    //   id: req.params.id,
    //   status: "COMMENT",
    // });

    // // Get name for notification body (finds name that isn't post author)
    // const { name } = post.comments.find(
    //   (comment) => !comment.user.equals(post.user)
    // );

    // // Three scenarios: commented before // notification exists // doesn't exist
    // // Commented Before: Refreshes notification (w/out adding count) // Exists: Refresh notification// Doesn't Exist: Create new notification
    // if (commentedBefore) {
    //   notification.readyBy = [];
    //   notification.date = Date.now();
    //   notification.sender = req.user.id;
    //   await notification.save();
    // } else if (notification) {
    //   notification.count = notification.count + 1;
    //   notification.readby = [];
    //   notification.body = `${name} and ${notification.count - 1} ${
    //     notification.count > 2
    //       ? "others have commented on your post"
    //       : "other person have commented on your post"
    //   }`;
    //   notification.sender = req.user.id;
    //   notification.date = Date.now();
    //   await notification.save();
    // } else {
    //   newNotification = new Notification({
    //     body: `${name} has commented your post`,
    //     sender: req.user.id,
    //     id: req.params.id,
    //     status: "COMMENT",
    //     count: 1,
    //     receivedby: [post.user],
    //   });
    //   await newNotification.save();
    // }

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/comments/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete(
  "/comments/:id/:comment_id",
  [checkObjectId("id"), checkObjectId("comment_id"), auth],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: "Comment does not exist" });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );

      // // ------ NOTIFICATION ------ //
      // // If user is removing comment on own post, don't touch notification
      // if (req.user.id == post.user) {
      //   await post.save();
      //   return res.json(post.comments);
      // }

      // const notification = await Notification.findOne({
      //   id: req.params.id,
      //   status: "COMMENT",
      // });

      // // Get name for notification body (finds name that isn't post author)
      // let name;
      // if (post.comments.length > 0) {
      //   const comment = post.comments.find(
      //     (comment) => !comment.user.equals(post.user)
      //   );
      //   name = comment.name;
      // }

      // // Three scenarios (after an un-comment):
      // // 0 people left // 1 person left // 2 people left // 2+ people left
      // // Remove notification if it's last comment
      // const userStillHasComments = post.comments.find((comment) => {
      //   comment.user.equals(req.user.id);
      // });

      // // If user doesn't have anymore comments, THEN reduce the count
      // if (!userStillHasComments) {
      //   notification.count = notification.count - 1;
      // }

      // if (notification.count === 0) {
      //   await Notification.findOneAndRemove({
      //     id: req.params.id,
      //     status: "COMMENT",
      //   });
      // } else if (notification.count === 1) {
      //   notification.body = `${name} has commented on your post`;
      //   await notification.save();
      // } else if (notification.count === 2) {
      //   notification.body = `${name} and 1 other person have commented on your post`;
      //   await notification.save();
      // } else {
      //   notification.body = `${name} and ${
      //     notification.count - 1
      //   } other people have commented on your post`;
      //   await notification.save();
      // }

      // ********** will this work if notification is findAndRemove?  (line 218)
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
