import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import zxcvbn from "zxcvbn";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/api";
import { validateField } from "../utils/validation";
import "../css/LoginRegister.css";

const steps = ["Personal Info", "Account Details", "Verification"];

function Register() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    role: "learner",
    password: "",
    confirmPassword: "",
    verificationCode: "",
    userInputCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    setFormData((prev) => ({ ...prev, verificationCode: code }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    switch (step) {
      case 0:
        ["name", "email", "phone"].forEach((field) => {
          const error = validateField(field, formData[field], formData);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case 1:
        ["username", "password", "confirmPassword"].forEach((field) => {
          const error = validateField(field, formData[field], formData);
          if (error) {
            newErrors[field] = error;
            isValid = false;
          }
        });
        break;
      case 2:
        if (!formData.userInputCode.trim()) {
          newErrors.userInputCode = "Verification code is required";
          isValid = false;
        } else if (
          formData.userInputCode.trim().toUpperCase() !==
          formData.verificationCode.trim().toUpperCase()
        ) {
          newErrors.userInputCode = "Verification code does not match";
          isValid = false;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(step)) return;

    setLoading(true);

    const payload = {
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      name: formData.name,
      role: formData.role,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
    };

    try {
      await api.post("/api/register", payload);
      toast.success("Account created successfully! Please log in!");
      navigate("/login", {
        state: {
          toastMessage: "Account created successfully! Please log in.",
        },
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422 && data.errors) {
          Object.values(data.errors)
            .flat()
            .forEach((msg) => toast.error(msg));
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
          <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />

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
        {/* Back to Login Arrow */}
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

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="step-indicator">
              {steps.map((s, i) => (
                <span key={s} className={i === step ? "active-step" : ""}>
                  {s}
                </span>
              ))}
            </div>

            {step === 0 && (
              <div className="form-step">
                <div className="form-column">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter full name"
                    className={`auth-input ${errors.name ? "auth-error" : ""}`}
                  />
                  {errors.name && (
                    <span className="auth-error-text">{errors.name}</span>
                  )}

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter email address"
                    className={`auth-input ${errors.email ? "auth-error" : ""}`}
                  />
                  {errors.email && (
                    <span className="auth-error-text">{errors.email}</span>
                  )}

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter phone number"
                    className={`auth-input ${errors.phone ? "auth-error" : ""}`}
                  />
                  {errors.phone && (
                    <span className="auth-error-text">{errors.phone}</span>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-step">
                <div className="form-column">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter username"
                    className={`auth-input ${
                      errors.username ? "auth-error" : ""
                    }`}
                  />
                  {errors.username && (
                    <span className="auth-error-text">{errors.username}</span>
                  )}

                  <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter password"
                      className={`auth-input ${
                        errors.password ? "auth-error" : ""
                      }`}
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
                    {formData.password && (
                      <div
                        className={`password-strength strength-${
                          zxcvbn(formData.password).score
                        }`}
                      >
                        Strength:{" "}
                        {
                          ["Very Weak", "Weak", "Fair", "Good", "Strong"][
                            zxcvbn(formData.password).score
                          ]
                        }
                      </div>
                    )}
                    {errors.password && (
                      <span className="auth-error-text">{errors.password}</span>
                    )}
                  </div>

                  <div className="password-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Confirm password"
                      className={`auth-input ${
                        errors.confirmPassword ? "auth-error" : ""
                      }`}
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
                    {errors.confirmPassword && (
                      <span className="auth-error-text">
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="auth-input"
                  >
                    <option value="learner">Learner</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <div className="form-column">
                  <div className="verification-code-container">
                    <input
                      type="text"
                      id="userInputCode"
                      name="userInputCode"
                      placeholder="Enter the code shown"
                      value={formData.userInputCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          userInputCode: e.target.value.toUpperCase(),
                        })
                      }
                      onBlur={() => {
                        if (!formData.userInputCode.trim()) {
                          setErrors((prev) => ({
                            ...prev,
                            userInputCode: "Verification code is required",
                          }));
                        }
                      }}
                      className={`auth-input ${
                        errors.userInputCode ? "auth-error" : ""
                      }`}
                    />
                    <div
                      className="code-box"
                      onClick={generateCode}
                      title="Click to refresh code"
                    >
                      {formData.verificationCode}
                    </div>
                  </div>
                  {errors.userInputCode && (
                    <span className="auth-error-text">
                      {errors.userInputCode}
                    </span>
                  )}
                </div>
                <p className="subtext">
                  By clicking Register, you agree to our{" "}
                  <a href="/terms" target="_blank">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            )}

            <div className="step-actions">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="secondary-btn"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="auth-button"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-button"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              )}
            </div>
          </form>
          <div className="redirect-login">
            <p>
              Already have an account?{"  "}
              <NavLink to="/login" className="login-link">
                Login
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
