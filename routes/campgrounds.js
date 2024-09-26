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

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
//Regrouping the routes

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// // All Campgrounds
// router.get("/", catchAsync(campgrounds.index));

// //Render form to create campground
// router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// //Where the form is submitted to - POST
// router.post(
//   "/",
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );

// // Show campground
// router.get("/:id", catchAsync(campgrounds.showCampground));

// //Render form to edit campground
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.renderEditForm)
// );

// //Where the edit form is submitted to
// router.put(
//   "/:id",
//   isLoggedIn,
//   isAuthor,
//   validateCampground,
//   catchAsync(campgrounds.updateCampground)
// );

// //delete campground
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isAuthor,
//   catchAsync(campgrounds.deleteCampground)
// );

module.exports = router;
