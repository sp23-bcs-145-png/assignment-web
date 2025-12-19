// routes/bookings.js
const express = require("express");
const Booking = require("../dbmodels/booking");
const Product = require("../dbmodels/Product");

const router = express.Router();

/**
 * GET /buy
 * - Shows packages dynamically from MongoDB.
 * - Cart + checkout are on the same page (buy.ejs).
 */
router.get("/buy", async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 });
    res.render("buy", { products, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading buy page");
  }
});

/**
 * POST /buy
 * - Saves booking/order to MongoDB
 */
router.post("/buy", async (req, res) => {
  try {
    const {
      name, email, phone, address, city, postal, country, payment,
      packageId, packageName, packagePrice
    } = req.body;

    if (!name || !email || !packageName) {
      const products = await Product.find().sort({ price: 1 });
      return res.render("buy", { products, error: "Please fill required fields." });
    }

    await Booking.create({
      name,
      email,
      phone,
      address,
      city,
      postal,
      country,
      payment,
      packageId: packageId || null,
      packageName,
      packagePrice: Number(packagePrice || 0)
    });

    res.redirect("/success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Checkout failed");
  }
});
  // SUCCESS PAGE
router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
