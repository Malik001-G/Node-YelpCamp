const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const {
  isLoggedIn,
  validateCampground,
  isAuthor,
} = require("../middleware.js");

// All Campgrounds
router.get("/", catchAsync(campgrounds.index));

//Render form to create campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//Where the form is submitted to - POST
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// Show campground
router.get("/:id", catchAsync(campgrounds.showCampground));

//Render form to edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//Where the edit form is submitted to
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

//delete campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
