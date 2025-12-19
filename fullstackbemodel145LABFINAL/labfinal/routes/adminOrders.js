const express = require("express");
const router = express.Router();

const Order = require("../dbmodels/order");
const requireLogin = require("../../middleware/requireLogin");

// Order lifecycle map (prevents skipping)
const nextStatus = {
  Placed: "Processing",
  Processing: "Delivered",
  Delivered: null
};

/**
 * GET /admin/orders
 * Show orders in EXISTING admin dashboard
 */
router.get("/orders", requireLogin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // IMPORTANT:
    // Render the ORIGINAL admin orders page
    // and pass nextStatus so EJS can use it
    res.render("admin/orders", {
      orders,
      nextStatus
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load orders");
  }
});

/**
 * POST /admin/orders/:id/advance
 * Advance order status step-by-step
 */
router.post("/orders/:id/advance", requireLogin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.redirect("/admin/orders");

    const next = nextStatus[order.status];
    if (!next) return res.redirect("/admin/orders"); // already Delivered

    order.status = next;
    await order.save();

    res.redirect("/admin/orders");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to update order status");
  }
});

module.exports = router;
