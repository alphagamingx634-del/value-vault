const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
// Register a new user and send OTP
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before saving it
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Create new user
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      otpHash,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      otpAttempts: 0,
    });

    try {
      await sendEmail(
        normalizedEmail,
        "Value Vault Email Verification",
        `Your Value Vault verification OTP is ${otp}. It expires in 10 minutes.`
      );
    } catch (emailError) {
      await User.findByIdAndDelete(newUser._id);

      return res.status(500).json({
        message: "Unable to send OTP email. Please try again.",
      });
    }

    res.status(201).json({
      message: "Registration successful. Please verify your email using the OTP sent to your inbox.",
    });

  } catch (error) {
    console.error("Registration Error:", error.message);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    if (!user.isVerified) {
  return res.status(403).json({
    message: "Please verify your email before logging in",
  });
}

    // Create JWT token
    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    if (!user.otpHash || !user.otpExpires ||
        user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please register again.",
      });
    }

    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        message: "Too many incorrect attempts",
      });
    }

    const submittedOtpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (submittedOtpHash !== user.otpHash) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Incorrect OTP",
      });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully!",
    });

  } catch (error) {
    console.error("OTP Verification Error:", error.message);

    res.status(500).json({
      message: "Server error during email verification",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
};
