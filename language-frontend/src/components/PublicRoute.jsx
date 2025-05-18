// src/components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  return token ? <Navigate to="/home-after-login" replace /> : children;
};

export default PublicRoute;
