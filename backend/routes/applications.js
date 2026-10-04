const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");

const router = express.Router();

// ==========================================
// HELPER: GET TODAY'S DATE IN INDIA
// ==========================================
const getTodayIndia = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

// ==========================================
// APPLY FOR JOB
// ==========================================
router.post("/applications", async (req, res) => {
  try {
    const {
      job,
      applicant,
      coverLetter,
    } = req.body;

    if (!job || !applicant) {
      return res.status(400).json({
        success: false,
        message: "Job and applicant are required",
      });
    }

    // Check if job exists
    const jobData = await Job.findById(job);

    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if job is already closed
    if (jobData.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer active",
      });
    }

    // Check job start and end dates
    const today = getTodayIndia();

    const startDate = jobData.startDate
      ? jobData.startDate.toISOString().slice(0, 10)
      : null;

    const endDate = jobData.endDate
      ? jobData.endDate.toISOString().slice(0, 10)
      : null;

    // Close expired jobs
    if (endDate && endDate < today) {
      jobData.status = "closed";
      await jobData.save();

      return res.status(400).json({
        success: false,
        message: "This job has expired. Applications are closed.",
      });
    }

    // Prevent applications before the start date
    if (startDate && startDate > today) {
      return res.status(400).json({
        success: false,
        message: "Applications are not open yet for this job",
      });
    }

    // Check if already applied
    const existingApplication =
      await Application.findOne({
        job: job,
        applicant: applicant,
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const newApplication =
      new Application({
        job,
        applicant,
        coverLetter: coverLetter || "",
      });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully!",
      application: newApplication,
    });
  } catch (error) {
    console.log(
      "Apply Job Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to apply for job",
    });
  }
});

// ==========================================
// GET APPLICATIONS OF A STUDENT / MENTOR
// ==========================================
router.get(
  "/applications/applicant/:applicantId",
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          applicant: req.params.applicantId,
        })
          .populate(
            "job",
            "companyName jobTitle location salary jobType"
          )
          .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        applications: applications,
      });
    } catch (error) {
      console.log(
        "Get Applicant Applications Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch applications",
      });
    }
  }
);

// ==========================================
// GET ALL APPLICANTS FOR A JOB
// ==========================================
router.get(
  "/applications/job/:jobId",
  async (req, res) => {
    try {
      const applications =
        await Application.find({
          job: req.params.jobId,
        })
          .populate(
            "applicant",
            "name email role"
          )
          .populate(
            "job",
            "companyName jobTitle"
          )
          .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        applications: applications,
      });
    } catch (error) {
      console.log(
        "Get Job Applications Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch job applications",
      });
    }
  }
);

// ==========================================
// UPDATE APPLICATION STATUS
// ==========================================
router.put(
  "/applications/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "applied",
        "shortlisted",
        "rejected",
        "hired",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid application status",
        });
      }

      const application =
        await Application.findByIdAndUpdate(
          req.params.id,
          {
            status: status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Application status updated successfully!",
        application: application,
      });
    } catch (error) {
      console.log(
        "Update Application Status Error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update application status",
      });
    }
  }
);

module.exports = router;