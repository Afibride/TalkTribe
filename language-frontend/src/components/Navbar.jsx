import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../css/HomeLogin.css';
import SubNavbar from './SubNavbar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" tabIndex={0}>
        <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      </Link>

      {/* Right icons */}
      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </button>

        <button
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Search Bar */}
      <div className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}>
        <input type="text" className="search-bar" placeholder="Search..." />
      </div>

      {/* Desktop Nav Links */}
      <div className="nav-menu desktop-menu">
        <div className="nav-links">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <i className="fas fa-info-circle"></i> About Us
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <i className="fas fa-star"></i> Features
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <i className="fas fa-envelope"></i> Contact Us
          </NavLink>
        </div>
        <div className="auth-buttons">
          <NavLink to="/login" className="btn btn-outline">
            <i className="fas fa-sign-in-alt"></i> Login
          </NavLink>
          <NavLink to="/register" className="btn btn-primary">
            <i className="fas fa-user-plus"></i> Sign Up
          </NavLink>
        </div>
      </div>

      {/* Mobile Hamburger - different stuff */}
      <div className={`nav-menu mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <NavLink to="/help" className="nav-link">
            <i className="fas fa-headset"></i> Get Help
          </NavLink>
          <NavLink to="/settings" className="nav-link">
            <i className="fas fa-cog"></i> Settings
          </NavLink>
          <NavLink to="/login" className="nav-link">
            <i className="fas fa-sign-in-alt"></i> Login
          </NavLink>
          <NavLink to="/register" className="nav-link">
           <i className="fas fa-user-plus"></i> Sign Up
          </NavLink>
        </div>
      </div>
      <SubNavbar />
    </nav>
  );
};

export default Navbar;
