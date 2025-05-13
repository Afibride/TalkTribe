import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/LoginRegister.css";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [userInputCode, setUserInputCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setVerificationCode(code);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (userInputCode !== verificationCode) {
      alert("Verification code does not match.");
      return;
    }
    navigate("/home-after-login");
  };

  return (
    <div className="login-container register">
      <div className="left-panel">
        <img src="/login.png" alt="Talk Tribe" className="login-image" />
        <div className="welcome-text">
          <h1>Welcome!!!</h1>
          <h2>
            Your Language. Your Heritage. <br /> Your Voice.
          </h2>
        </div>
      </div>

      <div className="right-panel">
        <div className="content">
          <div className="logo">
            <img src="/logo.png" alt="Talk Tribe logo" className="logo-icon" />
          </div>

          <div className="tabs">
            <NavLink
              to="/login"
              className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
            >
              Register
            </NavLink>
          </div>

          <form className="login-form" onSubmit={handleRegister}>
            <p className="subtext">
              Create your TalkTribe account and become a voice for your culture.
            </p>

            <div className="form-grid">
              <div className="form-column">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email Address"
                  required
                />

                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="Enter Phone number"
                  required
                />

                <label>User name</label>
                <input
                  type="text"
                  placeholder="Enter User name"
                  required
                />
              </div>

              <div className="form-column">
                <div className="password-field">
                  <label>Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    required
                  />
                  {showPassword ? (
                    <FaEyeSlash
                      className="toggle-password-icon"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="toggle-password-icon"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>

                <div className="password-field">
                  <label>Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                  />
                  {showConfirmPassword ? (
                    <FaEyeSlash
                      className="toggle-password-icon"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="toggle-password-icon"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </div>

                <label>Verification Code</label>
                <div className="verification-code-container">
                  <input
                    type="text"
                    placeholder="Enter the code shown"
                    value={userInputCode}
                    onChange={(e) =>
                      setUserInputCode(e.target.value.toUpperCase())
                    }
                    required
                  />
                  <div
                    className="code-box"
                    onClick={generateCode}
                    title="Click to refresh"
                  >
                    {verificationCode}
                  </div>
                </div>
              </div>
            </div>

            <p className="subtext">
              By clicking Register, you agree to our Terms of Service and Privacy Policy.
            </p>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button type="submit" className="login-btn">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;

