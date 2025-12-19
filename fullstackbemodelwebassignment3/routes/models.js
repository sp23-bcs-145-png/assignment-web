// routes/models.js
const express = require("express");
const router = express.Router();

router.get("/bella", (req, res) => res.render("models/bella"));
router.get("/gigi", (req, res) => res.render("models/gigi"));
router.get("/barbara", (req, res) => res.render("models/barbara"));
router.get("/candice", (req, res) => res.render("models/candice"));

module.exports = router;
