import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      const response = await API.post("/auth/register", formData);

      setMessage(
        response.data.message ||
        "Registration successful! Check your email for the OTP."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Registration failed. Please try again."
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
          <h1>Create Your Account</h1>
          <p>Join ValueVault and start sharing resources.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

        <Link to="/" className="auth-home-link">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;