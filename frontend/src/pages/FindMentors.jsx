import { useEffect, useState } from "react";
import axios from "axios";

function FindMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/mentors"
      );

      console.log("Mentors received:", response.data.mentors);

      setMentors(response.data.mentors || []);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching mentors:", error);

      setError("Unable to load mentors");
      setLoading(false);
    }
  };

  const viewMentorProfile = (mentorId) => {
    localStorage.setItem("selectedMentorId", mentorId);
    window.location.href = "/mentor-profile";
  };

  const requestMentorship = (mentorId) => {
    localStorage.setItem("selectedMentorId", mentorId);
    window.location.href = "/mentor-profile";
  };

  if (loading) {
    return (
      <div className="mentors-page">
        <div className="loading-box">
          <h2>Loading mentors...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mentors-page">
        <div className="no-mentors">
          <div className="no-mentor-icon">⚠️</div>
          <h2>{error}</h2>
          <button
            className="view-mentor-btn"
            onClick={fetchMentors}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentors-page">

      {/* Header */}
      <div className="mentors-header">

        <div>
          <h1>Find Mentors</h1>

          <p>
            Connect with experienced professionals
            and get the right career guidance.
          </p>
        </div>

        <a
          href="/student-dashboard"
          className="back-dashboard-btn"
        >
          ← Dashboard
        </a>

      </div>

      {/* No Mentors */}
      {mentors.length === 0 ? (

        <div className="no-mentors">

          <div className="no-mentor-icon">
            🔎
          </div>

          <h2>No mentors available</h2>

          <p>
            There are currently no mentors registered
            on CareerConnect.
          </p>

        </div>

      ) : (

        /* Mentor Cards */
        <div className="mentor-grid">

          {mentors.map((mentor) => (

            <div
              className="mentor-card"
              key={mentor._id}
            >

              {/* Avatar */}
              <div className="mentor-avatar">
                {mentor.name
                  ? mentor.name.charAt(0).toUpperCase()
                  : "M"}
              </div>

              {/* Name */}
              <h2>
                {mentor.name || "Mentor"}
              </h2>

              {/* Headline */}
              <p className="mentor-headline">
                {mentor.headline ||
                  "Professional Mentor"}
              </p>

              {/* Rating */}
              <div className="mentor-rating">

                <span>⭐</span>

                <strong>
                  {mentor.averageRating || 0}
                </strong>

                <span>/ 7</span>

              </div>

              {/* Information */}
              <div className="mentor-info">

                <p>
                  🎓 <strong>Education:</strong>{" "}
                  {mentor.education || "Not added"}
                </p>

                <p>
                  💼 <strong>Experience:</strong>{" "}
                  {mentor.experience || "Not added"}
                </p>

              </div>

              {/* Skills */}
              <div className="mentor-skills">

                <strong>🛠️ Skills</strong>

                <div className="skills-list">

                  {Array.isArray(mentor.skills) &&
                  mentor.skills.length > 0 ? (

                    mentor.skills.map(
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

                    <span className="no-skills">
                      No skills added
                    </span>

                  )}

                </div>

              </div>

              {/* Reviews */}
              <p className="mentor-reviews">
                ⭐ {mentor.totalReviews || 0} Reviews
              </p>

              {/* Buttons */}
              <div className="mentor-actions">

                <button
                  type="button"
                  className="view-mentor-btn"
                  onClick={() =>
                    viewMentorProfile(mentor._id)
                  }
                >
                  View Profile
                </button>

                <button
                  type="button"
                  className="request-mentor-btn"
                  onClick={() =>
                    requestMentorship(mentor._id)
                  }
                >
                  Request Mentorship
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default FindMentors;