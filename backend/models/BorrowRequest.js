const mongoose = require("mongoose");

const borrowRequestSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
    rentalDays: {
  type: Number,
  required: true,
},

totalPrice: {
  type: Number,
  required: true,
  min: 0,
},

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },

    actualReturnDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BorrowRequest",
  borrowRequestSchema
);