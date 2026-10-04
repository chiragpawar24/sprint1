import { useEffect, useState } from "react";
import axios from "axios";

function CandidateProfile() {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Online Interview
const [showInterviewForm, setShowInterviewForm] = useState(false);
const [interviewLoading, setInterviewLoading] = useState(false);

const [interviewDate, setInterviewDate] = useState("");
const [meetingLink, setMeetingLink] = useState("");
const [interviewMessage, setInterviewMessage] = useState("");

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetchCandidateProfile();
    fetchCandidateReviews();
  }, []);

  // ==========================================
  // FETCH CANDIDATE PROFILE
  // ==========================================

  const fetchCandidateProfile = async () => {
    try {
      const candidateId =
        localStorage.getItem("selectedCandidateId");

      if (!candidateId) {
        alert("Candidate not selected");
        window.location.href = "/recruiter-dashboard";
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/profile/${candidateId}`
      );

      setCandidate(response.data.user);
    } catch (error) {
      console.log("Fetch Candidate Profile Error:", error);
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH REVIEWS GIVEN BY CANDIDATE
  // ==========================================

  const fetchCandidateReviews = async () => {
    try {
      const candidateId =
        localStorage.getItem("selectedCandidateId");

      if (!candidateId) {
        setReviews([]);
        return;
      }

      const response = await axios.get(
     `http://localhost:5000/api/reviews/mentor/${candidateId}`
     );
      if (response.data.success) {
        setReviews(response.data.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.log("Fetch Candidate Reviews Error:", error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // ==========================================
  // GO BACK
  // ==========================================

  const goBack = () => {
    window.location.href =
      "/recruiter-dashboard#applications";
  };

  // ==========================================
  // UPDATE CANDIDATE APPLICATION STATUS
  // ==========================================

  const updateCandidateStatus = async (status) => {
    try {
      const applicationId =
        localStorage.getItem("selectedApplicationId");

      if (!applicationId) {
        alert("Application not found");
        return;
      }

      setActionLoading(true);

      const response = await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        {
          status: status,
        }
      );

      alert(response.data.message);

      localStorage.setItem(
        "selectedApplicationStatus",
        status
      );

    } catch (error) {
      console.log("Update Candidate Status Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update candidate status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // SCHEDULE ONLINE INTERVIEW
const handleScheduleInterview = async (e) => {
  e.preventDefault();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const applicationId = localStorage.getItem(
    "selectedApplicationId"
  );

  if (!user?.id) {
    alert("Recruiter ID not found. Please login again.");
    return;
  }

  if (!applicationId) {
    alert("Application ID not found.");
    return;
  }

  if (!interviewDate || !meetingLink) {
    alert("Please enter interview date, time and meeting link.");
    return;
  }

  if (new Date(interviewDate) <= new Date()) {
    alert("Please select a future interview date and time.");
    return;
  }

  try {
    setInterviewLoading(true);

    const response = await axios.post(
      "http://localhost:5000/api/interviews",
      {
        recruiterId: user.id,
        applicationId: applicationId,
        interviewDate: new Date(interviewDate).toISOString(),
        meetingLink: meetingLink.trim(),
        message: interviewMessage.trim(),
      }
    );

    alert(
      response.data.message ||
        "Interview scheduled successfully!"
    );

    setInterviewDate("");
    setMeetingLink("");
    setInterviewMessage("");
    setShowInterviewForm(false);
  } catch (error) {
    console.log("Schedule Interview Error:", error);

    alert(
      error.response?.data?.message ||
        "Unable to schedule interview. Please try again."
    );
  } finally {
    setInterviewLoading(false);
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Loading Candidate Profile...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // CANDIDATE NOT FOUND
  // ==========================================

  if (!candidate) {
    return (
      <div className="dashboard">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>Candidate not found</h2>

            <button
              className="back-dashboard-btn"
              onClick={goBack}
            >
              ← Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const profileScore = candidate.profileScore || 0;

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <h2>CareerConnect</h2>

        <p>Recruiter Panel</p>

        <nav>
          <a href="/recruiter-dashboard">
            🏠 Dashboard
          </a>

          <a href="/recruiter-dashboard#my-jobs">
            💼 My Jobs
          </a>

          <a
            href="/recruiter-dashboard#applications"
            className="active"
          >
            👥 Candidates
          </a>

          <a href="/recruiter-dashboard#applications">
            📄 Applications
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">
          <div>
            <h1>👤 Candidate Profile</h1>

            <p>
              View candidate professional
              information.
            </p>
          </div>

          <button
            className="back-dashboard-btn"
            onClick={goBack}
          >
            ← Back
          </button>
        </div>

        {/* ================= BASIC PROFILE ================= */}

        <section className="dashboard-section">

          <div
            style={{
              textAlign: "center",
              padding: "25px",
            }}
          >

            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                margin: "0 auto 15px",
                background: "#2563eb",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
                fontWeight: "bold",
              }}
            >
              {candidate.name
                ? candidate.name.charAt(0).toUpperCase()
                : "C"}
            </div>

            <h1>{candidate.name}</h1>

            <p>
              {candidate.headline ||
                "Professional Candidate"}
            </p>

            <p>
              📧 {candidate.email}
            </p>

            <p>
              📍{" "}
              {candidate.location ||
                "Location not provided"}
            </p>

            <span
              style={{
                display: "inline-block",
                padding: "6px 15px",
                background: "#e0e7ff",
                color: "#3730a3",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              {candidate.role}
            </span>

          </div>

        </section>

        {/* ================= CANDIDATE ACTIONS ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>⚡ Candidate Actions</h2>

              <p>
                Manage this candidate's
                application.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              padding: "20px",
            }}
          >

            {/* SHORTLIST */}

            <button
              className="accept-btn"
              disabled={actionLoading}
              onClick={() =>
                updateCandidateStatus("shortlisted")
              }
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: actionLoading
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "bold",
              }}
            >
              {actionLoading
                ? "Updating..."
                : "⭐ Shortlist Candidate"}
            </button>

            {/* HIRE */}

            <button
              className="start-mentorship-btn"
              disabled={actionLoading}
              onClick={() =>
                updateCandidateStatus("hired")
              }
              style={{
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: actionLoading
                  ? "not-allowed"
                  : "pointer",
                fontWeight: "bold",
              }}
            >
              {actionLoading
                ? "Updating..."
                : "🎉 Hire Candidate"}
            </button>

          </div>

{/* ================= ONLINE INTERVIEW ================= */}

          <div className="interview-section">

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                setShowInterviewForm(!showInterviewForm)
              }
            >
              📅 Schedule Online Interview
            </button>

            {showInterviewForm && (
              <form
                onSubmit={handleScheduleInterview}
                className="interview-form"
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                }}
              >

                <h3>Schedule Online Interview</h3>

                {/* INTERVIEW DATE AND TIME */}

                <div className="form-group">
                  <label>Interview Date & Time</label>

                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={(e) =>
                      setInterviewDate(e.target.value)
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                {/* GOOGLE MEET / ZOOM LINK */}

                <div className="form-group">
                  <label>Google Meet / Zoom Link</label>

                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) =>
                      setMeetingLink(e.target.value)
                    }
                    placeholder="https://meet.google.com/..."
                    required
                  />
                </div>

                {/* OPTIONAL MESSAGE */}

                <div className="form-group">
                  <label>Message (Optional)</label>

                  <textarea
                    value={interviewMessage}
                    onChange={(e) =>
                      setInterviewMessage(e.target.value)
                    }
                    placeholder="Interview instructions for candidate..."
                    rows="3"
                  />
                </div>

                {/* CONFIRM BUTTON */}

                <button
                  type="submit"
                  className="success-btn"
                  disabled={interviewLoading}
                >
                  {interviewLoading
                    ? "Scheduling..."
                    : "Confirm Interview"}
                </button>

                {/* CANCEL BUTTON */}

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowInterviewForm(false)
                  }
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>

              </form>
            )}

          </div>

        </section>

        {/* ================= PROFILE SCORE ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>📊 Profile Score</h2>

              <p>
                Overall professional profile
                strength.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "25px",
              background: "#f8fafc",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >

            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {profileScore}

              <span
                style={{
                  fontSize: "22px",
                  fontWeight: "normal",
                }}
              >
                /100
              </span>
            </div>

            {/* SCORE BAR */}

            <div
              style={{
                width: "100%",
                height: "18px",
                background: "#e5e7eb",
                borderRadius: "20px",
                overflow: "hidden",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  width: `${profileScore}%`,
                  height: "100%",
                  background: "#2563eb",
                  borderRadius: "20px",
                  transition: "width 0.5s ease",
                }}
              ></div>
            </div>

            <p>
              {profileScore >= 80
                ? "Excellent Profile"
                : profileScore >= 60
                ? "Good Profile"
                : profileScore >= 40
                ? "Average Profile"
                : "Profile Needs Improvement"}
            </p>

          </div>

        </section>

        {/* ================= PROFESSIONAL INFORMATION ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>
                💼 Professional Information
              </h2>

              <p>
                Candidate career details.
              </p>
            </div>
          </div>

          <div className="stats-grid">

            <div className="stat-card">
              <h3>🎓</h3>
              <p>Education</p>

              <h3>
                {candidate.education ||
                  "Not provided"}
              </h3>
            </div>

            <div className="stat-card">
              <h3>💼</h3>
              <p>Experience</p>

              <h3>
                {candidate.experience ||
                  "Not provided"}
              </h3>
            </div>

            <div className="stat-card">
              <h3>⭐</h3>
              <p>Mentor Rating</p>

              <h3>
                {candidate.averageRating > 0
                  ? `${candidate.averageRating.toFixed(1)}/7`
                  : "Not rated"}
              </h3>
            </div>

            <div className="stat-card">
              <h3>💬</h3>
              <p>Total Reviews</p>

              <h3>
                {candidate.totalReviews || 0}
              </h3>
            </div>

          </div>

        </section>

        {/* ================= SKILLS ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>🛠️ Skills</h2>

              <p>
                Candidate technical and
                professional skills.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >

            {candidate.skills &&
            candidate.skills.length > 0 ? (

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >

                {candidate.skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: "8px 14px",
                        background: "#dbeafe",
                        color: "#1e40af",
                        borderRadius: "20px",
                        fontWeight: "600",
                        display: "inline-block",
                      }}
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            ) : (
              <p>No skills provided.</p>
            )}

          </div>

        </section>

        {/* ================= PROJECTS ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>📂 Projects</h2>

              <p>
                Candidate projects and
                practical work.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >

            {candidate.projects &&
            candidate.projects.length > 0 ? (

              <ul
                style={{
                  margin: 0,
                  paddingLeft: "25px",
                  lineHeight: "2",
                }}
              >
                {candidate.projects.map(
                  (project, index) => (
                    <li key={index}>
                      {project}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No projects provided.</p>
            )}

          </div>

        </section>

        {/* ================= CERTIFICATIONS ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>📜 Certifications</h2>

              <p>
                Professional certifications
                and achievements.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
            }}
          >

            {candidate.certifications &&
            candidate.certifications.length > 0 ? (

              <ul
                style={{
                  margin: 0,
                  paddingLeft: "25px",
                  lineHeight: "2",
                }}
              >
                {candidate.certifications.map(
                  (certificate, index) => (
                    <li key={index}>
                      {certificate}
                    </li>
                  )
                )}
              </ul>

            ) : (
              <p>No certifications provided.</p>
            )}

          </div>

        </section>

        {/* ================= ABOUT ================= */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>📝 About Candidate</h2>

              <p>
                Candidate professional
                summary.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              background: "#f8fafc",
              borderRadius: "12px",
              lineHeight: "1.8",
            }}
          >
            {candidate.bio ||
              "No professional summary provided."}
          </div>

        </section>

        {/* ================= MENTOR REVIEWS RECEIVED ================= */}

{candidate.role === "mentor" && (
  <section className="dashboard-section">

    <div className="section-heading">
      <div>
        <h2>⭐ Reviews & Feedback Received</h2>

        <p>
          Reviews and feedback given by students
          to this mentor.
        </p>
      </div>
    </div>

    <div
      style={{
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "12px",
      }}
    >

      {reviewsLoading ? (

        <p>Loading reviews...</p>

      ) : reviews.length > 0 ? (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >

          {reviews.map((review) => (

            <div
              key={review._id}
              style={{
                padding: "20px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >

              {/* STUDENT NAME */}

              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  color: "#1e3a8a",
                }}
              >
                👤 Student:{" "}
                {review.student?.name ||
                  "Student name unavailable"}
              </h3>

              {/* RATING */}

              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#d97706",
                  marginBottom: "10px",
                }}
              >
                ⭐ {review.rating}/7
              </p>

              {/* FEEDBACK */}

              <p
                style={{
                  fontWeight: "600",
                  marginBottom: "6px",
                }}
              >
                Student Feedback:
              </p>

              <p
                style={{
                  lineHeight: "1.8",
                  color: "#374151",
                  marginTop: 0,
                  whiteSpace: "pre-wrap",
                }}
              >
                {review.feedback}
              </p>

              {/* REVIEW DATE */}

              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: 0,
                }}
              >
                📅 Reviewed on:{" "}
                {review.createdAt
                  ? new Date(
                      review.createdAt
                    ).toLocaleDateString("en-IN")
                  : "Date unavailable"}
              </p>

            </div>

          ))}

        </div>

      ) : (

        <p>
          This mentor has not received any student
          reviews yet.
        </p>

      )}

    </div>

  </section>
)}

        {/* ================= BACK ================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "40px",
          }}
        >
          <button
            className="back-dashboard-btn"
            onClick={goBack}
          >
            ← Back to Applications
          </button>
        </div>

      </main>
    </div>
  );
}

export default CandidateProfile;