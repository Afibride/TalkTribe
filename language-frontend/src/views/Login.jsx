import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom"; // NavLink added
import "../css/LoginRegister.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home-after-login");
  };

  return (
    <div className="login-container">
      <div className="left-panel">
        <img
          src="/login.png"
          alt="Talk Tribe teacher"
          className="login-image"
        />
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

          <form className="login-form" onSubmit={handleLogin}>
            <p className="subtext">
              Reconnect with your roots. Learn your language. Celebrate your
              tribe.
            </p>
            <label htmlFor="email">email or Username or Phone</label>
            <input
              type="text"
              placeholder="Enter email or phone or User name"
              required
            />
            <div className="password-field">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                required
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } toggle-password-icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <div className="options">
              <div className="form-group remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
