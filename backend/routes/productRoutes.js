const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

// Add a product (login required)
router.post("/", protect, addProduct);

// Get all available products
router.get("/", getProducts);
// Get products added by the logged-in user
router.get("/my", protect, getMyProducts);
// Update a product (login required)
router.put("/:id", protect, updateProduct);
// Delete a product (login required)
router.delete("/:id", protect, deleteProduct);
module.exports = router;