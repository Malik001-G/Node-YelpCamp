const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
mongoose.connect("mongodb://0.0.0.0:27017/YelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error :"));
db.once("open", () => {
  console.log(":: Database Connected Captain");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.render("home");
});

// All Campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//Render form to create campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//Where the form is submitted to - POST
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Show campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

//Render form to edit campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//Where the edit form is submitted to
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// Basic 404
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Basic Error Handler
app.use((err, req, res, next) => {
  const { message = "Something went wrong", statusCode = 500 } = err;
  res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log(
    "Server up and running on port 3000...How is it going Sarge DB ??"
  );
});
