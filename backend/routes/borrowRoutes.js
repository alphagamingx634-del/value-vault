const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createBorrowRequest,
  updateBorrowRequest,
  getMyBorrowRequests,
  returnBorrowedProduct,
} = require("../controllers/borrowController");

// Submit a borrowing request
router.post("/", protect, createBorrowRequest);
router.put("/:id", protect, updateBorrowRequest);
router.get("/my", protect, getMyBorrowRequests);
router.put("/:id/return", protect, returnBorrowedProduct);
module.exports = router;