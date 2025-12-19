// routes/bookings.js
const express = require("express");
const Product = require("../dbmodels/Product");

const router = express.Router();

/**
 * GET /buy
 * Show packages
 */
router.get("/buy", async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1"), 1);
  const limit = Math.max(parseInt(req.query.limit || "6"), 1);

  const category = req.query.category || "";
  const minPrice = req.query.minPrice || "";
  const maxPrice = req.query.maxPrice || "";

  const filter = {};
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort({ price: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.render("buy", {
    products,
    error: null,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    category,
    minPrice,
    maxPrice
  });
});

/**
 * POST /buy
 * Store cart in session and redirect to preview
 */
router.post("/buy", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      postal,
      country,
      payment,
      cart
    } = req.body;

    const items = cart ? JSON.parse(cart) : [];

    if (!name || !email || items.length === 0) {
      const products = await Product.find();
      return res.render("buy", {
        products,
        error: "Please fill all required fields and add at least one package."
      });
    }

    // ✅ SESSION-BASED CART (LAB FINAL)
    req.session.cart = {
      customer: {
        name,
        email,
        phone,
        address,
        city,
        postal,
        country,
        payment
      },
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      }))
    };

    // 👉 Go to order preview
    res.redirect("/order/preview");

  } catch (err) {
    console.error(err);
    res.status(500).send("Order failed");
  }
});

module.exports = router;
