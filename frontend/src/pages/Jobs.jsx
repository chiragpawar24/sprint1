import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs"
      );

      setJobs(response.data.jobs || []);
      setLoading(false);
    } catch (error) {
      console.log("Fetch Jobs Error:", error);
      setLoading(false);
    }
  };

  const goDashboard = () => {
    if (user.role === "mentor") {
      window.location.href = "/mentor-dashboard";
    } else {
      window.location.href = "/student-dashboard";
    }
  };

  const applyForJob = async (job) => {
    try {
      setApplyingJob(job._id);

      const response = await axios.post(
        "http://localhost:5000/api/applications",
        {
          job: job._id,
          applicant: user.id,
          coverLetter: "",
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.log("Apply Job Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to apply for this job"
      );
    } finally {
      setApplyingJob(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMentor");
    localStorage.removeItem("selectedMentorId");
    localStorage.removeItem("selectedChatUser");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="dashboard">
        <aside className="sidebar">
          <h2>CareerConnect</h2>

          <p>
            {user?.role === "mentor"
              ? "Mentor Panel"
              : "Student Panel"}
          </p>
        </aside>

        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Loading jobs...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2>CareerConnect</h2>

        <p>
          {user.role === "mentor"
            ? "Mentor Panel"
            : "Student Panel"}
        </p>

        <nav>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              goDashboard();
            }}
          >
            🏠 Dashboard
          </a>

          {user.role === "student" && (
            <>
              <a href="/profile">
                👤 My Profile
              </a>

              <a href="/find-mentors">
                🔎 Find Mentors
              </a>

              <a href="/mentorship">
                🎓 Mentorship
              </a>
            </>
          )}

          {user.role === "mentor" && (
            <a href="/mentor-dashboard">
              👨‍🏫 Mentor Dashboard
            </a>
          )}

          <a
            href="/jobs"
            className="active"
          >
            💼 Jobs
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <div className="dashboard-header">

          <div>

            <h1>
              💼 Available Jobs
            </h1>

            <p>
              Find the right career opportunity
              for your skills and experience.
            </p>

          </div>

          <button
            onClick={goDashboard}
            className="back-dashboard-btn"
          >
            ← Back
          </button>

        </div>


        {/* JOB SECTION */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                Latest Job Opportunities
              </h2>

              <p>
                {jobs.length} active job
                {jobs.length !== 1 ? "s" : ""}
                {" "}available
              </p>

            </div>

          </div>


          {jobs.length === 0 ? (

            <div className="empty-box">

              <div
                style={{
                  fontSize: "50px",
                }}
              >
                💼
              </div>

              <h3>
                No jobs available
              </h3>

              <p>
                Recruiters have not posted any
                active jobs yet.
              </p>

            </div>

          ) : (

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >

              {jobs.map((job) => (

                <div
                  key={job._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "22px",
                    background: "#ffffff",
                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                >

                  <h2
                    style={{
                      marginBottom: "8px",
                    }}
                  >
                    {job.jobTitle}
                  </h2>


                  <h3
                    style={{
                      marginBottom: "12px",
                      color: "#2563eb",
                    }}
                  >
                    🏢 {job.companyName}
                  </h3>


                  <p>
                    📍 <strong>Location:</strong>{" "}
                    {job.location}
                  </p>


                  <p>
                    💰 <strong>Salary:</strong>{" "}
                    {job.salary}
                  </p>


                  <p>
                    💼 <strong>Job Type:</strong>{" "}
                    {job.jobType}
                  </p>


                  <p>
                    🎓 <strong>Experience:</strong>{" "}
                    {job.experience}
                  </p>


                  <p>
                    🛠️ <strong>Skills:</strong>{" "}
                    {job.skills}
                  </p>


                  <p
                    style={{
                      marginTop: "12px",
                      lineHeight: "1.6",
                    }}
                  >
                    {job.description}
                  </p>


                  <small>
                    Posted on{" "}
                    {new Date(
                      job.createdAt
                    ).toLocaleDateString()}
                  </small>


                  {/* APPLY BUTTON */}

                  <button
                    className="start-mentorship-btn"
                    style={{
                      width: "100%",
                      marginTop: "18px",
                    }}
                    onClick={() =>
                      applyForJob(job)
                    }
                    disabled={
                      applyingJob === job._id
                    }
                  >
                    {applyingJob === job._id
                      ? "Applying..."
                      : "📄 Apply Now"}
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Jobs;