const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// POST /buy
// given a postId, check if user can buy the post, if the user can, then change the owner of the post
// to the user that just bought it
// the credits will also be transferred to the seller
router.post('/buy', async (req, res, next) => {
    let postId = req.body.postId;
    userRes = await User.findOne({_id: req.session.passport.user});
    postRes = await Post.findOne({_id: postId});
    originalPostOwner = await User.findOne({_id: postRes.owner});

    // check if user is trying to buy their own post
    if (postRes.owner.equals(userRes._id)) {
        res.render('status', {
            message: "You cannot purchase your own posts!"
        });
        return;
    // check if user is trying to buy a post that's not for sale
    } else if (!postRes.marketplaceItem) {
        res.render('status', {
            message: "This post is not up for sale!"
        });
        return;
    }
    // if user has enough credits, initiate the purchase
    if (userRes.credits >= postRes.price) {
        userRes.credits -= postRes.price;
        postRes.owner = req.session.passport.user;
        postRes.marketplaceItem = false;
        postRes.price = null;
        originalPostOwner.credits += postRes.price;

        userRes.save();
        postRes.save();
        originalPostOwner.save();
        res.render('status', {
            message: "You have successfully purchased the post."
        });
    } else { // not enough credits to purchase the post
        res.render('status', {
            message: "You have insufficient credits to purchase the post. Post more to earn credits!"
        });
    }
    return;
});

module.exports = router;