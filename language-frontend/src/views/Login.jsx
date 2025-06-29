import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";
import { validateField } from "../utils/validation";
import AuthLayout from "../components/AuthLayout";


function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (token && user && location.pathname === "/login") {
      navigate("/home-after-login", {
        state: { user, isNewUser: false },
      });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleBlur = (fieldName, value) => {
    const error = validateField(fieldName, value);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    } else if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginError = validateField("loginInput", loginInput);
    const passwordError = validateField("password", password);

    if (loginError || passwordError) {
      setErrors({
        loginInput: loginError,
        password: passwordError
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/login", {
        login: loginInput,
        password: password,
      });

      const { token, user, is_new_user } = response.data;

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", token);
      storage.setItem("user", JSON.stringify(user));

      toast.success("Login successful! Welcome back.");

      navigate("/home-after-login", {
        state: {
          user,
          isNewUser: is_new_user,
        },
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
       <div className="login-container">
      <div className="left-panel">
        <img src="/login.png" alt="Talk Tribe teacher" className="login-image" />
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
      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          onBlur={() => handleBlur("loginInput", loginInput)}
          placeholder="Email, Username or Phone"
          className={`auth-input ${errors.loginInput ? "auth-error" : ""}`}
          autoComplete="username"
        />
        {errors.loginInput && <span className="auth-error-text">{errors.loginInput}</span>}

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password", password)}
            placeholder="Password"
            className={`auth-input ${errors.password ? "auth-error" : ""}`}
            autoComplete="current-password"
          />
          {showPassword ? (
            <FaEyeSlash className="toggle-password-icon" onClick={() => setShowPassword(false)} />
          ) : (
            <FaEye className="toggle-password-icon" onClick={() => setShowPassword(true)} />
          )}
        </div>
        {errors.password && <span className="auth-error-text">{errors.password}</span>}

        <div className="auth-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        <button 
          type="submit" 
          className="auth-button" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
        </div>
      </div>
  );
}

export default Login;