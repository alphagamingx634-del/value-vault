const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const borrowRoutes = require("./routes/borrowRoutes");
const { protect } = require("./middleware/authMiddleware");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/borrow", borrowRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Value Vault Backend!");
});
// Protected test route
app.get("/api/auth/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You are authorized!",
    user: req.user,
  });
});
// Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Value Vault Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });