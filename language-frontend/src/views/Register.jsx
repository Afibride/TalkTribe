import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";
import "../css/LoginRegister.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("learner");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) navigate("/home-after-login");
  }, [navigate]);

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const isValidPhone = (phone) => {
    const regex = /^\+?[0-9]{7,15}$/;
    return regex.test(phone);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !phone || !username || !name || !password || !confirmPassword || !userInputCode) {
      toast.error("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error("Password must include uppercase, lowercase, number, and symbol.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (userInputCode.trim().toUpperCase() !== verificationCode.trim().toUpperCase()) {
      toast.error("Verification code does not match.");
      setLoading(false);
      return;
    }

    const payload = {
      email,
      phone,
      username,
      name,
      role,
      password,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await api.post("/api/register", payload);

  toast.success("Registered successfully!");

  navigate("/login", {
    state: {
      toastMessage: "Account created successfully! Please log in.",
    },
  });

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422 && data.errors) {
          Object.values(data.errors).flat().forEach((msg) => toast.error(msg));
        } else if (status === 409) {
          toast.error("Email or username already exists.");
        } else if (status === 404) {
          toast.error("API endpoint not found.");
        } else if (status === 419) {
          toast.error("CSRF token mismatch. Please refresh and try again.");
        } else if (status === 500) {
          toast.error("Server error. Try again later.");
        } else {
          toast.error(data.message || "Unknown error.");
        }
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container register">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />

      <div className="left-panel">
        <img src="/login.png" alt="Talk Tribe" className="login-image" />
        <div className="welcome-text">
          <h1>Welcome!!!</h1>
          <h2>Your Language. Your Heritage. <br /> Your Voice.</h2>
        </div>
      </div>

      <div className="right-panel">
        <div className="content">
          <div className="logo">
            <img src="/logo.png" alt="Talk Tribe logo" className="logo-icon" />
          </div>

          <div className="tabs">
            <NavLink to="/login" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>Register</NavLink>
          </div>

          <form className="login-form" onSubmit={handleRegister}>
            <p className="subtext">
              Create your TalkTribe account and become a voice for your culture.
            </p>

            <div className="form-grid">
              <div className="form-column">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" required />

                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" required />

                <label>Phone</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" required />

                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
              </div>

              <div className="form-column">
                <div className="password-field">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
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

                <div className="password-field">
                  <label>Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                  {showConfirmPassword ? (
                    <FaEyeSlash className="toggle-password-icon" onClick={() => setShowConfirmPassword(false)} />
                  ) : (
                    <FaEye className="toggle-password-icon" onClick={() => setShowConfirmPassword(true)} />
                  )}
                </div>

                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="learner">Learner</option>
                  <option value="instructor">Instructor</option>
                </select>

                <label>Verification Code</label>
                <div className="verification-code-container">
                  <input
                    type="text"
                    placeholder="Enter the code shown"
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value.toUpperCase())}
                    required
                  />
                  <div className="code-box" onClick={generateCode} title="Click to refresh code">
                    {verificationCode}
                  </div>
                </div>
              </div>
            </div>

            <p className="subtext">
              By clicking Register, you agree to our <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a>.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
