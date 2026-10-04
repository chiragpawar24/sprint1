
const express = require("express");
const User = require("../models/User");
const Application = require("../models/Application");
const calculateProfileScore = require("../utils/profileScore");

const router = express.Router();

// GET ONLY USERS WHO HAVE APPLIED FOR JOBS
router.get("/candidates", async (req, res) => {
  try {
    const {
      name,
      skills,
      experience,
      education,
      location,
      certification,
    } = req.query;

    // 1. Get unique applicant IDs from applications
    const applicantIds = await Application.distinct(
      "applicant"
    );
    console.log("APPLICANT IDS:", applicantIds);
    console.log("TOTAL APPLICANTS:", applicantIds.length);
    console.log("Applied Applicant IDs:", applicantIds);
    // 2. Fetch only applicants who are students or mentors
    const filter = {
      _id: { $in: applicantIds },
      role: { $in: ["student", "mentor"] },
    };

    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      };
    }

    if (experience) {
      filter.experience = {
        $regex: experience,
        $options: "i",
      };
    }

    if (education) {
      filter.education = {
        $regex: education,
        $options: "i",
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (skills) {
      filter.skills = {
        $regex: skills,
        $options: "i",
      };
    }

    if (certification) {
      filter.certifications = {
        $regex: certification,
        $options: "i",
      };
    }

    // 3. Fetch matching candidates
    const users = await User.find(
      filter,
      { password: 0 }
    ).sort({ createdAt: -1 });

    // 4. Calculate profile score and format candidates
    const candidates = users.map((user) => {
      const candidate = user.toObject();

      candidate.profileScore =
        calculateProfileScore(candidate);

      return candidate;
    });

    return res.status(200).json({
      success: true,
      candidates: candidates,
    });

  } catch (error) {
    console.log(
      "Find Candidates Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
    });
  }
});

module.exports = router;