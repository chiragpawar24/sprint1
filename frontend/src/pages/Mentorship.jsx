import { useEffect, useState } from "react";
import axios from "axios";

function Mentorship() {
  const [mentor, setMentor] = useState(null);

  // Guidance Session states
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const savedMentor = localStorage.getItem("selectedMentor");

    if (savedMentor) {
      setMentor(JSON.parse(savedMentor));
    }
  }, []);

  const openReviewPage = () => {
    if (!mentor?._id) {
      alert("Mentor information not found.");
      return;
    }

    localStorage.setItem(
      "selectedMentor",
      JSON.stringify(mentor)
    );

    window.location.href = "/review-mentor";
  };

  // OPEN SESSION FORM
  const openSessionForm = () => {
    if (!mentor?._id) {
      alert("Mentor information not found.");
      return;
    }

    setShowSessionForm(true);
  };

  // BOOK GUIDANCE SESSION
  const bookSession = async (e) => {
    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user?.id) {
      alert("Please login as a student first.");
      return;
    }

    if (!mentor?._id) {
      alert("Mentor information not found.");
      return;
    }

    if (
      !sessionDate ||
      !sessionTime ||
      !sessionTopic.trim()
    ) {
      alert(
        "Please select date, time and enter session topic."
      );
      return;
    }

    try {
      setBooking(true);

      const response = await axios.post(
        "http://localhost:5000/api/session",
        {
          studentId: user.id,
          mentorId: mentor._id,
          date: sessionDate,
          time: sessionTime,
          topic: sessionTopic,
          message: sessionMessage,
        }
      );

      alert(
        response.data.message ||
          "Guidance session request sent successfully!"
      );

      // Clear form
      setSessionDate("");
      setSessionTime("");
      setSessionTopic("");
      setSessionMessage("");

      setShowSessionForm(false);
    } catch (error) {
      console.log("Book Session Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to book guidance session"
        );
      } else {
        alert("Unable to connect to server");
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="dashboard-page">

      {/* Sidebar */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <h2>CareerConnect</h2>

          <p>Student Panel</p>

        </div>

        <nav className="sidebar-nav">

          <a href="/student-dashboard">
            🏠 Dashboard
          </a>

          <a href="/profile">
            👤 My Profile
          </a>

          <a href="/find-mentors">
            🔎 Find Mentors
          </a>

          <a
            href="/student-dashboard#mentorship-requests"
            className="active"
          >
            🎓 Mentorship
          </a>

          <a href="/jobs">
            💼 Jobs
          </a>

          <a href="/message-mentor">
            💬 Messages
          </a>

          <a href="/notifications">
            🔔 Notifications
          </a>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="dashboard-main">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <h1>
              🎓 Mentorship
            </h1>

            <p>
              Start your mentorship journey with your mentor.
            </p>

          </div>

          <a
            href="/student-dashboard"
            className="back-dashboard-btn"
          >
            ← Dashboard
          </a>

        </div>

        {/* Mentorship Card */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Mentorship Started
              </h2>

              <p>
                Your mentor is ready to guide you.
              </p>

            </div>

            <span className="status-badge accepted">
              🟢 Active
            </span>

          </div>

          {/* Mentor Profile */}

          <div className="mentor-mini-profile">

            <div className="profile-avatar">

              {mentor?.name
                ? mentor.name.charAt(0).toUpperCase()
                : "R"}

            </div>

            <div className="profile-info">

              <h2>
                {mentor?.name || "Rahul Sharma"}
              </h2>

              <p>
                {mentor?.headline ||
                  "Senior Web Developer | React Mentor"}
              </p>

              <div className="profile-details">

                <span>
                  🎓 {mentor?.education || "MCA"}
                </span>

                <span>
                  💼 {mentor?.experience || "3 Years"}
                </span>

                <span>
                  ⭐ {mentor?.averageRating || 0} / 7
                </span>

              </div>

              <div className="skills-container">

                {mentor?.skills &&
                mentor.skills.length > 0 ? (

                  mentor.skills.map((skill, index) => (

                    <span
                      className="skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  ))

                ) : (

                  <>
                    <span className="skill-tag">
                      React
                    </span>

                    <span className="skill-tag">
                      JavaScript
                    </span>

                    <span className="skill-tag">
                      Node.js
                    </span>

                    <span className="skill-tag">
                      MongoDB
                    </span>
                  </>

                )}

              </div>

            </div>

          </div>

        </section>

        {/* Mentorship Actions */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                What would you like to do?
              </h2>

              <p>
                Connect with your mentor and get career guidance.
              </p>

            </div>

          </div>

          <div className="quick-grid">

            {/* Message */}

            <div className="quick-card">

              <span>
                💬
              </span>

              <h3>
                Message Mentor
              </h3>

              <p>
                Send messages and discuss your career
                questions with your mentor.
              </p>

              <button
                onClick={() => {

                  localStorage.setItem(
                    "selectedMentor",
                    JSON.stringify(mentor)
                  );

                  window.location.href =
                    "/message-mentor";

                }}
              >
                💬 Send Message
              </button>

            </div>

            {/* Ask Question */}

            <div className="quick-card">

              <span>
                ❓
              </span>

              <h3>
                Ask a Question
              </h3>

              <p>
                Ask your mentor questions about skills,
                projects and interviews.
              </p>

              <button
                onClick={() =>
                  alert(
                    "Question feature will be added next!"
                  )
                }
              >
                ❓ Ask Question
              </button>

            </div>

            {/* Guidance Session */}

            <div className="quick-card">

              <span>
                📅
              </span>

              <h3>
                Guidance Session
              </h3>

              <p>
                Schedule a career guidance session
                with your mentor.
              </p>

              <button
                onClick={openSessionForm}
              >
                📅 Book Session
              </button>

            </div>

            {/* Review Mentor */}

            <div className="quick-card">

              <span>
                ⭐
              </span>

              <h3>
                Review Mentor
              </h3>

              <p>
                Share your mentorship experience and
                rate your mentor from 1 to 7.
              </p>

              <button
                onClick={openReviewPage}
              >
                ⭐ Give Review
              </button>

            </div>

          </div>

        </section>

        {/* GUIDANCE SESSION FORM */}

        {showSessionForm && (

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  📅 Book Guidance Session
                </h2>

                <p>
                  Request a career guidance session
                  with {mentor?.name || "your mentor"}.
                </p>

              </div>

            </div>

            <form onSubmit={bookSession}>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                }}
              >

                {/* Date */}

                <div>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    📅 Select Date
                  </label>

                  <input
                    type="date"
                    value={sessionDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setSessionDate(e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                </div>

                {/* Time */}

                <div>

                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    🕐 Select Time
                  </label>

                  <input
                    type="time"
                    value={sessionTime}
                    onChange={(e) =>
                      setSessionTime(e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />

                </div>

              </div>

              {/* Topic */}

              <div style={{ marginTop: "20px" }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  🎯 Session Topic
                </label>

                <input
                  type="text"
                  placeholder="Example: React interview preparation"
                  value={sessionTopic}
                  onChange={(e) =>
                    setSessionTopic(e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />

              </div>

              {/* Message */}

              <div style={{ marginTop: "20px" }}>

                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                  }}
                >
                  💬 Message to Mentor
                </label>

                <textarea
                  placeholder="Tell your mentor what you want to discuss..."
                  value={sessionMessage}
                  onChange={(e) =>
                    setSessionMessage(e.target.value)
                  }
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />

              </div>

              {/* Buttons */}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >

                <button
                  type="submit"
                  className="start-mentorship-btn"
                  disabled={booking}
                >
                  {booking
                    ? "⏳ Booking..."
                    : "📅 Send Session Request"}
                </button>

                <button
                  type="button"
                  className="message-mentor-btn"
                  onClick={() =>
                    setShowSessionForm(false)
                  }
                  disabled={booking}
                >
                  ❌ Cancel
                </button>

              </div>

            </form>

          </section>

        )}

        {/* Welcome Section */}

        <section className="dashboard-section">

          <div className="empty-box">

            <div>
              🎉
            </div>

            <h3>
              Your mentorship has started!
            </h3>

            <p>
              You can now communicate with your mentor,
              ask questions and schedule guidance sessions.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Mentorship;