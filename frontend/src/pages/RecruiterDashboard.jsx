import { useEffect, useState } from "react";
import axios from "axios";

function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    description: "",
    skills: "",
    location: "",
    salary: "",
    jobType: "Full Time",
    experience: "Fresher",
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // FETCH RECRUITER'S JOBS
  const fetchMyJobs = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/recruiter/${user.id}`
      );

      setJobs(response.data.jobs || []);
      setLoadingJobs(false);
    } catch (error) {
      console.log("Fetch My Jobs Error:", error);
      setLoadingJobs(false);
    }
  };

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // POST JOB
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATE JOB DATES
    if (formData.endDate < formData.startDate) {
      setMessage(
        "Job End Date cannot be before Job Start Date"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        {
          recruiter: user.id,
          ...formData,
        }
      );

      setMessage(response.data.message);

      setFormData({
        companyName: "",
        jobTitle: "",
        description: "",
        skills: "",
        location: "",
        salary: "",
        jobType: "Full Time",
        experience: "Fresher",
        startDate: "",
        endDate: "",
      });

      fetchMyJobs();
    } catch (error) {
      console.log("Post Job Error:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to post job"
      );
    }
  };

  // VIEW APPLICANTS
  const viewApplicants = async (job) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications/job/${job._id}`
      );

      setApplicants((previousApplicants) => ({
        ...previousApplicants,
        [job._id]: response.data.applications || [],
      }));

      setSelectedJob(job);
    } catch (error) {
      console.log("Fetch Applicants Error:", error);
      alert("Unable to fetch applicants");
    }
  };

  // UPDATE APPLICATION STATUS
  const updateApplicationStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          status: status,
        }
      );

      alert(response.data.message);

      if (selectedJob) {
        viewApplicants(selectedJob);
      }
    } catch (error) {
      console.log(
        "Update Application Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update application"
      );
    }
  };

  // VIEW CANDIDATE PROFILE
  const viewCandidateProfile = (application) => {
    const candidateId =
      application?.applicant?._id;

    const applicationId =
      application?._id;

    if (!candidateId) {
      alert("Candidate ID not found");
      return;
    }

    if (!applicationId) {
      alert("Application ID not found");
      return;
    }

    localStorage.setItem(
      "selectedCandidateId",
      candidateId
    );

    localStorage.setItem(
      "selectedApplicationId",
      applicationId
    );

    localStorage.setItem(
      "selectedApplicationStatus",
      application.status || "applied"
    );

    window.location.href =
      "/candidate-profile";
  };

  // FIND CANDIDATES
  const findCandidates = () => {
    window.location.href = "/candidates";
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    localStorage.removeItem("selectedMentor");
    localStorage.removeItem("selectedMentorId");
    localStorage.removeItem("selectedChatUser");
    localStorage.removeItem("selectedCandidateId");
    localStorage.removeItem("selectedApplicationId");
    localStorage.removeItem("selectedApplicationStatus");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>CareerConnect</h2>
          <p>Recruiter Panel</p>
        </div>

        <nav className="sidebar-nav">

          <a
            href="/recruiter-dashboard"
            className="active"
          >
            🏠 Dashboard
          </a>

          <a href="/jobs">
            💼 Jobs
          </a>

          <a href="/candidates">
            👥 Candidates
          </a>

          <a href="/profile">
            👤 My Profile
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

        </nav>

        <button
          onClick={logout}
          className="logout-btn"
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>
            <h1>
              💼 Recruiter Dashboard
            </h1>

            <p>
              Welcome, {user?.name || "Recruiter"}!
            </p>

            <p>
              Manage jobs, candidates and
              applications from here.
            </p>
          </div>

          <button
            onClick={findCandidates}
            className="primary-btn"
          >
            👥 Find Candidates
          </button>

        </div>

        {/* ================= POST JOB ================= */}

        <section className="card">

          <h2>
            ➕ Post a New Job
          </h2>

          <p>
            Create a new job opportunity for
            students and professionals.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Company Name
                </label>

                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Job Title
                </label>

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />

              </div>

              <div className="form-group full-width">

                <label>
                  Job Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter job description"
                  rows="4"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Skills
                </label>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Node.js"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pune"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Salary
                </label>

                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="₹4 - ₹6 LPA"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                >
                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>
                  Experience
                </label>

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Fresher / 1-2 Years"
                />

              </div>

              {/* ================= JOB START DATE ================= */}

              <div className="form-group">

                <label>
                  Job Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* ================= JOB END DATE ================= */}

              <div className="form-group">

                <label>
                  Job End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              🚀 Post Job
            </button>

          </form>

          {message && (
            <p className="success-message">
              ✅ {message}
            </p>
          )}

        </section>

        {/* ================= MY JOBS ================= */}

        <section className="card">

          <div className="section-header">

            <div>
              <h2>
                💼 My Jobs
              </h2>

              <p>
                Manage your posted job opportunities.
              </p>
            </div>

            <span>
              {jobs.length} Jobs
            </span>

          </div>

          {loadingJobs ? (

            <div className="empty-box">
              <h3>Loading jobs...</h3>
              <p>Please wait.</p>
            </div>

          ) : jobs.length === 0 ? (

            <div className="empty-box">

              <h3>
                No jobs posted yet
              </h3>

              <p>
                Post your first job opportunity
                using the form above.
              </p>

            </div>

          ) : (

            <div className="jobs-list">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job._id}
                >

                  <div className="job-info">

                    <h3>
                      {job.jobTitle}
                    </h3>

                    <p>
                      🏢 Company: {job.companyName}
                    </p>

                    <p>
                      📍 Location: {job.location}
                    </p>

                    <p>
                      💰 Salary: {job.salary}
                    </p>

                    <p>
                      💼 Job Type: {job.jobType}
                    </p>

                    <p>
                      🎓 Experience: {job.experience}
                    </p>

                    <p>
                      🛠️ Skills: {job.skills}
                    </p>

                    <p>
                      {job.description}
                    </p>

                    {/* JOB DATES */}

                    <p>
                      📅 Start Date:{" "}
                      {job.startDate
                        ? new Date(
                            job.startDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>

                    <p>
                      📅 End Date:{" "}
                      {job.endDate
                        ? new Date(
                            job.endDate
                          ).toLocaleDateString()
                        : "Not set"}
                    </p>

                    <span
                      className={
                        job.status === "active"
                          ? "status-success"
                          : "status-rejected"
                      }
                    >
                      {job.status}
                    </span>

                  </div>

                  <div className="job-actions">

                    <button
                      onClick={() =>
                        viewApplicants(job)
                      }
                      className="primary-btn"
                    >
                      👥 View Applicants
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= APPLICANTS ================= */}

        {selectedJob && (

          <section className="card">

            <div className="section-header">

              <div>

                <h2>
                  👥 Applicants for{" "}
                  {selectedJob.jobTitle}
                </h2>

                <p>
                  🏢 {selectedJob.companyName}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedJob(null)
                }
                className="secondary-btn"
              >
                ✕ Close
              </button>

            </div>

            {(
              applicants[selectedJob._id] || []
            ).length === 0 ? (

              <div className="empty-box">

                <h3>
                  No applicants yet
                </h3>

                <p>
                  Applicants for this job will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="applicants-list">

                {(
                  applicants[selectedJob._id] || []
                ).map((application) => (

                  <div
                    className="applicant-card"
                    key={application._id}
                  >

                    <div className="applicant-info">

                      <h3>
                        👤{" "}
                        {application.applicant?.name ||
                          "Unknown Candidate"}
                      </h3>

                      <p>
                        📧 Email:{" "}
                        {application.applicant?.email ||
                          "No email"}
                      </p>

                      <p>
                        🎓 Role:{" "}
                        {application.applicant?.role ||
                          "Candidate"}
                      </p>

                      <p>
                        📅 Applied:{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {application.status}
                        </strong>
                      </p>

                    </div>

                    <div className="applicant-actions">

                      <button
                        onClick={() =>
                          viewCandidateProfile(
                            application
                          )
                        }
                        className="primary-btn"
                      >
                        👤 View Profile
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            application._id,
                            "shortlisted"
                          )
                        }
                        className="secondary-btn"
                        disabled={
                          application.status ===
                          "shortlisted"
                        }
                      >
                        ⭐ Shortlist
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            application._id,
                            "rejected"
                          )
                        }
                        className="danger-btn"
                        disabled={
                          application.status ===
                          "rejected"
                        }
                      >
                        ❌ Reject
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            application._id,
                            "hired"
                          )
                        }
                        className="success-btn"
                        disabled={
                          application.status ===
                          "hired"
                        }
                      >
                        🎉 Hire
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default RecruiterDashboard;