import { useState } from "react";
import API from "../api/axios";

function VerifyOTP() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await API.post("/auth/verify-email", {
        email,
        otp,
      });

      setMessage(response.data.message);
      setOtp("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify Your Email</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          pattern="[0-9]{6}"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && <p className="auth-message">{message}</p>}
      </form>
    </div>
  );
}

export default VerifyOTP;