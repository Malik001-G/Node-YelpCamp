(async () => {
  const mongoose = require("mongoose");
  const cities = require("./cities");
  const { places, descriptors } = require("./seedHelpers");
  const Campground = require("../models/campground");
  require("dotenv").config();

  const fetch = (await import("node-fetch")).default; // Dynamic import

  mongoose.connect("mongodb://0.0.0.0:27017/YelpCamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error :"));
  db.once("open", () => {
    console.log(":: Database Connected Captain");
  });

  const sample = (array) => array[Math.floor(Math.random() * array.length)];

  const fetchImages = async () => {
    const url = "https://api.unsplash.com/collections/4480516/photos";
    const accessKey = "UHfmGcR62iLwrAEIAqVdFlBW9hzSxv6MLAsnyLLtXjI";

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Log the data to inspect its structure
      console.log("Unsplash API Response:", data);

      // Check if data is an array before mapping
      if (Array.isArray(data)) {
        return data.map((photo) => photo.urls.small);
      } else {
        throw new Error("Expected an array, but received something else.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
  };

  const seedDB = async () => {
    await Campground.deleteMany({});
    const imageUrls = await fetchImages();

    for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const randomImage = sample(imageUrls);
      const price = Math.floor(Math.random() * 20) + 10;
      const camp = new Campground({
        author: "66f0bd6d2034a95aad3506c7",
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: randomImage,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam",
        price,
      });

      await camp.save();
    }
  };

  seedDB().then(() => {
    mongoose.connection.close();
  });
})();
