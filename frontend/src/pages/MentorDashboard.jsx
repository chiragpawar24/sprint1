import { useEffect, useState } from "react";
import axios from "axios";

function MentorDashboard() {
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  // ================= MEETING STATES =================
  const [meetingType, setMeetingType] = useState("google-meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // ================= USER =================
  const user = JSON.parse(localStorage.getItem("user"));

  // Support both id and _id
  const userId = user?.id || user?._id;

  // ================= LOAD DASHBOARD =================
  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setInterviewsLoading(false);
    }
  }, [userId]);

  // ================= FETCH ALL DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchRequests(),
        fetchSessions(),
        fetchInterviews(),
      ]);

      await fetchMessages();
    } catch (error) {
      console.log("Fetch Mentor Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH MENTORSHIP REQUESTS =================
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mentorship-requests/mentor/${userId}`
      );

      setRequests(response.data.requests || []);
    } catch (error) {
      console.log("Fetch Mentorship Requests Error:", error);
    }
  };

  // ================= FETCH GUIDANCE SESSIONS =================
  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/sessions/mentor/${userId}`
      );

      setSessions(response.data.sessions || []);
    } catch (error) {
      console.log("Fetch Guidance Sessions Error:", error);
    }
  };

  // ================= FETCH JOB INTERVIEWS =================
  const fetchInterviews = async () => {
    try {
      setInterviewsLoading(true);

      console.log("Mentor User:", user);
      console.log("Mentor User ID:", userId);

      const response = await axios.get(
        `http://localhost:5000/api/interviews/candidate/${userId}`
      );

      console.log("Interview API Response:", response.data);

      setInterviews(response.data.interviews || []);
    } catch (error) {
      console.log("Fetch Interviews Error:", error);

      if (error.response) {
        console.log("Interview API Error:", error.response.data);
      }
    } finally {
      setInterviewsLoading(false);
    }
  };

  // ================= FETCH MESSAGES =================
  const fetchMessages = async () => {
    try {
      let allMessages = [];

      for (const request of requests) {
        const studentId = request.student?._id;

        if (studentId) {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/messages/${userId}/${studentId}`
            );

            const studentMessages =
              response.data.messages || [];

            allMessages = [
              ...allMessages,
              ...studentMessages,
            ];
          } catch (error) {
            console.log(
              "Student message fetch error:",
              error
            );
          }
        }
      }

      setMessages(allMessages);
    } catch (error) {
      console.log("Fetch Messages Error:", error);
    }
  };

  // ================= ACCEPT / REJECT REQUEST =================
  const updateRequest = async (requestId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/mentorship-request/${requestId}`,
        {
          status: status,
        }
      );

      alert(response.data.message);

      fetchRequests();
    } catch (error) {
      console.log("Update Request Error:", error);

      alert("Unable to update request");
    }
  };

  // ================= UPDATE SESSION =================
  const updateSession = async (sessionId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/session/${sessionId}`,
        {
          status: status,
        }
      );

      alert(response.data.message);

      fetchSessions();
    } catch (error) {
      console.log("Update Session Error:", error);

      alert("Unable to update guidance session");
    }
  };

  // ================= SAVE MEETING =================
  const saveMeeting = async (sessionId) => {
    try {
      if (!meetingLink.trim()) {
        alert("Please enter a meeting link.");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/session/${sessionId}/meeting`,
        {
          meetingType: meetingType,
          meetingLink: meetingLink.trim(),
        }
      );

      alert(response.data.message);

      setMeetingLink("");
      setSelectedSessionId(null);

      fetchSessions();
    } catch (error) {
      console.log("Save Meeting Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to save meeting link"
        );
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  // ================= OPEN CHAT =================
  const openStudentChat = (student) => {
    localStorage.setItem(
      "selectedChatUser",
      JSON.stringify(student)
    );

    window.location.href = "/message-mentor";
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedMentor");
    localStorage.removeItem("selectedMentorId");
    localStorage.removeItem("selectedChatUser");

    window.location.href = "/login";
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="dashboard-layout">
        <main className="main-content">
          <div className="empty-box">
            <h2>Loading Mentor Dashboard...</h2>
            <p>Please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <h2>CareerConnect</h2>
          <p>Mentor Panel</p>
        </div>

        <nav className="sidebar-nav">

          <a
            href="/mentor-dashboard"
            className="active"
          >
            🏠 Dashboard
          </a>

          <a href="/profile">
            👤 My Profile
          </a>

          <a href="/mentor-dashboard">
            🎓 Student Requests
          </a>

          <a href="/message-mentor">
            💬 Messages
          </a>

          <a href="/jobs">
            💼 Jobs
          </a>

          <a href="/mentor-dashboard">
            ⭐ Reviews
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

      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= HEADER ================= */}

        <div className="dashboard-header">

          <div>

            <h1>
              👨‍🏫 Mentor Dashboard
            </h1>

            <p>
              Welcome, {user?.name || "Mentor"}!
            </p>

            <p>
              Manage student requests, guidance
              sessions, messages and mentorship
              activities from here.
            </p>

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              🎓
            </div>

            <div>
              <p>Student Requests</p>

              <h2>
                {requests.length}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <p>Guidance Sessions</p>

              <h2>
                {sessions.length}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>
              <p>Messages</p>

              <h2>
                {messages.length}
              </h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon">
              ⭐
            </div>

            <div>
              <p>Rating</p>

              <h2>
                {user?.averageRating || 0} / 7
              </h2>
            </div>

          </div>

        </div>

        {/* ================= STUDENT REQUESTS ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                🎓 Student Mentorship Requests
              </h2>

              <p>
                Manage students who want your
                professional guidance.
              </p>

            </div>

          </div>

          {requests.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                🎓
              </div>

              <h3>
                No mentorship requests
              </h3>

              <p>
                Student requests will appear here.
              </p>

            </div>

          ) : (

            <div className="request-list">

              {requests.map((request) => (

                <div
                  className="request-card"
                  key={request._id}
                >

                  <div className="request-info">

                    <div className="profile-avatar">

                      {request.student?.name
                        ? request.student.name
                            .charAt(0)
                            .toUpperCase()
                        : "S"}

                    </div>

                    <div>

                      <h3>
                        {request.student?.name ||
                          "Student"}
                      </h3>

                      <p>
                        📧{" "}
                        {request.student?.email ||
                          "Email not available"}
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {request.status}
                        </strong>
                      </p>

                      {request.message && (
                        <p>
                          💬 {request.message}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="request-actions">

                    {request.status === "pending" && (

                      <div className="action-buttons">

                        <button
                          className="accept-btn"
                          onClick={() =>
                            updateRequest(
                              request._id,
                              "accepted"
                            )
                          }
                        >
                          ✅ Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateRequest(
                              request._id,
                              "rejected"
                            )
                          }
                        >
                          ❌ Reject
                        </button>

                      </div>

                    )}

                    {request.status === "accepted" && (

                      <button
                        className="start-mentorship-btn"
                        onClick={() =>
                          openStudentChat(
                            request.student
                          )
                        }
                      >
                        💬 Message Student
                      </button>

                    )}

                    {request.status === "rejected" && (

                      <span className="status-badge rejected">
                        🔴 Rejected
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= GUIDANCE SESSION REQUESTS ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                📅 Guidance Session Requests
              </h2>

              <p>
                Manage students who have requested
                one-to-one guidance sessions.
              </p>

            </div>

          </div>

          {sessions.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                📅
              </div>

              <h3>
                No guidance session requests
              </h3>

              <p>
                Session requests from students
                will appear here.
              </p>

            </div>

          ) : (

            <div className="request-list">

              {sessions.map((session) => (

                <div
                  className="request-card"
                  key={session._id}
                >

                  <div className="request-info">

                    <div className="profile-avatar">

                      {session.student?.name
                        ? session.student.name
                            .charAt(0)
                            .toUpperCase()
                        : "S"}

                    </div>

                    <div>

                      <h3>
                        {session.student?.name ||
                          "Student"}
                      </h3>

                      <p>
                        📧{" "}
                        {session.student?.email ||
                          "Email not available"}
                      </p>

                      <p>
                        📅 Date:{" "}
                        <strong>
                          {session.date}
                        </strong>
                      </p>

                      <p>
                        🕐 Time:{" "}
                        <strong>
                          {session.time}
                        </strong>
                      </p>

                      <p>
                        📌 Topic:{" "}
                        <strong>
                          {session.topic}
                        </strong>
                      </p>

                      {session.message && (
                        <p>
                          💬 Message:{" "}
                          {session.message}
                        </p>
                      )}

                      <p>
                        Status:{" "}
                        <strong>
                          {session.status}
                        </strong>
                      </p>

                    </div>

                  </div>

                  <div className="request-actions">

                    {session.status === "pending" && (

                      <div className="action-buttons">

                        <button
                          className="accept-btn"
                          onClick={() =>
                            updateSession(
                              session._id,
                              "accepted"
                            )
                          }
                        >
                          ✅ Accept
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() =>
                            updateSession(
                              session._id,
                              "rejected"
                            )
                          }
                        >
                          ❌ Reject
                        </button>

                      </div>

                    )}

                    {session.status === "accepted" && (

                      <div>

                        <span className="status-badge">
                          🟢 Accepted
                        </span>

                        {!session.meetingLink && (

                          <button
                            className="start-mentorship-btn"
                            onClick={() => {
                              setSelectedSessionId(
                                session._id
                              );

                              setMeetingType(
                                "google-meet"
                              );

                              setMeetingLink("");
                            }}
                            style={{
                              marginTop: "10px",
                            }}
                          >
                            🎥 Add Meeting
                          </button>

                        )}

                        {session.meetingLink && (

                          <div
                            style={{
                              marginTop: "10px",
                            }}
                          >

                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="start-mentorship-btn"
                              style={{
                                display: "inline-block",
                                textDecoration: "none",
                                marginRight: "8px",
                              }}
                            >
                              🎥 Join Session
                            </a>

                            <button
                              className="start-mentorship-btn"
                              onClick={() => {
                                setSelectedSessionId(
                                  session._id
                                );

                                setMeetingType(
                                  session.meetingType ||
                                    "google-meet"
                                );

                                setMeetingLink(
                                  session.meetingLink ||
                                    ""
                                );
                              }}
                              style={{
                                marginTop: "8px",
                              }}
                            >
                              ✏️ Edit Meeting
                            </button>

                          </div>

                        )}

                        {selectedSessionId ===
                          session._id && (

                          <div
                            style={{
                              marginTop: "12px",
                              padding: "15px",
                              border: "1px solid #ddd",
                              borderRadius: "10px",
                            }}
                          >

                            <h4>
                              🎥 Session Meeting
                            </h4>

                            <select
                              value={meetingType}
                              onChange={(e) =>
                                setMeetingType(
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                              }}
                            >

                              <option value="google-meet">
                                Google Meet
                              </option>

                              <option value="zoom">
                                Zoom
                              </option>

                            </select>

                            <input
                              type="url"
                              placeholder="Paste Google Meet or Zoom link"
                              value={meetingLink}
                              onChange={(e) =>
                                setMeetingLink(
                                  e.target.value
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "10px",
                                boxSizing: "border-box",
                              }}
                            />

                            <button
                              className="accept-btn"
                              onClick={() =>
                                saveMeeting(
                                  session._id
                                )
                              }
                            >
                              💾 Save Meeting
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => {
                                setSelectedSessionId(null);
                                setMeetingLink("");
                              }}
                              style={{
                                marginLeft: "8px",
                              }}
                            >
                              Cancel
                            </button>

                          </div>

                        )}

                        <br />

                        <button
                          className="start-mentorship-btn"
                          onClick={() =>
                            updateSession(
                              session._id,
                              "completed"
                            )
                          }
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          ✅ Mark Completed
                        </button>

                      </div>

                    )}

                    {session.status === "rejected" && (

                      <span className="status-badge rejected">
                        🔴 Rejected
                      </span>

                    )}

                    {session.status === "completed" && (

                      <span className="status-badge">
                        ✅ Completed
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= JOB INTERVIEWS ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                🎥 My Job Interviews
              </h2>

              <p>
                View interviews scheduled by recruiters
                and join your online interview.
              </p>

            </div>

          </div>

          {interviewsLoading ? (

            <div className="empty-box">

              <h3>
                Loading interviews...
              </h3>

            </div>

          ) : interviews.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                📅
              </div>

              <h3>
                No job interviews scheduled
              </h3>

              <p>
                Recruiter scheduled interviews will
                appear here.
              </p>

            </div>

          ) : (

            <div className="request-list">

              {interviews.map((interview) => (

                <div
                  className="request-card"
                  key={interview._id}
                >

                  <div className="request-info">

                    <div className="profile-avatar">
                      💼
                    </div>

                    <div>

                      <h3>
                        {interview.jobTitle ||
                          "Job Interview"}
                      </h3>

                      <p>
                        👤 Recruiter:{" "}
                        {interview.recruiter?.name ||
                          "Recruiter"}
                      </p>

                      <p>
                        📧 Recruiter Email:{" "}
                        {interview.recruiter?.email ||
                          "Not available"}
                      </p>

                      <p>
                        📅 Date:{" "}
                        <strong>
                          {new Date(
                            interview.interviewDate
                          ).toLocaleDateString()}
                        </strong>
                      </p>

                      <p>
                        🕐 Time:{" "}
                        <strong>
                          {new Date(
                            interview.interviewDate
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {interview.status}
                        </strong>
                      </p>

                      {interview.message && (
                        <p>
                          💬 Message:{" "}
                          {interview.message}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="request-actions">

                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="start-mentorship-btn"
                      style={{
                        display: "inline-block",
                        textDecoration: "none",
                      }}
                    >
                      🎥 Join Interview
                    </a>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ================= MESSAGES ================= */}

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                💬 Messages from Students
              </h2>

              <p>
                Students can contact you about
                their career questions.
              </p>

            </div>

          </div>

          {messages.length === 0 ? (

            <div className="empty-box">

              <div className="stat-icon">
                💬
              </div>

              <h3>
                No messages yet
              </h3>

              <p>
                Messages from your students will
                appear here.
              </p>

            </div>

          ) : (

            <div className="request-list">

              {messages.map((message) => (

                <div
                  className="request-card"
                  key={message._id}
                >

                  <div className="request-info">

                    <div className="profile-avatar">

                      {message.sender?.name
                        ? message.sender.name
                            .charAt(0)
                            .toUpperCase()
                        : "S"}

                    </div>

                    <div>

                      <h3>
                        {message.sender?.name ||
                          "Student"}
                      </h3>

                      <p>
                        📧{" "}
                        {message.sender?.email || ""}
                      </p>

                      <p>
                        💬 {message.message}
                      </p>

                      <small>
                        {message.createdAt
                          ? new Date(
                              message.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>

                  </div>

                  <div className="request-actions">

                    <button
                      className="start-mentorship-btn"
                      onClick={() =>
                        openStudentChat(
                          message.sender
                        )
                      }
                    >
                      💬 Reply
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MentorDashboard;