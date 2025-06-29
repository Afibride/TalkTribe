// components/AuthLayout.js
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, NavLink, useLocation, Link } from "react-router-dom";
import "../css/LoginRegister.css";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />

      <div className="auth-right-panel">
        <div className="auth-content">
          <div className="auth-logo">
            <img src="/logo.png" alt="Talk Tribe logo" className="auth-logo-icon" />
          </div>

          <div className="auth-form-container">
            <h2 className="auth-title">{title}</h2>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;