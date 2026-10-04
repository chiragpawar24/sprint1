const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Register request received:", {
      name,
      email,
      role,
    });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || "student",
    });

    await newUser.save();

    console.log("User registered successfully:", email);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
    });

  } catch (error) {
    console.log("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

module.exports = router;