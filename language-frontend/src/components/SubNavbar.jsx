import React from "react";
import { NavLink } from "react-router-dom";
import "../css/SubNavbar.css";

const SubNavbar = () => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user?.username || "me"; // fallback to avoid crash

  return (
    <div className="subnavbar">
      {token ? (
        <>
          <NavLink to="/home-after-login" className="subnav-icon">
            <i className="fas fa-home"></i>
          </NavLink>
          <NavLink to="/local-languages" className="subnav-icon">
            <i className="fas fa-language"></i>
          </NavLink>
          <NavLink to="/blog" className="subnav-icon">
            <i className="fas fa-blog"></i>
          </NavLink>
          <NavLink to="/about" className="subnav-icon">
            <i className="fas fa-info-circle"></i>
          </NavLink>

          <NavLink to={`/profile/${userName}`} className="subnav-icon">
            <i className="fas fa-user"></i>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/about" className="subnav-icon">
            <i className="fas fa-info-circle"></i>
          </NavLink>
          <NavLink to="/features" className="subnav-icon">
            <i className="fas fa-star"></i>
          </NavLink>
          <NavLink to="/contact" className="subnav-icon">
            <i className="fas fa-envelope"></i>
          </NavLink>
          <NavLink to="/login" className="subnav-icon">
            <i className="fas fa-sign-in-alt"></i>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default SubNavbar;
