const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require('../controllers/reviews')
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

const router = express.Router({ mergeParams: true });

//Create a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);

//Delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
