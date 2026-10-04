import { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // JOB INTERVIEWS
  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  // FETCH ALL DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchRequests(),
        fetchSessions(),
        fetchInterviews(),
      ]);
    } catch (error) {
      console.log(
        "Fetch Dashboard Data Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // FETCH STUDENT MENTORSHIP REQUESTS
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mentorship-requests/student/${user.id}`
      );

      setRequests(response.data.requests || []);
    } catch (error) {
      console.log(
        "Fetch Student Requests Error:",
        error
      );
    }
  };

  // FETCH STUDENT GUIDANCE SESSIONS
  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/sessions/student/${user.id}`
      );

      setSessions(response.data.sessions || []);
    } catch (error) {
      console.log(
        "Fetch Student Sessions Error:",
        error
      );
    }
  };

  // FETCH STUDENT JOB INTERVIEWS
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true);

      const userId = user?.id || user?._id;

      if (!userId) {
        setInterviews([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/interviews/candidate/${userId}`
      );

      console.log(
        "Student Interview API Response:",
        response.data
      );

      setInterviews(
        response.data.interviews || []
      );
    } catch (error) {
      console.log(
        "Fetch Student Interviews Error:",
        error
      );

      setInterviews([]);
    } finally {
      setInterviewsLoading(false);
    }
  };

  // REMOVE DUPLICATE MENTOR REQUESTS
  // Same mentor will appear only once.
  const uniqueRequests = [];

  requests.forEach((request) => {
    const mentorId = request.mentor?._id;

    if (!mentorId) {
      return;
    }

    const existingIndex =
      uniqueRequests.findIndex(
        (item) =>
          item.mentor?._id === mentorId
      );

    if (existingIndex === -1) {
      uniqueRequests.push(request);
    } else {
      const existingRequest =
        uniqueRequests[existingIndex];

      // Accepted request gets priority
      if (
        request.status === "accepted" &&
        existingRequest.status !== "accepted"
      ) {
        uniqueRequests[existingIndex] =
          request;
      }

      // Pending request gets priority over rejected
      else if (
        request.status === "pending" &&
        existingRequest.status === "rejected"
      ) {
        uniqueRequests[existingIndex] =
          request;
      }
    }
  });

  // UNIQUE ACTIVE MENTORS
  const activeMentors =
    uniqueRequests.filter(
      (request) =>
        request.status === "accepted"
    );

  // UNIQUE PENDING REQUESTS
  const pendingRequests =
    uniqueRequests.filter(
      (request) =>
        request.status === "pending"
    );

  // REQUEST MENTORSHIP AGAIN
  const requestAgain = async (mentorId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/mentorship-request",
        {
          studentId: user.id,
          mentorId: mentorId,
          message:
            "I would like to request mentorship again.",
        }
      );

      alert(
        response.data.message ||
          "Mentorship request sent successfully!"
      );

      fetchRequests();
    } catch (error) {
      console.log(
        "Request Again Error:",
        error
      );

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to send request"
        );
      } else {
        alert(
          "Unable to connect to server"
        );
      }
    }
  };

  // START MENTORSHIP
  const startMentorship = (mentor) => {
    if (!mentor) {
      alert(
        "Mentor information not available."
      );
      return;
    }

    localStorage.setItem(
      "selectedMentor",
      JSON.stringify(mentor)
    );

    if (mentor._id) {
      localStorage.setItem(
        "selectedMentorId",
        mentor._id
      );
    }

    window.location.href =
      "/mentorship";
  };

  // MESSAGE MENTOR
  const messageMentor = (mentor) => {
    if (!mentor) {
      alert(
        "Mentor information not available."
      );
      return;
    }

    localStorage.setItem(
      "selectedMentor",
      JSON.stringify(mentor)
    );

    if (mentor._id) {
      localStorage.setItem(
        "selectedMentorId",
        mentor._id
      );
    }

    window.location.href =
      "/message-mentor";
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(
      "selectedMentor"
    );
    localStorage.removeItem(
      "selectedMentorId"
    );
    localStorage.removeItem(
      "selectedChatUser"
    );

    window.location.href =
      "/login";
  };

  // JOIN GUIDANCE SESSION
  const joinSession = (meetingLink) => {
    if (!meetingLink) {
      alert("Meeting link is not available yet.");
      return;
    }

    window.open(meetingLink, "_blank");
  };

  // SESSION STATUS
  const getSessionStatus = (status) => {
    if (status === "pending") {
      return (
        <span className="status-badge pending">
          🟡 Pending
        </span>
      );
    }

    if (status === "accepted") {
      return (
        <span className="status-badge accepted">
          🟢 Accepted
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="status-badge rejected">
          🔴 Rejected
        </span>
      );
    }

    if (status === "completed") {
      return (
        <span className="status-badge accepted">
          ✅ Completed
        </span>
      );
    }

    return (
      <span className="status-badge">
        {status}
      </span>
    );
  };

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="empty-box">
            <h2>
              Loading Dashboard...
            </h2>

            <p>
              Please wait.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="sidebar-brand-icon">
            CC
          </div>

          <div>
            <h2>
              CareerConnect
            </h2>

            <p>
              Student Panel
            </p>
          </div>

        </div>

        <nav className="sidebar-nav">

          <a
            href="/student-dashboard"
            className="active"
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </a>

          <a href="/profile">
            <span>👤</span>
            <span>My Profile</span>
          </a>

          <a href="/find-mentors">
            <span>🔎</span>
            <span>Find Mentors</span>
          </a>

          <a href="/student-dashboard#mentorship-requests">
            <span>🎓</span>
            <span>Mentorship</span>
          </a>

          <a href="/jobs">
            <span>💼</span>
            <span>Jobs</span>
          </a>

          <a href="/message-mentor">
            <span>💬</span>
            <span>Messages</span>
          </a>

          <a href="/notifications">
            <span>🔔</span>
            <span>Notifications</span>
          </a>

        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1>
              👋 Welcome,{" "}
              {user?.name || "Student"}!
            </h1>

            <p>
              Manage your mentorship and
              career journey from here.
            </p>

          </div>

          <div>

            <a
              href="/profile"
              className="back-dashboard-btn"
            >
              👤 My Profile
            </a>

          </div>

        </div>

        {/* QUICK STATS */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🎓
            </div>

            <div>

              <p>
                Mentorship Requests
              </p>

              <h2>
                {uniqueRequests.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              🟢
            </div>

            <div>

              <p>
                Active Mentorship
              </p>

              <h2>
                {activeMentors.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <p>
                Pending Requests
              </p>

              <h2>
                {pendingRequests.length}
              </h2>

            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>

              <p>
                Messages
              </p>

              <h2>
                1
              </h2>

            </div>

          </div>

        </div>

        {/* WELCOME SECTION */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                🚀 Start Your Career Journey
              </h2>

              <p>
                Find the right mentor and get
                professional career guidance.
              </p>

            </div>

            <a
              href="/find-mentors"
              className="primary-btn"
            >
              🔎 Find Mentor
            </a>

          </div>

          <div className="quick-grid">

            <div className="quick-card">

              <span>🔎</span>

              <h3>
                Find Mentors
              </h3>

              <p>
                Search for experienced mentors
                according to your skills and
                career interests.
              </p>

              <a
                href="/find-mentors"
                className="quick-btn"
              >
                Find Mentor
              </a>

            </div>

            <div className="quick-card">

              <span>👤</span>

              <h3>
                Complete Profile
              </h3>

              <p>
                Add your education, skills,
                experience and career interests.
              </p>

              <a
                href="/profile"
                className="quick-btn"
              >
                Update Profile
              </a>

            </div>

            <div className="quick-card">

              <span>💼</span>

              <h3>
                Explore Jobs
              </h3>

              <p>
                Discover career opportunities
                and apply for suitable jobs.
              </p>

              <button
                type="button"
                className="quick-btn"
                onClick={() => {
                  window.location.href =
                    "/jobs";
                }}
              >
                View Jobs
              </button>

            </div>

          </div>

        </section>

        {/* MENTORSHIP REQUESTS */}

        <section
          className="dashboard-section"
          id="mentorship-requests"
        >

          <div className="section-header">

            <div>

              <h2>
                🎓 My Mentorship Requests
              </h2>

              <p>
                Track your mentorship requests
                and communicate with your
                mentors.
              </p>

            </div>

          </div>

          {uniqueRequests.length === 0 ? (

            <div className="empty-box">

              <div
                style={{
                  fontSize: "50px",
                }}
              >
                🎓
              </div>

              <h3>
                No mentorship requests yet
              </h3>

              <p>
                Find a mentor and send your
                first mentorship request.
              </p>

              <a
                href="/find-mentors"
                className="primary-btn"
              >
                🔎 Find Mentors
              </a>

            </div>

          ) : (

            <div className="request-list">

              {uniqueRequests.map(
                (request) => (

                  <div
                    className="request-card"
                    key={request._id}
                  >

                    {/* MENTOR INFORMATION */}

                    <div className="request-info">

                      <div className="profile-avatar">

                        {request.mentor?.name
                          ? request.mentor.name
                              .charAt(0)
                              .toUpperCase()
                          : "M"}

                      </div>

                      <div>

                        <h3>
                          {request.mentor?.name ||
                            "Mentor"}
                        </h3>

                        <p>
                          {request.mentor?.headline ||
                            "Professional Mentor"}
                        </p>

                        <div className="profile-details">

                          <span>
                            🎓{" "}
                            {request.mentor?.education ||
                              "Education not added"}
                          </span>

                          <span>
                            💼{" "}
                            {request.mentor?.experience ||
                              "Experience not added"}
                          </span>

                          <span>
                            ⭐{" "}
                            {request.mentor
                              ?.averageRating || 0}{" "}
                            / 7
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div className="request-actions">

                      {request.status ===
                        "pending" && (
                        <>
                          <span className="status-badge pending">
                            🟡 Pending
                          </span>

                          <p>
                            Waiting for mentor
                            response.
                          </p>
                        </>
                      )}

                      {request.status ===
                        "accepted" && (
                        <>
                          <span className="status-badge accepted">
                            🟢 Accepted
                          </span>

                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                              marginTop: "12px",
                            }}
                          >

                            <button
                              type="button"
                              className="start-mentorship-btn"
                              onClick={() =>
                                startMentorship(
                                  request.mentor
                                )
                              }
                            >
                              🎓 Start Mentorship
                            </button>

                            <button
                              type="button"
                              className="message-mentor-btn"
                              onClick={() =>
                                messageMentor(
                                  request.mentor
                                )
                              }
                            >
                              💬 Message Mentor
                            </button>

                          </div>

                        </>
                      )}

                      {request.status ===
                        "rejected" && (
                        <>
                          <span className="status-badge rejected">
                            🔴 Rejected
                          </span>

                          <p>
                            ❌ Mentor has declined
                            your mentorship request.
                          </p>

                          <button
                            type="button"
                            className="request-again-btn"
                            onClick={() =>
                              requestAgain(
                                request.mentor?._id
                              )
                            }
                          >
                            🔄 Request Again
                          </button>

                        </>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ================= GUIDANCE SESSIONS ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                📅 My Guidance Sessions
              </h2>

              <p>
                Track your guidance session
                requests and their status.
              </p>

            </div>

          </div>

          {sessions.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                📅
              </div>

              <h3>
                No guidance sessions
              </h3>

              <p>
                Your booked guidance sessions
                will appear here.
              </p>

              {activeMentors.length > 0 && (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    startMentorship(
                      activeMentors[0].mentor
                    )
                  }
                >
                  📅 Book Guidance Session
                </button>
              )}

            </div>

          ) : (

            <div className="request-list">

              {sessions.map(
                (session) => (

                  <div
                    className="request-card"
                    key={session._id}
                  >

                    {/* MENTOR INFORMATION */}

                    <div className="request-info">

                      <div className="profile-avatar">

                        {session.mentor?.name
                          ? session.mentor.name
                              .charAt(0)
                              .toUpperCase()
                          : "M"}

                      </div>

                      <div>

                        <h3>
                          {session.mentor?.name ||
                            "Mentor"}
                        </h3>

                        <p>
                          {session.mentor?.headline ||
                            "Professional Mentor"}
                        </p>

                        <div className="profile-details">

                          <span>
                            📅{" "}
                            {session.date}
                          </span>

                          <span>
                            🕐{" "}
                            {session.time}
                          </span>

                          <span>
                            ⭐{" "}
                            {session.mentor
                              ?.averageRating || 0}{" "}
                            / 7
                          </span>

                        </div>

                        <p>
                          📌{" "}
                          <strong>
                            Topic:
                          </strong>{" "}
                          {session.topic}
                        </p>

                        {session.message && (
                          <p>
                            💬{" "}
                            <strong>
                              Message:
                            </strong>{" "}
                            {session.message}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* SESSION STATUS */}

                    <div className="request-actions">

                      {getSessionStatus(
                        session.status
                      )}

                      {session.status ===
                        "pending" && (
                        <p>
                          Waiting for mentor
                          confirmation.
                        </p>
                      )}

                      {session.status === "accepted" && (
                        <>
                          <p>
                            🎉 Your mentor has accepted this guidance
                            session.
                          </p>

                          {session.meetingLink ? (
                            <div
                              style={{
                                marginTop: "12px",
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                              }}
                            >

                              <button
                                type="button"
                                className="start-mentorship-btn"
                                onClick={() =>
                                  joinSession(session.meetingLink)
                                }
                              >
                                🎥 Join Session
                              </button>

                              <span
                                className="status-badge accepted"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {session.meetingType === "zoom"
                                  ? "Zoom Meeting"
                                  : "Google Meet"}
                              </span>

                            </div>
                          ) : (
                            <p style={{ marginTop: "10px" }}>
                              ⏳ Waiting for mentor to add the meeting
                              link.
                            </p>
                          )}
                        </>
                      )}

                      {session.status ===
                        "rejected" && (
                        <p>
                          ❌ Your mentor has
                          rejected this session
                          request.
                        </p>
                      )}

                      {session.status ===
                        "completed" && (
                        <>
                          <p>
                            🎉 This guidance session
                            has been completed.
                          </p>

                          {/* ⭐ REVIEW MENTOR BUTTON - ADDED */}
                          <button
                            type="button"
                            className="start-mentorship-btn"
                            onClick={() => {
                              if (session.mentor?._id) {
                                localStorage.setItem(
                                  "selectedMentorId",
                                  session.mentor._id
                                );
                              }

                              window.location.href =
                                "/review-mentor";
                            }}
                          >
                            ⭐ Review Mentor
                          </button>
                        </>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

          )}

        </section>

        {/* ================= JOB INTERVIEWS ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                💼 My Job Interviews
              </h2>

              <p>
                View your scheduled job interviews
                and join your online interview.
              </p>

            </div>

          </div>

          {interviewsLoading ? (

            <div className="empty-box">

              <div className="stat-icon">
                💼
              </div>

              <h3>
                Loading Interviews...
              </h3>

              <p>
                Please wait.
              </p>

            </div>

          ) : interviews.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                💼
              </div>

              <h3>
                No job interviews scheduled
              </h3>

              <p>
                When a recruiter schedules an
                interview for you, it will appear
                here.
              </p>

            </div>

          ) : (

            <div className="request-list">

              {interviews.map(
                (interview) => (

                  <div
                    className="request-card"
                    key={interview._id}
                  >

                    {/* INTERVIEW INFORMATION */}

                    <div className="request-info">

                      <div className="profile-avatar">
                        💼
                      </div>

                      <div>

                        <h3>
                          {interview.jobTitle ||
                            interview.job?.jobTitle ||
                            "Job Interview"}
                        </h3>

                        <p>
                          👤 Recruiter:{" "}
                          {interview.recruiter?.name ||
                            "Recruiter"}
                        </p>

                        <div className="profile-details">

                          <span>
                            📅{" "}
                            {new Date(
                              interview.interviewDate
                            ).toLocaleDateString()}
                          </span>

                          <span>
                            🕐{" "}
                            {new Date(
                              interview.interviewDate
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <span>
                            🟢 Scheduled
                          </span>

                        </div>

                        {interview.message && (
                          <p>
                            💬{" "}
                            <strong>
                              Message:
                            </strong>{" "}
                            {interview.message}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* INTERVIEW ACTION */}

                    <div className="request-actions">

                      <span className="status-badge accepted">
                        🟢 Interview Scheduled
                      </span>

                      {interview.meetingLink ? (

                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="start-mentorship-btn"
                          style={{
                            display: "inline-block",
                            textDecoration: "none",
                            marginTop: "12px",
                          }}
                        >
                          🎥 Join Interview
                        </a>

                      ) : (

                        <p>
                          ⏳ Meeting link is not
                          available yet.
                        </p>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ACTIVE MENTOR */}

        {activeMentors.length > 0 && (

          <section className="dashboard-section">

            <div className="section-header">

              <div>

                <h2>
                  🎓 Your Active Mentor
                </h2>

                <p>
                  Your accepted mentor is ready
                  to guide you.
                </p>

              </div>

            </div>

            {activeMentors.map(
              (request) => (

                <div
                  className="mentor-mini-profile"
                  key={request.mentor?._id}
                >

                  <div className="profile-avatar">

                    {request.mentor?.name
                      ? request.mentor.name
                          .charAt(0)
                          .toUpperCase()
                      : "M"}

                  </div>

                  <div className="profile-info">

                    <h2>
                      {request.mentor?.name ||
                        "Mentor"}
                    </h2>

                    <p>
                      {request.mentor?.headline ||
                        "Professional Mentor"}
                    </p>

                    <div className="profile-details">

                      <span>
                        🎓{" "}
                        {request.mentor?.education ||
                          "Education not added"}
                      </span>

                      <span>
                        💼{" "}
                        {request.mentor?.experience ||
                          "Experience not added"}
                      </span>

                      <span>
                        ⭐{" "}
                        {request.mentor
                          ?.averageRating || 0}{" "}
                        / 7
                      </span>

                    </div>

                    {/* SKILLS */}

                    <div className="skills-container">

                      {request.mentor?.skills &&
                      request.mentor.skills.length >
                        0 ? (

                        request.mentor.skills.map(
                          (skill, index) => (

                            <span
                              className="skill-tag"
                              key={index}
                            >
                              {skill}
                            </span>

                          )
                        )

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

                    {/* ACTION BUTTONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginTop: "15px",
                      }}
                    >

                      <button
                        type="button"
                        className="start-mentorship-btn"
                        onClick={() =>
                          startMentorship(
                            request.mentor
                          )
                        }
                      >
                        🎓 Open Mentorship
                      </button>

                      <button
                        type="button"
                        className="message-mentor-btn"
                        onClick={() =>
                          messageMentor(
                            request.mentor
                          )
                        }
                      >
                        💬 Message Mentor
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default StudentDashboard;