const express = require("express");
const router = express.Router();
const Order = require("../dbmodels/order");
const applyDiscount = require("../middleware/applyDiscount");

/**
 * GET /order/preview
 * Show order preview
 */
router.get(
  "/order/preview",
  (req, res, next) => {
    const cart = req.session.cart;

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.redirect("/buy");
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    // ✅ SET subtotal BEFORE discount middleware
    res.locals.subtotal = subtotal;

    next();
  },
  applyDiscount,
  (req, res) => {
    res.render("labfinal/order/preview", {
      cart: req.session.cart.items,
      customer: req.session.cart.customer,
      subtotal: res.locals.subtotal,
      discount: res.locals.discount,
      total: res.locals.total
    });
  }
);

/**
 * POST /order/confirm
 * Save order and clear cart
 */
router.post(
  "/order/confirm",
  (req, res, next) => {
    const cart = req.session.cart;

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.redirect("/buy");
    }

    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    res.locals.subtotal = subtotal;
    next();
  },
  applyDiscount,
  async (req, res) => {
    try {
      const cart = req.session.cart;

      const order = new Order({
        email: cart.customer.email,
        items: cart.items,
        subtotal: res.locals.subtotal,
        discount: res.locals.discount,
        total: res.locals.total,
        status: "Placed"
      });

      await order.save();

      // Clear cart
      req.session.cart = null;

      res.render("success", { order });
    } catch (err) {
      console.error(err);
      res.status(500).send("Order confirmation failed");
    }
  }
);

module.exports = router;
