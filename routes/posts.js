const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const postsController = require("../controllers/postsController");
const random = require("random");
const mongoose = require("mongoose");

// GET /
// gets all posts of all users
router.get("/", async (req, res, next) => {
  try {
    if (req.user == null) {
      return res.redirect("/login");
    }
    currentUser = await User.findOne({ _id: req.session.passport.user });
    result = await Post.find({}).populate("owner"); // get all posts
    dataObj = postsController.postMapper(result, req.session.passport.user);
    res.render("index", {
      posts: dataObj.reverse(), // to get the latest posts
      currentUserCredits: currentUser.credits,
      currentUser: currentUser.name,
    });
    next();
  } catch (error) {
    res.status(500).render("status", {
      message: "Error retrieving the list of images from the database.",
    });
    console.log(error);
  }
});

// POST /posts
// uploading posts and saving to mongodb, endpoint is used when user presses upload post
router.post(
  "/posts",
  postsController.uploadFile.single("post"),
  async (req, res, next) => {
    try {
      // can use aws s3 for this, more scalable and a much better way
      // for demo purposes, will be storying binary data into mongodb directly
      const PostModel = new Post(req.body);
      const creditsEarned = random.int(0, 100);
      var postId = mongoose.Types.ObjectId();

      // performing a check on the checkbox for "up for sale"
      if (req.body.marketplaceItem === "on") {
        PostModel.marketplaceItem = true;
      } else {
        PostModel.marketplaceItem = false;
        PostModel.price = null;
      }
      
      const fileContents = req.file.buffer; // image's binary data
      PostModel.imgBinData = fileContents;
      PostModel.owner = req.session.passport.user;
      PostModel._id = postId;
      PostModel.save();

      // transferring the credits to the poster (lottery)
      postOwner = await User.findOne({ _id: req.session.passport.user });
      postOwner.credits += creditsEarned;
      postOwner.save();
      if (req.get('isTesting')) {
        res.send({ postId: postId });
      } else {
        res.render("status", {
          message: `You have gained ${creditsEarned} credits!`,
        });
      }
    } catch (error) {
      res.status(500).render("status", {
        message:
          "The uploaded file must be an image (jpeg, jpg, png, gif), and the max file size is 10MB.",
      });
      console.log(error);
    }
  }
);

// POST /posts/delete (when using React we can switch to DELETE /posts)
// deletes a post based on the postId that's sent in the body
router.post("/posts/delete", async (req, res, next) => {
  try {
    postId = req.body.postId;
    imageQueryRes = await Post.findOne({
      owner: req.session.passport.user,
      _id: postId,
    });
    if (imageQueryRes) {
      await Post.deleteOne({ _id: postId });
      res.status(200).render("status", {
        message: "Successfully deleted the post!",
      });
      return;
    } else {
      res.status(403).render("status", {
        message: "You do not have permissions to delete this post",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting the post" });
    console.log(error);
  }
});

// GET /posts/get_myposts
// retrieves all posts that belong to the authenticated user
router.get("/posts/get_myposts", async (req, res, next) => {
  try {
    if (req.user == null) {
      return res.redirect("/login");
    }
    currentUser = await User.findOne({ _id: req.session.passport.user });
    result = await Post.find({ owner: req.session.passport.user }).populate(
      "owner"
    );
    dataObj = postsController.postMapper(result, req.session.passport.user);
    res.render("index", {
      posts: dataObj.reverse(),
      currentUserCredits: currentUser.credits,
      currentUser: currentUser.name,
    });
  } catch (error) {
    res.status(500).render("status", {
      message: "Error retrieving the list of images from the database.",
    });
    console.log(error);
  }
});

// GET /posts/get_marketplace
// retrieves all posts that are up for sale
router.get("/posts/get_marketplace", async (req, res, next) => {
  try {
    if (req.user == null) {
      return res.redirect("/login");
    }
    currentUser = await User.findOne({ _id: req.session.passport.user });
    result = await Post.find({ marketplaceItem: true }).populate("owner");
    dataObj = postsController.postMapper(result, req.session.passport.user);
    res.render("index", {
      posts: dataObj.reverse(),
      currentUserCredits: currentUser.credits,
      currentUser: currentUser.name,
    });
  } catch (error) {
    res.status(500).render("status", {
      message: "Error retrieving the list of images from the database.",
    });
    console.log(error);
  }
});

// POST /posts/update
// unused but can be utilized in the future to update captions on posts
router.post("/posts/update", async (req, res, next) => {
  try {
    imageId = req.body.imageId;
    imageQueryRes = await Post.findOne({
      owner: req.session.passport.user,
      _id: imageId,
    });
    if (imageQueryRes) {
      if (req.body.caption != null) {
        console.log(imageId, req.body.caption);
        await Post.updateOne(
          { _id: imageId },
          { $set: { caption: req.body.caption } }
        );
      } else if (req.body.hashtags != null) {
        await Post.updateOne(
          { _id: imageId },
          { $set: { hashtags: req.body.hashtags } }
        );
      } else {
        res
          .status(500)
          .send({ message: "Include a parameter to update the post with" });
      }
      res.json({ message: "Successfully updated the post" });
      return;
    } else {
      res.status(403).render("status", {
        message: "You do not have permissions to delete this post",
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating the post" });
    console.log(error);
  }
});

module.exports = router;
