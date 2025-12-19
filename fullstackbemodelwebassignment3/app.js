// app.js
const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

/* ================= MongoDB ================= */
mongoose
  .connect(config.get("db"))
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ================= View Engine ================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ================= Middleware ================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: config.get("sessionSecret"),
    resave: false,
    saveUninitialized: false
  })
);

// expose admin to all EJS templates
app.use((req, res, next) => {
  res.locals.admin = req.session.admin || null;
  next();
});

/* ================= Routes ================= */
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/pages"));
app.use("/", require("./routes/products"));
app.use("/", require("./routes/bookings"));

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

/* ================= Server ================= */
const PORT = config.get("port") || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running: http://localhost:${PORT}`)
);
