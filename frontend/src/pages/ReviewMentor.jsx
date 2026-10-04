import { useState } from "react";
import axios from "axios";

function ReviewMentor() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const mentor = JSON.parse(
    localStorage.getItem("selectedMentor")
  );

  const submitReview = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please login as a student");
      return;
    }

    if (!mentor?._id) {
      alert("Mentor information not found");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (!feedback.trim()) {
      alert("Please write your feedback");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/review",
        {
          studentId: user.id,
          mentorId: mentor._id,
          rating: rating,
          feedback: feedback,
        }
      );

      alert(response.data.message);

      setRating(0);
      setFeedback("");

      window.location.href = "/find-mentors";

    } catch (error) {
      console.log("Submit Review Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* HEADER */}

        <div className="profile-header">

          <div className="profile-avatar">
            {mentor?.name
              ? mentor.name.charAt(0).toUpperCase()
              : "M"}
          </div>

          <div>
            <h1>⭐ Review Your Mentor</h1>

            <p>
              Share your mentorship experience
            </p>
          </div>

        </div>


        {/* REVIEW CARD */}

        <div className="profile-section">

          <h2>
            {mentor?.name || "Mentor"}
          </h2>

          <p>
            {mentor?.headline ||
              "Professional Mentor"}
          </p>


          {/* RATING */}

          <label>
            Rating
          </label>

          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >

            {[1, 2, 3, 4, 5, 6, 7].map(
              (star) => (

                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "32px",
                    cursor: "pointer",
                    color:
                      star <= rating
                        ? "#f59e0b"
                        : "#cbd5e1",
                  }}
                >
                  ★
                </button>

              )
            )}

          </div>

          <p
            style={{
              marginBottom: "15px",
              color: "#64748b",
            }}
          >
            Selected Rating:{" "}
            <strong>
              {rating} / 7
            </strong>
          </p>


          {/* FEEDBACK */}

          <label>
            Your Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(e) =>
              setFeedback(e.target.value)
            }
            placeholder="Write your experience with this mentor..."
            rows="6"
          />


          {/* ACTIONS */}

          <div className="profile-actions">

            <button
              type="button"
              className="back-btn"
              onClick={() =>
                window.history.back()
              }
            >
              ← Back
            </button>

            <button
              type="button"
              className="save-profile-btn"
              onClick={submitReview}
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "⭐ Submit Review"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ReviewMentor;