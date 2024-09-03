const express = require("express");
const path = require("path");

const mongoose = require("mongoose");
const Campground = require("./models/campground");
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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  //   res.send("Hello from yelp camp");
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My backyard",
    description: "Keep camping",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log(
    "Server up and running on port 3000...How is it going Sarge DB ??"
  );
});
