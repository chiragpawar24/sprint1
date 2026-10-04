import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Candidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    skills: "",
    experience: "",
    education: "",
    location: "",
    certification: "",
  });

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const params = {};

      Object.keys(filters).forEach((key) => {
        if (filters[key].trim() !== "") {
          params[key] = filters[key];
        }
      });

      const response = await axios.get(
        "http://localhost:5000/api/candidates",
        { params }
      );

      if (response.data.success) {
        setCandidates(response.data.candidates);
      }
    } catch (error) {
      console.log("Candidate Fetch Error:", error);
      alert("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const clearFilters = () => {
    const emptyFilters = {
      name: "",
      skills: "",
      experience: "",
      education: "",
      location: "",
      certification: "",
    };

    setFilters(emptyFilters);

    setTimeout(() => {
      fetchCandidates();
    }, 100);
  };

  const viewProfile = (candidateId) => {
    localStorage.setItem(
      "selectedCandidateId",
      candidateId
    );

    navigate("/candidate-profile");
  };

  return (
    <div className="candidates-page">

      {/* HEADER */}
      <div className="candidates-header">
        <div>
          <h1>Find Candidates</h1>
          <p>
            Search students and mentors for your job openings.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/recruiter-dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      {/* FILTER BOX */}
      <form
        className="candidate-filters"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          value={filters.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills e.g. React"
          value={filters.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={filters.experience}
          onChange={handleChange}
        />

        <input
          type="text"
          name="education"
          placeholder="Education"
          value={filters.education}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />

        <input
          type="text"
          name="certification"
          placeholder="Certification"
          value={filters.certification}
          onChange={handleChange}
        />

        <button type="submit" className="search-btn">
          🔎 Search
        </button>

        <button
          type="button"
          className="clear-btn"
          onClick={clearFilters}
        >
          Clear
        </button>
      </form>

      {/* RESULTS */}
      <div className="candidate-results">

        <div className="results-title">
          <h2>Candidates</h2>
          <span>
            {candidates.length} candidates found
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="no-candidates">
            <h3>No candidates found</h3>
            <p>
              Try changing your search filters.
            </p>
          </div>
        ) : (
          <div className="candidate-grid">

            {candidates.map((candidate) => (

              <div
                className="candidate-card"
               key={candidate._id || candidate.id}
               
              >

                {/* TOP */}
                <div className="candidate-top">

                  <div className="candidate-avatar">
                    {candidate.name
                      ? candidate.name.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <div>
                    <h3>{candidate.name}</h3>

                    <p className="headline">
                      {candidate.headline ||
                        "CareerConnect Candidate"}
                    </p>

                    <span className="role-badge">
                      {candidate.role}
                    </span>
                  </div>

                </div>

                {/* DETAILS */}
                <div className="candidate-details">

                  <p>
                    <strong>🎓 Education:</strong>{" "}
                    {candidate.education || "Not provided"}
                  </p>

                  <p>
                    <strong>💼 Experience:</strong>{" "}
                    {candidate.experience || "Fresher"}
                  </p>

                  <p>
                    <strong>📍 Location:</strong>{" "}
                    {candidate.location || "Not provided"}
                  </p>

                </div>

                {/* SKILLS */}
                <div className="skills-section">

                  <strong>Skills</strong>

                  <div className="skills-list">

                    {candidate.skills &&
                    candidate.skills.length > 0 ? (
                      candidate.skills.map(
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
                      <span>No skills added</span>
                    )}

                  </div>
                </div>

                {/* SCORE */}
                <div className="candidate-score">

                  <div>
                    <strong>Profile Score</strong>

                    <div className="score-bar">

                      <div
                        className="score-progress"
                        style={{
                          width: `${candidate.profileScore}%`,
                        }}
                      ></div>

                    </div>
                  </div>

                  <strong className="score-number">
                    {candidate.profileScore}/100
                  </strong>

                </div>

                {/* RATING */}
                <div className="candidate-rating">

                  <span>
                    ⭐{" "}
                    {candidate.averageRating
                      ? candidate.averageRating.toFixed(1)
                      : "0.0"}
                    /7
                  </span>

                  <span>
                    {candidate.totalReviews || 0} reviews
                  </span>

                </div>

                {/* BUTTON */}
                <button
                  className="view-profile-btn"
                  onClick={() =>
                  viewProfile(candidate._id || candidate.id)
                   }
                  >
                    View Professional Profile
                </button>
              </div>

            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Candidates;