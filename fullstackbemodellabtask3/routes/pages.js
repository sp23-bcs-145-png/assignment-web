// routes/pages.js
const express = require("express");
const router = express.Router();

// HOME
router.get("/", (req, res) => {
  res.render("home");
});

// OTHER PAGES
router.get("/ourmodels", (req, res) => {
  res.render("ourmodels");
});

router.get("/ourstudio", (req, res) => {
  res.render("ourstudio");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

// SUCCESS PAGE
router.get("/success", (req, res) => {
  res.render("success");
});

module.exports = router;
