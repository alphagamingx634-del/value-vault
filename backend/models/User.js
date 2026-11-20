const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    otpHash: {
  type: String,
  default: null,
   },

otpExpires: {
  type: Date,
  default: null,
   },

otpAttempts: {
  type: Number,
  default: 0,
   },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);