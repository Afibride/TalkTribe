import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import api from "../api/api";
import { validateField } from "../utils/validation";
import AuthLayout from "../components/AuthLayout";
import "../css/LoginRegister.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBlur = () => {
    const error = validateField("email", email);
    if (error) {
      setErrors(prev => ({ ...prev, email: error }));
    } else if (errors.email) {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateField("email", email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/forgot-password", { email });
      toast.success("Password reset link sent to your email.");
      setSuccess(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset link.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={success ? "Check your email" : "Reset your password"}
      subtitle={success ? 
        "We've sent a password reset link to your email address" : 
        "Enter your email to receive a reset link"}
      image="/forgot-password.png"
    >
      {!success ? (
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlur}
            className={`auth-input ${errors.email ? "auth-error" : ""}`}
            required
            placeholder="Enter your email"
            autoComplete="email"
          />
          {errors.email && <span className="auth-error-text">{errors.email}</span>}
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="auth-success">
          <p className="auth-success-text">
            If you don't see the email, check your spam folder or try resending.
          </p>
          <button
            onClick={handleSubmit}
            className="auth-button secondary"
            disabled={loading}
          >
            {loading ? "Resending..." : "Resend Link"}
          </button>
          <Link to="/login" className="auth-link">
            Return to Login
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;