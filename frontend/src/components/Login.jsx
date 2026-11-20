
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span>V</span>
          ValueVault
        </Link>

        <div className="auth-heading">
          <h1>Welcome Back!</h1>
          <p>Login to continue your ValueVault journey.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Account"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register"> Create Account</Link>
        </div>

        <Link to="/" className="auth-home-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Login;
