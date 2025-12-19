// labfinal/middleware/applyDiscount.js
module.exports = (req, res, next) => {
  // Safely read coupon from GET or POST
  const coupon =
    (req.body && req.body.coupon) ||
    (req.query && req.query.coupon) ||
    "";

  const subtotal = res.locals.subtotal || 0;

  let discount = 0;

  if (coupon === "SAVE10") {
    discount = subtotal * 0.1;
  }

  res.locals.coupon = coupon;
  res.locals.discount = discount;
  res.locals.total = subtotal - discount;

  next();
};
