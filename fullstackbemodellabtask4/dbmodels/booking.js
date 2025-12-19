const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Customer info
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    postal: String,
    country: String,
    payment: String,

    // MULTI-PACKAGE CART (THIS IS THE KEY)
    items: [
      {
        name: String,
        price: Number
      }
    ],

    total: Number
  },
  { timestamps: true } // REQUIRED for admin orders page
);

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
