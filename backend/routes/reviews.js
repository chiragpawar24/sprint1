const express = require("express");
const Review = require("../models/Review");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// SUBMIT MENTOR REVIEW
// =====================================================

router.post("/review", async (req, res) => {
  try {
    const {
      studentId,
      mentorId,
      rating,
      feedback,
    } = req.body;

    // VALIDATION
    if (
      !studentId ||
      !mentorId ||
      !rating ||
      !feedback
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student, mentor, rating and feedback are required",
      });
    }

    // CHECK RATING
    if (rating < 1 || rating > 7) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 7",
      });
    }

    // CHECK STUDENT
    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // CHECK MENTOR
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

    // CHECK DUPLICATE REVIEW
    const existingReview = await Review.findOne({
      student: studentId,
      mentor: mentorId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "You have already reviewed this mentor",
      });
    }

    // CREATE REVIEW
    const review = new Review({
      student: studentId,
      mentor: mentorId,
      rating: Number(rating),
      feedback: feedback,
    });

    await review.save();

    // GET ALL REVIEWS OF MENTOR
    const mentorReviews = await Review.find({
      mentor: mentorId,
    });

    // CALCULATE AVERAGE
    const totalReviews = mentorReviews.length;

    const totalRating = mentorReviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? Number(
            (totalRating / totalReviews).toFixed(1)
          )
        : 0;

    // UPDATE MENTOR RATING
    mentor.averageRating = averageRating;
    mentor.totalReviews = totalReviews;

    await mentor.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      review: review,
      averageRating: averageRating,
      totalReviews: totalReviews,
    });

  } catch (error) {
    console.log(
      "Submit Review Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
});


// =====================================================
// GET MENTOR REVIEWS
// =====================================================

router.get(
  "/reviews/mentor/:mentorId",
  async (req, res) => {
    try {
      const reviews = await Review.find({
        mentor: req.params.mentorId,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "mentor",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        reviews: reviews,
      });

    } catch (error) {
      console.log(
        "Fetch Reviews Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch reviews",
      });
    }
  }
);

// =====================================================
// GET REVIEWS SUBMITTED BY A STUDENT
// =====================================================

router.get(
  "/reviews/student/:studentId",
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const reviews = await Review.find({
        student: studentId,
      })
        .populate(
          "student",
          "name email"
        )
        .populate(
          "mentor",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        reviews: reviews,
      });

    } catch (error) {
      console.log(
        "Fetch Student Reviews Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Unable to fetch student reviews",
      });
    }
  }
);


module.exports = router;