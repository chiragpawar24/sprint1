const express = require("express");
const User = require("../models/User");
const calculateProfileScore = require("../utils/profileScore");

const router = express.Router();

// ==========================================
// GET CANDIDATE / USER PROFILE
// ==========================================

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileScore =
      calculateProfileScore(user);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        headline: user.headline,
        skills: user.skills,
        education: user.education,
        experience: user.experience,
        bio: user.bio,

        location: user.location,
        projects: user.projects,
        certifications: user.certifications,

        averageRating: user.averageRating,
        totalReviews: user.totalReviews,

        profileScore: profileScore,
      },
    });
  } catch (error) {
    console.log(
      "Get Candidate Profile Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate profile",
    });
  }
});

// ==========================================
// UPDATE USER PROFILE
// ==========================================

router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      headline,
      skills,
      education,
      experience,
      bio,
      location,
      projects,
      certifications,
    } = req.body;

    const updatedUser =
      await User.findByIdAndUpdate(
        id,
        {
          name,
          headline,
          skills,
          education,
          experience,
          bio,
          location,
          projects,
          certifications,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileScore =
      calculateProfileScore(updatedUser);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",

      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,

        headline: updatedUser.headline,
        skills: updatedUser.skills,
        education: updatedUser.education,
        experience: updatedUser.experience,
        bio: updatedUser.bio,

        location: updatedUser.location,
        projects: updatedUser.projects,
        certifications:
          updatedUser.certifications,

        averageRating:
          updatedUser.averageRating,
        totalReviews:
          updatedUser.totalReviews,

        profileScore: profileScore,
      },
    });
  } catch (error) {
    console.log(
      "Profile Update Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
});



// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;