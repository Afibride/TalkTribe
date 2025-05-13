import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/HomeLogin.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="navbar">
      <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i> {/* Font Awesome search icon */}
        </button>
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'} {/* Toggle between hamburger and X */}
        </button>
      </div>
      <div className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}>
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Contact Us
          </NavLink>
        </div>
        <div className="nav-buttons">
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'login-btn active' : 'login-btn')}
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? 'signup-btn active' : 'signup-btn')}
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
