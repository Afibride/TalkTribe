import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/HomeLogin.css';

const NewNavbar = () => {
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
      {/* Logo */}
      <img src="/logo.png" alt="TalkTribe Logo" className="logo" />

      {/* Search Bar */}
      <div className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}>
        <input type="text" className="search-bar" placeholder="Search ..." />
      </div>

      {/* Links for Desktop */}
      <div className="nav-menu desktop-menu">
        <div className="nav-links">
          <NavLink
            to="/home-after-login"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/local-languages"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Local Languages
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About Us
          </NavLink>
        </div>
        {/* User Profile */}
        <div className="user-profile">
          <img src="/user.jpg" alt="User Profile" className="profile-pic" />
          <span className="user-name">Tah</span>
          <i className="fas fa-chevron-down dropdown-icon"></i>
        </div>
      </div>

      {/* Hamburger Menu and Search Icon for Mobile */}
      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </button>
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </button>
      </div>

      {/* Hamburger Menu Links for Mobile */}
      <div className={`nav-menu mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <NavLink
            to="/home-after-login"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/local-languages"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Local Languages
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            About Us
          </NavLink>
        </div>
        {/* User Profile */}
        <div className="user-profile">
          <img src="/user.jpg" alt="User Profile" className="profile-pic" />
          <span className="user-name">Tah</span>
          <i className="fas fa-chevron-down dropdown-icon"></i>
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;
