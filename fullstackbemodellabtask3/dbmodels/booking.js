// dbmodels/booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // order info
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    postal: String,
    country: String,
    payment: String,

    // package info
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    packageName: { type: String, required: true },
    packagePrice: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
