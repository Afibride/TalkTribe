import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import zxcvbn from "zxcvbn";
import api from "../api/api";
import { validateField } from "../utils/validation";
import AuthLayout from "../components/AuthLayout";
import "../css/LoginRegister.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBlur = (fieldName, value) => {
    const error = validateField(fieldName, value, { password, password_confirmation });
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    } else if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    const confirmError = validateField("password_confirmation", password_confirmation, { password });

    if (emailError || passwordError || confirmError) {
      setErrors({
        email: emailError,
        password: passwordError,
        password_confirmation: confirmError
      });
      return;
    }

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
    <AuthLayout 
      title="Set New Password"
      subtitle="Create a new password for your account"
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email", email)}
          className={`auth-input ${errors.email ? "auth-error" : ""}`}
          required
          placeholder="Your email"
        />
        {errors.email && <span className="auth-error-text">{errors.email}</span>}

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password", password)}
            className={`auth-input ${errors.password ? "auth-error" : ""}`}
            required
            placeholder="New password"
          />
          {showPassword ? (
            <FaEyeSlash className="toggle-password-icon" onClick={() => setShowPassword(false)} />
          ) : (
            <FaEye className="toggle-password-icon" onClick={() => setShowPassword(true)} />
          )}
          {password && (
            <div className={`password-strength strength-${zxcvbn(password).score}`}>
              Strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][zxcvbn(password).score]}
            </div>
          )}
        </div>
        {errors.password && <span className="auth-error-text">{errors.password}</span>}

        <div className="password-field">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            onBlur={() => handleBlur("password_confirmation", password_confirmation)}
            className={`auth-input ${errors.password_confirmation ? "auth-error" : ""}`}
            required
            placeholder="Confirm new password"
          />
          {showConfirmPassword ? (
            <FaEyeSlash className="toggle-password-icon" onClick={() => setShowConfirmPassword(false)} />
          ) : (
            <FaEye className="toggle-password-icon" onClick={() => setShowConfirmPassword(true)} />
          )}
        </div>
        {errors.password_confirmation && <span className="auth-error-text">{errors.password_confirmation}</span>}

        <button 
          type="submit" 
          className="auth-button" 
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;