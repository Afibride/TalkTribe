import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "../css/LoginRegister.css";

function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔁 Auto login if token + user exist
  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (token && user) {
      navigate("/home-after-login", {
        state: { user, isNewUser: false },
      });
    }
  }, []);

  // ✅ Handle toast messages (e.g., after password reset)
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title); // prevent repeated toasts on refresh
    }
  }, [location.state]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/login", {
        login: loginInput,
        password: password,
      });

      const { token, user, is_new_user } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", token);
      storage.setItem("user", JSON.stringify(user));

      console.log("Login success:", { token, user, is_new_user });

      navigate("/home-after-login", {
        state: {
          user,
          isNewUser: is_new_user,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    }
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

            <label>Email, Username or Phone</label>
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="Enter email, username or phone"
              required
            />

            <div className="password-field">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password">Forgot Password?</Link>
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
