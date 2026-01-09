const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ success: false, error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.json({ success: false, error: "Access denied" });

    req.admin = decoded;
    next();
  } catch (err) {
    res.json({ success: false, error: "Invalid token" });
  }
};
