// routes/admin.js
const express = require("express");
const requireLogin = require("../middleware/requireLogin");
const Product = require("../dbmodels/Product");
const Booking = require("../dbmodels/booking");

const router = express.Router();

/* =========================
   ADMIN DASHBOARD
========================= */
router.get("/", requireLogin, async (req, res) => {
  const productCount = await Product.countDocuments();
  const orderCount = await Booking.countDocuments();

  res.render("admin/dashboard", {
    admin: req.session.admin,
    productCount,
    orderCount
  });
});

/* =========================
   ADMIN: LIST PRODUCTS
========================= */
router.get("/products", requireLogin, async (req, res) => {
  const products = await Product.find().sort({ price: 1 });

  res.render("admin/products", {
    admin: req.session.admin,
    products
  });
});

/* =========================
   ADMIN: ADD PRODUCT PAGE
========================= */
router.get("/products/new", requireLogin, (req, res) => {
  res.render("admin/add-product", {
    admin: req.session.admin
  });
});

/* =========================
   ADMIN: CREATE PRODUCT
========================= */
router.post("/products", requireLogin, async (req, res) => {
  const { name, price, description, category, image } = req.body;

  await Product.create({
    name,
    price: Number(price),
    description,
    category: category || "General",
    image: image || ""
  });

  res.redirect("/admin/products");
});

/* =========================
   ADMIN: EDIT PRODUCT PAGE
========================= */
router.get("/products/:id/edit", requireLogin, async (req, res) => {
  const product = await Product.findById(req.params.id);

  res.render("admin/edit-product", {
    admin: req.session.admin,
    product
  });
});

/* =========================
   ADMIN: UPDATE PRODUCT
========================= */
router.post("/products/:id", requireLogin, async (req, res) => {
  const { name, price, description, category, image } = req.body;

  await Product.findByIdAndUpdate(req.params.id, {
    name,
    price: Number(price),
    description,
    category: category || "General",
    image: image || ""
  });

  res.redirect("/admin/products");
});

/* =========================
   ADMIN: DELETE PRODUCT
========================= */
router.post("/products/:id/delete", requireLogin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/products");
});

/* =========================
   ADMIN: ORDERS PAGE
========================= */
router.get("/orders", requireLogin, async (req, res) => {
  const orders = await Booking.find().sort({ createdAt: -1 });

  res.render("admin/orders", {
    admin: req.session.admin,
    orders
  });
});

module.exports = router;
