const jwt = require("jsonwebtoken");
const JWT_SECRET = "lokseva_secret_key";

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Token missing → stop
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4️⃣ Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
