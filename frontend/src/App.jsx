import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Profile from "./pages/Profile";
import FindMentors from "./pages/FindMentors";
import MentorProfile from "./pages/MentorProfile";
import MentorDashboard from "./pages/MentorDashboard";
import Mentorship from "./pages/Mentorship";
import MessageMentor from "./pages/MessageMentor";
import Notifications from "./pages/Notifications";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Jobs from "./pages/Jobs";
import CandidateProfile from "./pages/CandidateProfile";
import Candidates from "./pages/Candidates";
import ReviewMentor from "./pages/ReviewMentor";


/* =========================
   HOME PAGE
========================= */

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="home-navbar">

        <div className="home-logo">
          <div className="home-logo-icon">
            CC
          </div>

          <div>
            <h2>CareerConnect</h2>
            <span>Connect • Learn • Grow</span>
          </div>
        </div>


        <div className="home-nav-links">

          <a href="/" className="active">
            Home
          </a>

          <a href="/login">
            Login
          </a>

          <a
            href="/register"
            className="nav-register"
          >
            Register
          </a>

        </div>

      </nav>


      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-badge">
            🚀 Build Your Future With Confidence
          </div>

          <h1>
            Build Your
            <span> Career</span>
            <br />
            With The Right Guidance
          </h1>

          <p>
            Connect with experienced mentors, discover
            career opportunities, apply for jobs and grow
            your professional journey with CareerConnect.
          </p>


          <div className="hero-buttons">

            <a
              href="/register"
              className="home-primary-btn"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="home-secondary-btn"
            >
              Login
            </a>

          </div>

        </div>


        {/* HERO RIGHT SIDE */}

        <div className="hero-visual">

          <div className="hero-main-card">

            <div className="hero-card-icon">
              🎯
            </div>

            <h3>
              Your Career Journey
            </h3>

            <p>
              Learn from mentors, explore jobs
              and achieve your career goals.
            </p>


            <div className="hero-mini-stats">

              <div>
                <strong>Mentors</strong>
                <span>Learn & Grow</span>
              </div>

              <div>
                <strong>Jobs</strong>
                <span>Find Opportunities</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          ROLE SECTION
      ========================= */}

      <section className="roles-section">

        <div className="section-heading">

          <span>
            HOW CAREERCONNECT HELPS
          </span>

          <h2>
            One Platform. Three Opportunities.
          </h2>

          <p>
            CareerConnect brings students, mentors and
            recruiters together in one platform.
          </p>

        </div>


        <div className="role-cards">


          {/* STUDENT */}

          <div className="role-card student-card">

            <div className="role-icon">
              🎓
            </div>

            <h3>
              Student
            </h3>

            <p>
              Welcome, Student!
            </p>

            <span>
              Find experienced mentors, ask questions,
              receive career guidance and discover
              suitable job opportunities.
            </span>

            <a href="/register">
              Join as Student →
            </a>

          </div>


          {/* MENTOR */}

          <div className="role-card mentor-card">

            <div className="role-icon">
              👨‍🏫
            </div>

            <h3>
              Mentor
            </h3>

            <p>
              Welcome, Mentor!
            </p>

            <span>
              Manage student requests, messages and
              mentorship activities while sharing your
              professional knowledge and experience.
            </span>

            <a href="/register">
              Join as Mentor →
            </a>

          </div>


          {/* RECRUITER */}

          <div className="role-card recruiter-card">

            <div className="role-icon">
              💼
            </div>

            <h3>
              Recruiter
            </h3>

            <p>
              Welcome, Recruiter!
            </p>

            <span>
              Post job opportunities, discover skilled
              candidates, review applications and
              manage your hiring process.
            </span>

            <a href="/register">
              Join as Recruiter →
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          BOTTOM CTA
      ========================= */}

      <section className="home-cta">

        <h2>
          Ready to Grow Your Career?
        </h2>

        <p>
          Start your journey with CareerConnect today.
        </p>

        <a href="/register">
          Create Your Account
        </a>

      </section>


      {/* FOOTER */}

      <footer className="home-footer">

        <h3>
          CareerConnect
        </h3>

        <p>
          Connecting Students, Mentors & Recruiters
        </p>

        <span>
          © 2026 CareerConnect. All Rights Reserved.
        </span>

      </footer>

    </div>
  );
}


/* =========================
   APP ROUTES
========================= */

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/find-mentors"
          element={<FindMentors />}
        />

        <Route
          path="/mentor-profile"
          element={<MentorProfile />}
        />

        <Route
          path="/mentor-dashboard"
          element={<MentorDashboard />}
        />

        <Route
          path="/mentorship"
          element={<Mentorship />}
        />

        <Route
          path="/message-mentor"
          element={<MessageMentor />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/recruiter-dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/candidate-profile"
          element={<CandidateProfile />}
        />

        <Route
          path="/candidates"
          element={<Candidates />}
        />
        <Route
           path="/review-mentor"
           element={<ReviewMentor />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;