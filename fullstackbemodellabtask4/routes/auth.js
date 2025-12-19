// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../dbmodels/Admin");

const router = express.Router();

/* ================= GET LOGIN ================= */
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

/* ================= POST LOGIN ================= */
router.post("/login", async (req, res) => {
  console.log("LOGIN BODY:", req.body);

  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;

  const admin = await Admin.findOne({ email });
  console.log("ADMIN FROM DB:", admin);

  if (!admin) {
    return res.render("login", { error: "Invalid email or password." });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  console.log("PASSWORD MATCH:", ok);

  if (!ok) {
    return res.render("login", { error: "Invalid email or password." });
  }

  req.session.admin = {
    id: admin._id.toString(),
    email: admin.email
  };

  res.redirect("/admin");
});


/* ================= LOGOUT ================= */
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
