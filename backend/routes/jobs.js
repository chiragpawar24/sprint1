
const express = require("express");
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
// HELPER: AUTOMATICALLY CLOSE EXPIRED JOBS
// ==========================================
const expireJobs = async () => {
  const today = getTodayIndia();

  await Job.updateMany(
    {
      status: "active",
      endDate: { $lt: new Date(today + "T00:00:00.000Z") },
    },
    {
      $set: { status: "closed" },
    }
  );
};

// ==========================================
// CREATE JOB
// ==========================================
router.post("/jobs", async (req, res) => {
  try {
    const {
      recruiter,
      companyName,
      jobTitle,
      description,
      skills,
      location,
      salary,
      jobType,
      experience,
      startDate,
      endDate,
    } = req.body;

    if (
      !recruiter ||
      !companyName ||
      !jobTitle ||
      !description ||
      !skills ||
      !location ||
      !salary ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields including dates",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End Date must be after or equal to Start Date",
      });
    }

    const newJob = new Job({
      recruiter,
      companyName,
      jobTitle,
      description,
      skills,
      location,
      salary,
      jobType,
      experience,
      startDate,
      endDate,
    });

    await newJob.save();

    return res.status(201).json({
      success: true,
      message: "Job posted successfully!",
      job: newJob,
    });
  } catch (error) {
    console.log("Create Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  }
});

// ==========================================
// GET ALL ACTIVE JOBS
// ==========================================
router.get("/jobs", async (req, res) => {
  try {
    await expireJobs();

    const today = getTodayIndia();

    const jobs = await Job.find({
      status: "active",
      startDate: { $lte: new Date(today + "T23:59:59.999Z") },
      endDate: { $gte: new Date(today + "T00:00:00.000Z") },
    })
      .populate("recruiter", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    console.log("Get Jobs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// ==========================================
// GET JOBS OF A RECRUITER
// ==========================================
router.get("/jobs/recruiter/:recruiterId", async (req, res) => {
  try {
    await expireJobs();

    const jobs = await Job.find({
      recruiter: req.params.recruiterId,
    })
      .populate("recruiter", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      jobs: jobs,
    });
  } catch (error) {
    console.log("Get Recruiter Jobs Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs",
    });
  }
});

// ==========================================
// GET SINGLE JOB
// ==========================================
router.get("/jobs/:id", async (req, res) => {
  try {
    await expireJobs();

    const job = await Job.findById(req.params.id)
      .populate("recruiter", "name email role");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job: job,
    });
  } catch (error) {
    console.log("Get Single Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job",
    });
  }
});

// ==========================================
// UPDATE JOB
// ==========================================
router.put("/jobs/:id", async (req, res) => {
  try {
    await expireJobs();

    if (
      req.body.startDate &&
      req.body.endDate &&
      new Date(req.body.startDate) > new Date(req.body.endDate)
    ) {
      return res.status(400).json({
        success: false,
        message: "End Date must be after or equal to Start Date",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job updated successfully!",
      job: updatedJob,
    });
  } catch (error) {
    console.log("Update Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
});

// ==========================================
// CLOSE JOB
// ==========================================
router.put("/jobs/:id/close", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job closed successfully!",
      job: job,
    });
  } catch (error) {
    console.log("Close Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to close job",
    });
  }
});

// ==========================================
// DELETE JOB
// ==========================================
router.delete("/jobs/:id", async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(
      req.params.id
    );

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully!",
    });
  } catch (error) {
    console.log("Delete Job Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
});

module.exports = router;