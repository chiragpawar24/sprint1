const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Login email:", email);
    console.log("User found:", user ? "YES" : "NO");

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );
    console.log("Password correct:", isPasswordCorrect);


    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        // Profile information
        headline: user.headline || "",
        skills: user.skills || [],
        education: user.education || "",
        experience: user.experience || "",
        bio: user.bio || "",

        // Rating information
        averageRating: user.averageRating || 0,
        totalReviews: user.totalReviews || 0,
      },
    });

  } catch (error) {
    console.log("Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

module.exports = router;