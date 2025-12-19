const express = require("express");
const router = express.Router();
const Order = require("../dbmodels/order");

// FORM
router.get("/my-orders", (req, res) => {
  res.render("labfinal/orders/my-orders-form");
});

// LIST
router.post("/my-orders", async (req, res) => {
  const { email } = req.body;

  const orders = await Order.find({ email }).sort({
    createdAt: -1,
  });

  res.render("labfinal/orders/my-orders-list", { orders });
});

module.exports = router;
