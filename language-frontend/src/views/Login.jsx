import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";
import { validateField } from "../utils/validation";

function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status only once on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

        if (token && user && location.pathname === "/login") {
          // Small delay to ensure all state is loaded
          await new Promise(resolve => setTimeout(resolve, 100));
          navigate("/home-after-login", {
            state: { user, isNewUser: false },
            replace: true // Prevent going back to login page
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Show toast message if redirected with one
  useEffect(() => {
    if (location.state?.toastMessage) {
      toast.success(location.state.toastMessage);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleBlur = (fieldName, value) => {
    const error = validateField(fieldName, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    } else if (errors[fieldName]) {
      const newErrors = { ...errors };
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate fields
    const loginError = validateField("loginInput", loginInput);
    const passwordError = validateField("password", password);

    if (loginError || passwordError) {
      setErrors({
        loginInput: loginError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/api/login", {
        login: loginInput,
        password: password,
      });

      const { token, user, is_new_user } = response.data;

      // Store token and user based on remember me choice
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", token);
      storage.setItem("user", JSON.stringify(user));

      toast.success("Login successful! Welcome back.");

      // Navigate with replace to prevent going back to login
      navigate("/home-after-login", {
        state: {
          user,
          isNewUser: is_new_user,
        },
        replace: true
      });
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (!isAuthChecked) {
    return <div className="loading-centered">Checking authentication...</div>;
  }

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
        <button
          className="back-arrow-btn"
          onClick={() => navigate("/")}
          aria-label="Back to Home"
          type="button"
        >
          <i className="fas fa-home"></i> Home
        </button>
        <div className="content">
          <div className="logo">
            <img src="/logo.png" alt="Talk Tribe logo" className="logo-icon" />
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
              disabled={isLoading}
            />
            {errors.loginInput && (
              <span className="auth-error-text">{errors.loginInput}</span>
            )}

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password", password)}
                placeholder="Password"
                className={`auth-input ${errors.password ? "auth-error" : ""}`}
                autoComplete="current-password"
                disabled={isLoading}
              />
              {showPassword ? (
                <FaEyeSlash
                  className="toggle-password-icon"
                  onClick={() => !isLoading && setShowPassword(false)}
                />
              ) : (
                <FaEye
                  className="toggle-password-icon"
                  onClick={() => !isLoading && setShowPassword(true)}
                />
              )}
            </div>
            {errors.password && (
              <span className="auth-error-text">{errors.password}</span>
            )}

            <div className="auth-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isLoading}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <button
              type="button"
              className="auth-button secondary"
              style={{ marginTop: "1rem" }}
              onClick={() => navigate("/register")}
              disabled={isLoading}
            >
              Create new Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;