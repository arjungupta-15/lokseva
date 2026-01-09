const User = require("../models/Users");
const bcrypt = require("bcryptjs");

// SIGNUP
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({ message: "Signup successful" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  res.json({
    message: "Login successful",
    user: { id: user._id, email: user.email },
  });
};

//Edit profile

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true }
    );

    return res.json({ success: true, user: updated });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    return res.json({ success: false, message: "Backend error" });
  }
};
