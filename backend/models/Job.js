
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Remote",
      ],
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "Fresher",
    },

    // Job Start Date
    startDate: {
      type: Date,
      required: true,
    },

    // Job End Date
    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "closed",
      ],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Job ||
  mongoose.model("Job", jobSchema);