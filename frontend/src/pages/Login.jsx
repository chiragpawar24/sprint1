import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

      const role = response.data.user.role;

      if (role === "mentor") {
        window.location.href = "/mentor-dashboard";
      } else if (role === "recruiter") {
        window.location.href = "/recruiter-dashboard";
      } else {
        window.location.href = "/student-dashboard";
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            "Invalid email or password"
        );
      } else {
        alert("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="brand-icon">CC</div>

          <h1>CareerConnect</h1>

          <p>
            Connect. Learn. Grow.
          </p>
        </div>

        <div className="auth-heading">
          <h2>Welcome Back!</h2>

          <p>
            Login to continue your career journey
          </p>
        </div>

        <form onSubmit={handleLogin}>

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
                placeholder="Enter your password"
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

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/register">
            Create Account
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;