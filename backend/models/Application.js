const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "rejected",
        "hired",
      ],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);