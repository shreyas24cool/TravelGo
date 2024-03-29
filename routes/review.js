const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");               //wrapAsync Func. for Async Functions
const ExpressError = require("../utils/ExpressError.js");                 //Custom class for Error Handling
const Review = require("../models/review.js");
const Listing = require('../models/listing.js');         //Mongoose(MongoDB) Model
const {reviewValidate, isLoggedIn, isReviewAuthor} = require("../middleware.js");


//Review Post Route
router.post("/",isLoggedIn,reviewValidate, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "Review Submitted!");
    res.redirect(`/listings/${id}`);
}));

  
//Review Destroy Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req,res)=>{
  let {id, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId}});
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`)
}));

module.exports = router;