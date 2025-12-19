// routes/products.js
const express = require("express");
const Product = require("../dbmodels/Product");

const router = express.Router();

/* =====================================================
   SERVER-RENDERED PRODUCT LIST (Assignment 3)
   GET /products?page=1&limit=6&category=Studio&minPrice=0&maxPrice=500
===================================================== */
router.get("/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "6", 10), 1), 50);

    const category = (req.query.category || "").trim();
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const products = await Product.find(filter)
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await Product.distinct("category");

    res.render("Products", {
      products,
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      filters: {
        category,
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || ""
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
});

/* =====================================================
   JSON API (Assignment proof)
   GET /api/products?page=1&limit=6&category=Studio&minPrice=100&maxPrice=500
===================================================== */
router.get("/api/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "6", 10), 1), 100);

    const category = (req.query.category || "").trim();
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

module.exports = router;
