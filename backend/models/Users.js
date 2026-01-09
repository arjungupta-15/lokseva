const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🔥 New Profile Fields
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  profilePic: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Users", userSchema);