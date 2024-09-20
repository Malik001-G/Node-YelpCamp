const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");

mongoose.connect("mongodb://0.0.0.0:27017/YelpCamp");

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
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

//campground routes reference using Express Router
app.use("/campgrounds", campgrounds);

//Review routes reference using Express Router
app.use("/campgrounds/:id/reviews", reviews);

// Basic 404
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//Basic Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(
    "Server up and running on port 3000...How is it going Sarge DB ??"
  );
});
