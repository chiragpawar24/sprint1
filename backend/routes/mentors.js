const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all mentors
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await User.find(
      { role: "mentor" },
      {
        password: 0
      }
    );

    res.status(200).json({
      success: true,
      mentors: mentors
    });

  } catch (error) {
    console.log("Mentor Fetch Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch mentors"
    });
  }
});

// Get single mentor by ID
router.get("/mentors/:id", async (req, res) => {
  try {
    const mentor = await User.findOne({
      _id: req.params.id,
      role: "mentor"
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found"
      });
    }

    res.status(200).json({
      success: true,
      mentor: mentor
    });

  } catch (error) {
    console.log("Single Mentor Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch mentor"
    });
  }
});

module.exports = router;