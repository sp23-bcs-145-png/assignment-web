// seed/seedProducts.js
const mongoose = require("mongoose");
const config = require("config");
const Product = require("../dbmodels/Product");

async function run() {
  await mongoose.connect(config.get("db"));

  await Product.deleteMany({});

  await Product.insertMany([
    {
      name: "Basic Shoot Package",
      price: 120,
      category: "Studio",
      image: "/assets/studio2.jpeg",
      description: "1 hour studio shoot + 10 edited photos."
    },
    {
      name: "Premium Shoot Package",
      price: 250,
      category: "Studio",
      image: "/assets/gig1.jpg",
      description: "2 hour shoot + 25 edited photos + styling."
    },
    {
      name: "Model Portfolio Package",
      price: 180,
      category: "Portfolio",
      image: "/assets/bella.jpeg",
      description: "Portfolio-building shoot for models."
    },
    {
      name: "Video Reel Package",
      price: 300,
      category: "Video",
      image: "/assets/video.mp4",
      description: "Short cinematic reel for social media."
    }
  ]);

  console.log("✅ Seeded products!");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
