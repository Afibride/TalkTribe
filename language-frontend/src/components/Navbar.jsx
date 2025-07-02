import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom'; // Add Link import
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
      <Link to="/" tabIndex={0}>
        <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      </Link>
      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </button>
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {isMenuOpen ? 'X' : '☰'}
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
            to="/features"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Features
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Contact Us
          </NavLink>
        </div>
        <div className="auth-buttons">
          <NavLink
            to="/login"
            className="btn btn-outline"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="btn btn-primary"
          >
            Sign Up
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;