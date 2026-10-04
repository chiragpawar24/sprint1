import { useState } from "react";
import axios from "axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isRecruiter = user?.role === "recruiter";

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  const [headline, setHeadline] = useState(
    user?.headline || ""
  );

  const [skills, setSkills] = useState(
    Array.isArray(user?.skills)
      ? user.skills.join(", ")
      : user?.skills || ""
  );

  const [education, setEducation] = useState(
    user?.education || ""
  );

  const [experience, setExperience] = useState(
    user?.experience || ""
  );

  const [location, setLocation] = useState(
    user?.location || ""
  );

  const [projects, setProjects] = useState(
    Array.isArray(user?.projects)
      ? user.projects.join("\n")
      : user?.projects || ""
  );

  const [certifications, setCertifications] =
    useState(
      Array.isArray(user?.certifications)
        ? user.certifications.join("\n")
        : user?.certifications || ""
    );

  const [bio, setBio] = useState(
    user?.bio || ""
  );

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/${user.id}`,
        {
          name,
          headline,

          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== ""),

          education,
          experience,
          location,

          projects: projects
            .split("\n")
            .map((project) => project.trim())
            .filter((project) => project !== ""),

          certifications: certifications
            .split("\n")
            .map((certificate) =>
              certificate.trim()
            )
            .filter(
              (certificate) =>
                certificate !== ""
            ),

          bio,
        }
      );

      alert(response.data.message);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Unable to connect to server");
      }
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* ================= HEADER ================= */}

        <div className="profile-header">

          <div className="profile-avatar">
            {name
              ? name.charAt(0).toUpperCase()
              : "S"}
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Build your professional profile
            </p>
          </div>

        </div>

        <form onSubmit={handleSave}>

          {/* ================= PERSONAL INFORMATION ================= */}

          <div className="profile-section">

            <h2>Personal Information</h2>

            <label>Full Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
              required
            />

            <label>Email</label>

            <input
              type="email"
              value={email}
              readOnly
            />

            <label>
              Professional Headline
            </label>

            <input
              type="text"
              value={headline}
              onChange={(e) =>
                setHeadline(e.target.value)
              }
              placeholder="Add Professional Headline"
            />

            {/* LOCATION */}

            <label>Location</label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Example: Pune, Maharashtra"
            />

          </div>

          {/* ================= EDUCATION & SKILLS ================= */}

          {!isRecruiter && (
            <div className="profile-section">

              <h2>Education & Skills</h2>

              <label>Education</label>

              <input
                type="text"
                value={education}
                onChange={(e) =>
                  setEducation(e.target.value)
                }
                placeholder="Example: TY BSc IT"
              />

              <label>Skills</label>

              <input
                type="text"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="Example: HTML, CSS, JavaScript, React"
              />

              <small>
                Separate multiple skills using
                commas.
              </small>

              <label>Experience</label>

              <input
                type="text"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                placeholder="Example: Fresher / 1 year"
              />

            </div>
          )}

          {/* ================= RECRUITER EXPERIENCE ================= */}

          {isRecruiter && (
            <div className="profile-section">

              <h2>Professional Information</h2>

              <label>Experience</label>

              <input
                type="text"
                value={experience}
                onChange={(e) =>
                  setExperience(e.target.value)
                }
                placeholder="Add Your Experience"
              />

            </div>
          )}

          {/* ================= PROJECTS ================= */}

          {!isRecruiter && (
            <div className="profile-section">

              <h2>📂 Projects</h2>

              <label>
                Projects
              </label>

              <textarea
                value={projects}
                onChange={(e) =>
                  setProjects(e.target.value)
                }
                placeholder={
                  "Enter one project per line.\n\nExample:\nFarmer Marketplace - MERN Project\nCareerConnect - Career Guidance Platform\nFood Plaza - Online Canteen System"
                }
                rows="6"
              />

              <small>
                Enter each project on a new line.
              </small>

            </div>
          )}

          {/* ================= CERTIFICATIONS ================= */}

          {!isRecruiter && (
            <div className="profile-section">

              <h2>📜 Certifications</h2>

              <label>
                Certifications
              </label>

              <textarea
                value={certifications}
                onChange={(e) =>
                  setCertifications(
                    e.target.value
                  )
                }
                placeholder={
                  "Enter one certification per line.\n\nExample:\nJavaScript Certification\nReact Development Certificate\nPython for Data Science"
                }
                rows="6"
              />

              <small>
                Enter each certification on a
                new line.
              </small>

            </div>
          )}

          {/* ================= ABOUT ME ================= */}

          <div className="profile-section">

            <h2>About Me</h2>

            <label>Bio</label>

            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="Write something about yourself..."
              rows="5"
            />

          </div>

          {/* ================= ACTIONS ================= */}

          <div className="profile-actions">

            <button
              type="submit"
              className="save-profile-btn"
            >
              Save Profile
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() =>
                (window.location.href =
                  "/student-dashboard")
              }
            >
              Back to Dashboard
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Profile;