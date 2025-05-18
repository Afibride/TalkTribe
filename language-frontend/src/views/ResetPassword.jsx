import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "../css/LoginRegister.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });

      toast.success("Password reset successful! You can now log in.");
      navigate("/login", { state: { toastMessage: "Password updated!" } });
    } catch (error) {
      const msg = error.response?.data?.message || "Reset failed.";
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

          <h2>Set New Password</h2>
          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
