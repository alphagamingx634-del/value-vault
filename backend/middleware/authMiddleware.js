const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Check user authentication
const protect = async (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Please login first.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log("Authentication Error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = { protect };