const express = require("express");
const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// SCHEDULE ONLINE INTERVIEW
// ==========================================
router.post("/interviews", async (req, res) => {
  try {
    const {
      recruiterId,
      applicationId,
      interviewDate,
      meetingLink,
      message,
    } = req.body;

    // Validate required fields
    if (
      !recruiterId ||
      !applicationId ||
      !interviewDate ||
      !meetingLink
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required interview details",
      });
    }

    // Validate MongoDB IDs
    if (
      !mongoose.isValidObjectId(recruiterId) ||
      !mongoose.isValidObjectId(applicationId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter or application ID",
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Find job
    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check recruiter ownership
    if (job.recruiter.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to schedule this interview",
      });
    }

    // Find candidate
    const candidate = await User.findById(application.applicant);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (!candidate.email) {
      return res.status(400).json({
        success: false,
        message: "Candidate email is not available",
      });
    }

    // Validate interview date
    const date = new Date(interviewDate);

    if (isNaN(date.getTime()) || date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid future interview date and time",
      });
    }

    // ==========================================
    // VALIDATE AND FIX MEETING LINK
    // ==========================================

    let cleanMeetingLink = meetingLink.trim();

    // Fix accidentally missing "/" after .com
    cleanMeetingLink = cleanMeetingLink.replace(
      "https://meet.google.com",
      "https://meet.google.com/"
    );

    cleanMeetingLink = cleanMeetingLink.replace(
      "http://meet.google.com",
      "http://meet.google.com/"
    );

    // Remove duplicate slash
    cleanMeetingLink = cleanMeetingLink.replace(
      "https://meet.google.com//",
      "https://meet.google.com/"
    );

    cleanMeetingLink = cleanMeetingLink.replace(
      "http://meet.google.com//",
      "http://meet.google.com/"
    );

    // Parse URL
    let parsedLink;

    try {
      parsedLink = new URL(cleanMeetingLink);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid meeting link",
      });
    }

    // Only HTTP/HTTPS
    if (!["https:", "http:"].includes(parsedLink.protocol)) {
      return res.status(400).json({
        success: false,
        message: "Meeting link must be an HTTP or HTTPS URL",
      });
    }

    // Google Meet validation
    if (parsedLink.hostname === "meet.google.com") {
      if (!parsedLink.pathname || parsedLink.pathname === "/") {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid Google Meet room link",
        });
      }
    }

    // ==========================================
    // CREATE INTERVIEW
    // ==========================================

    const interview = new Interview({
      recruiter: recruiterId,
      candidate: candidate._id,
      job: job._id,
      jobTitle: job.jobTitle,
      candidateEmail: candidate.email,
      interviewDate: date,
      meetingLink: parsedLink.toString(),
      message: message || "",
    });

    // Save interview
    await interview.save();

    return res.status(201).json({
      success: true,
      message: "Online interview scheduled successfully!",
      interview,
    });
  } catch (error) {
    console.log("Schedule Interview Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
    });
  }
});

// ==========================================
// GET SCHEDULED INTERVIEWS FOR CANDIDATE
// ==========================================
router.get("/interviews/candidate/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Validate candidate ID
    if (!mongoose.isValidObjectId(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID",
      });
    }

    // Find scheduled interviews
    const interviews = await Interview.find({
      candidate: candidateId,
      status: "scheduled",
    })
      .populate("recruiter", "name email")
      .populate("job", "jobTitle company")
      .sort({ interviewDate: 1 });

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.log("Fetch Candidate Interviews Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
});

module.exports = router;