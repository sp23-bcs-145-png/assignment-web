const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

// 👇 DO NOT REMOVE "admins"
module.exports = mongoose.model("Admin", adminSchema, "admins");
