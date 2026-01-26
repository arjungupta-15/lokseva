const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "lokseva_secret_key"; // In production, use process.env.JWT_SECRET

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, password } = req.body;
    let { email } = req.body;

    email = email ? email.trim().toLowerCase() : ""; // Normalize
    const cleanPassword = password ? password.trim() : "";

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    let { email } = req.body;

    // 🛡️ Robustness: Trim whitespace and lowercase email
    email = email ? email.trim().toLowerCase() : "";
    const cleanPassword = password ? password.trim() : "";

    console.log(`\n--- LOGIN ATTEMPT ---`);
    console.log(`Email check: '${email}'`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(400).json({ message: "User not found" });
    }

    console.log("✅ User found:", user.email);

    // Debug: Check if password was somehow stored as plain text or malformed
    // console.log("Stored Hash:", user.password); // Be careful with this in prod!

    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res.status(400).json({ message: "Invalid credentials (password)" });
    }

    console.log("✅ Password matched");

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
