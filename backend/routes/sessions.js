const express = require("express");
const Session = require("../models/Session");
const User = require("../models/User");

const router = express.Router();

// STUDENT BOOKS A GUIDANCE SESSION
router.post("/session", async (req, res) => {
  try {
    const {
      studentId,
      mentorId,
      date,
      time,
      topic,
      message,
    } = req.body;

    if (
      !studentId ||
      !mentorId ||
      !date ||
      !time ||
      !topic
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student, mentor, date, time and topic are required",
      });
    }

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const mentor = await User.findOne({
      _id: mentorId,
      role: "mentor",
    });

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const session = new Session({
      student: studentId,
      mentor: mentorId,
      date,
      time,
      topic,
      message: message || "",
      status: "pending",
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: "Guidance session request sent successfully!",
      session,
    });
  } catch (error) {
    console.log(
      "Create Session Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to book guidance session",
    });
  }
});

// GET SESSIONS FOR MENTOR
router.get(
  "/sessions/mentor/:mentorId",
  async (req, res) => {
    try {
      const sessions = await Session.find({
        mentor: req.params.mentorId,
      })
        .populate("student", "name email")
        .populate("mentor", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        sessions,
      });
    } catch (error) {
      console.log(
        "Fetch Mentor Sessions Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to fetch mentor sessions",
      });
    }
  }
);

// GET SESSIONS FOR STUDENT
router.get(
  "/sessions/student/:studentId",
  async (req, res) => {
    try {
      const sessions = await Session.find({
        student: req.params.studentId,
      })
        .populate("student", "name email")
        .populate(
          "mentor",
          "name email headline averageRating totalReviews"
        )
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        sessions,
      });
    } catch (error) {
      console.log(
        "Fetch Student Sessions Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to fetch student sessions",
      });
    }
  }
);

// ADD / UPDATE GOOGLE MEET OR ZOOM LINK
router.put(
  "/session/:sessionId/meeting",
  async (req, res) => {
    try {
      const {
        meetingType,
        meetingLink,
      } = req.body;

      if (!meetingType || !meetingLink) {
        return res.status(400).json({
          success: false,
          message:
            "Meeting type and meeting link are required",
        });
      }

      if (
        !["google-meet", "zoom"].includes(
          meetingType
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid meeting type",
        });
      }

      const session = await Session.findById(
        req.params.sessionId
      );

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      session.meetingType = meetingType;
      session.meetingLink = meetingLink.trim();

      await session.save();

      res.status(200).json({
        success: true,
        message:
          "Meeting link added successfully!",
        session,
      });
    } catch (error) {
      console.log(
        "Meeting Link Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to add meeting link",
      });
    }
  }
);

// ACCEPT / REJECT / COMPLETE SESSION
router.put(
  "/session/:sessionId",
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        ![
          "pending",
          "accepted",
          "rejected",
          "completed",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid session status",
        });
      }

      const session =
        await Session.findByIdAndUpdate(
          req.params.sessionId,
          { status },
          { new: true }
        )
          .populate("student", "name email")
          .populate("mentor", "name email");

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Session status updated successfully!",
        session,
      });
    } catch (error) {
      console.log(
        "Update Session Error:",
        error.message
      );

      res.status(500).json({
        success: false,
        message: "Unable to update session",
      });
    }
  }
);

module.exports = router;