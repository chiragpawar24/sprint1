const express = require("express");
const MentorshipRequest = require("../models/MentorshipRequest");
const User = require("../models/User");
const Notification = require("../models/Notification");

const router = express.Router();


// SEND MENTORSHIP REQUEST
router.post("/mentorship-request", async (req, res) => {
  try {
    const { studentId, mentorId, message } = req.body;

    if (!studentId || !mentorId) {
      return res.status(400).json({
        success: false,
        message: "Student and mentor are required",
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

    const existingRequest =
      await MentorshipRequest.findOne({
        student: studentId,
        mentor: mentorId,
        status: "pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already sent a request to this mentor",
      });
    }

    const newRequest = new MentorshipRequest({
      student: studentId,
      mentor: mentorId,
      message:
        message ||
        "Hello, I would like to get mentorship and career guidance from you.",
      status: "pending",
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: "Mentorship request sent successfully!",
      request: newRequest,
    });

  } catch (error) {
    console.log(
      "Mentorship Request Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send mentorship request",
    });
  }
});


// ACCEPT OR REJECT MENTORSHIP REQUEST
router.put(
  "/mentorship-request/:requestId",
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request status",
        });
      }

      const updatedRequest =
        await MentorshipRequest.findByIdAndUpdate(
          req.params.requestId,
          { status: status },
          { new: true }
        );

      if (!updatedRequest) {
        return res.status(404).json({
          success: false,
          message: "Mentorship request not found",
        });
      }

      const mentor = await User.findById(
        updatedRequest.mentor
      );

      if (status === "accepted") {
        await Notification.create({
          user: updatedRequest.student,
          title: "Mentorship Request Accepted",
          message:
            (mentor?.name || "Your mentor") +
            " has accepted your mentorship request.",
          type: "mentorship",
          read: false,
        });
      }

      if (status === "rejected") {
        await Notification.create({
          user: updatedRequest.student,
          title: "Mentorship Request Rejected",
          message:
            (mentor?.name || "The mentor") +
            " has rejected your mentorship request.",
          type: "mentorship",
          read: false,
        });
      }

      return res.status(200).json({
        success: true,
        message:
          status === "accepted"
            ? "Mentorship request accepted successfully!"
            : "Mentorship request rejected successfully!",
        request: updatedRequest,
      });

    } catch (error) {
      console.log(
        "Update Mentorship Request Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update mentorship request",
      });
    }
  }
);


// GET MENTORSHIP REQUESTS FOR MENTOR
router.get(
  "/mentorship-requests/mentor/:mentorId",
  async (req, res) => {
    try {
      const requests =
        await MentorshipRequest.find({
          mentor: req.params.mentorId,
        })
          .populate("student", "name email")
          .populate("mentor", "name email");

      return res.status(200).json({
        success: true,
        requests: requests,
      });

    } catch (error) {
      console.log(
        "Fetch Mentor Requests Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch mentorship requests",
      });
    }
  }
);


// GET MENTORSHIP REQUESTS FOR STUDENT
router.get(
  "/mentorship-requests/student/:studentId",
  async (req, res) => {
    try {
      const requests =
        await MentorshipRequest.find({
          student: req.params.studentId,
        })
          .populate(
            "mentor",
            "name email headline skills education experience averageRating totalReviews"
          )
          .populate(
            "student",
            "name email"
          );

      return res.status(200).json({
        success: true,
        requests: requests,
      });

    } catch (error) {
      console.log(
        "Fetch Student Requests Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch student requests",
      });
    }
  }
);


module.exports = router;