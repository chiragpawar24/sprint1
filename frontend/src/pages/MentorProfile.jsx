
import { useEffect, useState } from "react";
import axios from "axios";

function MentorProfile() {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Mentorship and session workflow
  const [mentorshipStatus, setMentorshipStatus] = useState("");
  const [hasCompletedSession, setHasCompletedSession] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(true);

  // Guidance session states
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  useEffect(() => {
    const mentorId = localStorage.getItem("selectedMentorId");
    const storedUser = localStorage.getItem("user");

    if (!mentorId) {
      setLoading(false);
      setWorkflowLoading(false);
      return;
    }

    fetchMentor(mentorId);
    fetchReviews(mentorId);

    if (storedUser) {
      try {
        const student = JSON.parse(storedUser);
        const studentId = student.id || student._id;

        if (studentId) {
          fetchWorkflowStatus(studentId, mentorId);
        } else {
          setWorkflowLoading(false);
        }
      } catch (error) {
        console.log("Error reading student:", error);
        setWorkflowLoading(false);
      }
    } else {
      setWorkflowLoading(false);
    }
  }, []);

  // ================= FETCH MENTOR =================
  const fetchMentor = async (mentorId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/mentors/" + mentorId
      );

      const mentorData = response.data.mentor;

      setMentor(mentorData);

      localStorage.setItem(
        "selectedMentor",
        JSON.stringify(mentorData)
      );
    } catch (error) {
      console.log("Error fetching mentor:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH REVIEWS =================
  const fetchReviews = async (mentorId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/reviews/mentor/" + mentorId
      );

      setReviews(response.data.reviews || []);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  // ================= FETCH WORKFLOW STATUS =================
  const fetchWorkflowStatus = async (studentId, mentorId) => {
    try {
      // Check mentorship request status
      const mentorshipResponse = await axios.get(
        "http://localhost:5000/api/mentorship-requests/student/" +
          studentId
      );

      const mentorshipRequests =
        mentorshipResponse.data.requests || [];

      const matchingRequest = mentorshipRequests.find(
        (request) => {
          const requestMentorId =
            request.mentor?._id || request.mentor;

          return (
            String(requestMentorId) === String(mentorId)
          );
        }
      );

      if (matchingRequest) {
        setMentorshipStatus(matchingRequest.status);
      } else {
        setMentorshipStatus("");
      }

      // Check guidance sessions for this mentor
      const sessionResponse = await axios.get(
        "http://localhost:5000/api/sessions/student/" +
          studentId
      );

      const sessions = sessionResponse.data.sessions || [];
      console.log("Mentorship Status:", matchingRequest?.status);
      console.log("Sessions for this mentor:", matchingSessions);

      const matchingSessions = sessions.filter(
        (session) => {
          const sessionMentorId =
            session.mentor?._id || session.mentor;

          return (
            String(sessionMentorId) === String(mentorId)
          );
        }
      );

      const completed = matchingSessions.some(
        (session) => session.status === "completed"
      );

      setHasCompletedSession(completed);
    } catch (error) {
      console.log("Error fetching workflow status:", error);
    } finally {
      setWorkflowLoading(false);
    }
  };

  // ================= REQUEST MENTORSHIP =================
  const sendMentorshipRequest = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login as a student first.");
        return;
      }

      const student = JSON.parse(storedUser);
      const studentId = student.id || student._id;
      const mentorId = localStorage.getItem("selectedMentorId");

      if (!studentId) {
        alert("Student information not found.");
        return;
      }

      if (!mentorId) {
        alert("Mentor not selected.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/mentorship-request",
        {
          studentId,
          mentorId,
          message:
            "Hello, I would like to get mentorship and career guidance from you.",
        }
      );

      alert(response.data.message);

      // Refresh workflow after sending request
      await fetchWorkflowStatus(studentId, mentorId);
    } catch (error) {
      console.log("Request Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to send mentorship request"
        );
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  // ================= OPEN GUIDANCE SESSION FORM =================
  const openSessionForm = () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login as a student first.");
      return;
    }

    setShowSessionForm(true);
  };

  // ================= BOOK GUIDANCE SESSION =================
  const bookGuidanceSession = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login as a student first.");
        return;
      }

      const student = JSON.parse(storedUser);
      const studentId = student.id || student._id;
      const mentorId = localStorage.getItem("selectedMentorId");

      if (!studentId) {
        alert("Student information not found.");
        return;
      }

      if (!mentorId) {
        alert("Mentor not selected.");
        return;
      }

      if (!sessionDate) {
        alert("Please select a date.");
        return;
      }

      if (!sessionTime) {
        alert("Please select a time.");
        return;
      }

      if (!sessionTopic.trim()) {
        alert("Please enter the session topic.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/session",
        {
          studentId,
          mentorId,
          date: sessionDate,
          time: sessionTime,
          topic: sessionTopic.trim(),
          message: sessionMessage.trim(),
        }
      );

      alert(response.data.message);

      setSessionDate("");
      setSessionTime("");
      setSessionTopic("");
      setSessionMessage("");
      setShowSessionForm(false);

      // Refresh status after booking
      await fetchWorkflowStatus(studentId, mentorId);
    } catch (error) {
      console.log("Book Guidance Session Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Unable to book guidance session"
        );
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  // ================= REVIEW PAGE =================
  const openReviewPage = () => {
    if (!mentor || !mentor._id) {
      alert("Mentor information not found.");
      return;
    }

    localStorage.setItem(
      "selectedMentor",
      JSON.stringify(mentor)
    );

    window.location.href = "/review-mentor";
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="mentor-profile-page full-center-profile">
        <h2>Loading mentor profile...</h2>
      </div>
    );
  }

  // ================= MENTOR NOT FOUND =================
  if (!mentor) {
    return (
      <div className="mentor-profile-page full-center-profile">
        <div className="mentor-profile-empty">
          <h2>Mentor not found</h2>

          <p>
            Please select a mentor from the Find Mentors page.
          </p>

          <a href="/find-mentors">
            ← Back to Find Mentors
          </a>
        </div>
      </div>
    );
  }

  // ================= WORKFLOW BUTTONS =================
  const renderWorkflowButtons = () => {
    if (workflowLoading) {
      return <p>Checking mentorship status...</p>;
    }

    // Mentorship request accepted and session completed
    if (
      mentorshipStatus === "accepted" &&
      hasCompletedSession
    ) {
      return (
        <button
          className="request-profile-btn large"
          onClick={openReviewPage}
          style={{
            marginTop: "12px",
            background: "#f59e0b",
          }}
        >
          ⭐ Review Mentor
        </button>
      );
    }

    // Mentorship accepted but session not completed
    if (mentorshipStatus === "accepted") {
      return (
        <button
          className="request-profile-btn large"
          onClick={openSessionForm}
          style={{
            marginTop: "12px",
            background: "#2563eb",
          }}
        >
          📅 Book Guidance Session
        </button>
      );
    }

    // Request is waiting for mentor response
    if (mentorshipStatus === "pending") {
      return (
        <button
          className="request-profile-btn large"
          disabled
          style={{
            marginTop: "12px",
            opacity: 0.7,
            cursor: "not-allowed",
          }}
        >
          ⏳ Mentorship Request Pending
        </button>
      );
    }

    // No request or previous request was rejected
    return (
      <button
        className="request-profile-btn large"
        onClick={sendMentorshipRequest}
      >
        🎓 Request Mentorship
      </button>
    );
  };

  return (
    <div className="mentor-profile-page full-center-profile">

      <div className="mentor-profile-top">
        <a href="/find-mentors">
          ← Back to Find Mentors
        </a>
      </div>

      <div className="mentor-profile-card">

        <div className="mentor-profile-avatar">
          {mentor.name
            ? mentor.name.charAt(0).toUpperCase()
            : "M"}
        </div>

        <div className="mentor-profile-main">

          <h1>{mentor.name}</h1>

          <p className="mentor-profile-headline">
            {mentor.headline || "Professional Mentor"}
          </p>

          <div className="mentor-profile-rating">

            <span>⭐</span>

            <strong>
              {mentor.averageRating || 0}
            </strong>

            <span>/ 7</span>

            <span>
              ({mentor.totalReviews || 0} Reviews)
            </span>

          </div>

        </div>

        {renderWorkflowButtons()}

      </div>

      <div className="mentor-profile-content">

        {/* ABOUT MENTOR */}
        <section className="mentor-detail-section">

          <h2>About Mentor</h2>

          <p>
            {mentor.bio ||
              "This mentor has not added a bio yet."}
          </p>

        </section>

        {/* PROFESSIONAL INFORMATION */}
        <section className="mentor-detail-section">

          <h2>Professional Information</h2>

          <div className="mentor-detail-grid">

            <div className="mentor-detail-box">

              <span>🎓</span>

              <div>
                <strong>Education</strong>

                <p>
                  {mentor.education || "Not added"}
                </p>
              </div>

            </div>

            <div className="mentor-detail-box">

              <span>💼</span>

              <div>
                <strong>Experience</strong>

                <p>
                  {mentor.experience || "Not added"}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* SKILLS */}
        <section className="mentor-detail-section">

          <h2>Skills & Expertise</h2>

          <div className="mentor-profile-skills">

            {mentor.skills &&
            mentor.skills.length > 0 ? (

              mentor.skills.map((skill, index) => (
                <span
                  className="profile-skill-tag"
                  key={index}
                >
                  {skill}
                </span>
              ))

            ) : (

              <p>No skills added yet.</p>

            )}

          </div>

        </section>

        {/* MENTOR RATING */}
        <section className="mentor-detail-section">

          <h2>Mentor Rating</h2>

          <div className="rating-summary">

            <div className="big-rating">
              ⭐ {mentor.averageRating || 0}
              <span>/ 7</span>
            </div>

            <div>

              <p>
                Based on {mentor.totalReviews || 0} reviews
              </p>

              <p>
                Students can rate mentors after
                completing mentorship.
              </p>

            </div>

          </div>

        </section>

        {/* STUDENT REVIEWS */}
        <section className="mentor-detail-section">

          <h2>⭐ Student Reviews</h2>

          {reviews.length === 0 ? (

            <p>
              No reviews yet. Be the first student to
              review this mentor.
            </p>

          ) : (

            <div className="student-reviews">

              {reviews.map((review) => (

                <div
                  className="student-review-card"
                  key={review._id}
                >

                  <div className="student-review-header">

                    <strong>
                      {review.student?.name || "Student"}
                    </strong>

                    <span>
                      ⭐ {review.rating} / 7
                    </span>

                  </div>

                  <p>
                    {review.feedback}
                  </p>

                  <small>
                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </small>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* BOTTOM WORKFLOW BUTTON */}
        <div className="mentor-profile-bottom">
          {renderWorkflowButtons()}
        </div>

        {/* GUIDANCE SESSION FORM */}
        {showSessionForm && (

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              background: "#ffffff",
            }}
          >

            <h2>
              📅 Book Guidance Session
            </h2>

            <p>
              Request a one-to-one guidance session
              with {mentor.name}.
            </p>

            {/* DATE */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              📅 Select Date
            </label>

            <input
              type="date"
              value={sessionDate}
              onChange={(e) =>
                setSessionDate(e.target.value)
              }
              min={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            {/* TIME */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
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
                padding: "10px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            {/* TOPIC */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              📌 Session Topic
            </label>

            <input
              type="text"
              placeholder="Example: React Interview Preparation"
              value={sessionTopic}
              onChange={(e) =>
                setSessionTopic(e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                boxSizing: "border-box",
              }}
            />

            {/* MESSAGE */}
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
              }}
            >
              💬 Message
            </label>

            <textarea
              placeholder="Tell the mentor what you need guidance about..."
              value={sessionMessage}
              onChange={(e) =>
                setSessionMessage(e.target.value)
              }
              rows="4"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />

            {/* BUTTONS */}
            <button
              className="accept-btn"
              onClick={bookGuidanceSession}
            >
              📅 Book Session
            </button>

            <button
              className="reject-btn"
              onClick={() => {
                setShowSessionForm(false);
                setSessionDate("");
                setSessionTime("");
                setSessionTopic("");
                setSessionMessage("");
              }}
              style={{
                marginLeft: "8px",
              }}
            >
              Cancel
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default MentorProfile;