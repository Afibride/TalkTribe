import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../css/HomeLogin.css';

const NewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user?.username || "User";
  const profilePic = user?.profilePic || "/profile.png"; 

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setIsSearchOpen(false); // auto-close search on menu open
  };

  const toggleSearch = () => setIsSearchOpen(prev => !prev);
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    localStorage.clear(); // removes token, user, everything
    setShowLogoutConfirm(false);
    closeDropdown();
    navigate("/", {
      state: { toastMessage: "👋 You’ve been logged out successfully." },
    });
    
  };

  const cancelLogout = () => setShowLogoutConfirm(false);

  return (
    <nav className="navbar">
      <Link to={token ? "/home-after-login" : "/"} tabIndex={0}>
        <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      </Link>
      {/* Search Bar */}
      <div className={`search-bar-container ${isSearchOpen ? 'open' : ''}`}>
        <input type="text" className="search-bar" placeholder="Search ..." />
      </div>

      {/* Desktop Menu */}
      <div className="nav-menu desktop-menu">
        <div className="nav-links">
          <NavLink to="/home-after-login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/local-languages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Local Languages</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Blog</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink>
        </div>

        {token && (
          <div className="user-profile" onClick={toggleDropdown}>
            <img src={profilePic} alt="User Profile" className="profile-pic" />
            <span className="user-name">{userName}</span>
            <i className="fas fa-chevron-down dropdown-icon"></i>
          </div>
        )}
      </div>

      {/* Mobile Buttons */}
      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </button>
        <button className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-menu mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          <NavLink to="/home-after-login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink>
          <NavLink to="/local-languages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Local Languages</NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Blog</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink>
        </div>

        {token && (
          <div className="user-profile" onClick={toggleDropdown}>
            <img src={profilePic} alt="User Profile" className="profile-pic" />
            <span className="user-name">{userName}</span>
            <i className="fas fa-chevron-down dropdown-icon"></i>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button className="close-dropdown" onClick={closeDropdown}>✖</button>
          <NavLink to="/edit-profile" className="dropdown-item">Edit Profile</NavLink>
          <NavLink to="/my-courses" className="dropdown-item">My Courses</NavLink>
          <NavLink to="/my-progress" className="dropdown-item">My Progress</NavLink>
          <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
          <button className="dropdown-item logout" onClick={handleLogoutClick}>Logout</button>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={confirmLogout} className="confirm-btn">Yes</button>
              <button onClick={cancelLogout} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
