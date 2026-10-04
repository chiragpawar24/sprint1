import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        {
          name,
          email,
          password,
          role,
        }
      );

      alert(
        response.data.message ||
          "Registration successful!"
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("student");

      window.location.href = "/login";
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            "Registration failed"
        );
      } else {
        alert("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="auth-page register-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="brand-icon">CC</div>

          <h1>CareerConnect</h1>

          <p>
            Connect. Learn. Grow.
          </p>
        </div>

        <div className="auth-heading">
          <h2>Create Account</h2>

          <p>
            Start your career journey with us
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <div className="auth-field">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label>Select Role</label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            >
              <option value="student">
                Student
              </option>

              <option value="mentor">
                Mentor
              </option>

              <option value="recruiter">
                Recruiter
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <a href="/login">
            Login
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;