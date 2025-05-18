import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import "../css/LoginRegister.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset link.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="right-panel">
        <div className="content">
          <div className="logo" style={{ textAlign: "center", marginBottom: "60px" }}>
            <img src="/logo.png" alt="Talk Tribe logo" className="logo-icon" style={{ height: "100px" }} />
          </div>

          <h2>Reset your password</h2>
          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
