import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "../css/HomeLogin.css";
import "../css/NavbarSearch.css";
import api from "../api/api";

const NewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user?.username || "User";
  const profilePic = user?.profilePic || "/profile.png";

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => setIsSearchOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    closeDropdown();
    navigate("/", {
      state: { toastMessage: "👋 You’ve been logged out successfully." },
    });
  };
  const cancelLogout = () => setShowLogoutConfirm(false);

  const handleSearchInputChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        api
          .get(`/api/search?q=${encodeURIComponent(searchTerm)}`)
          .then((res) => {
            setSearchResults(res.data);
          })
          .catch((err) => {
            console.error(err);
            setSearchResults(null);
          });
      } else {
        setSearchResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleResultClick = (type, id) => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchResults(null);

    if (type === "lesson") navigate(`/lesson/${id}`);
    else if (type === "course") navigate(`/courses/${id}/lessons`);
    else if (type === "user") navigate(`/profile/${id}`);
    else if (type === "blog_post") navigate(`/blog/${id}`);
  };

  return (
    <nav className="navbar">
      <Link to={token ? "/home-after-login" : "/"} tabIndex={0}>
        <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      </Link>

      {/* Search Bar */}
      <div className={`search-bar-container ${isSearchOpen ? "open" : ""}`}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (searchTerm.trim() !== "") {
                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                setIsSearchOpen(false);
              }
            }
          }}
        />

        {searchResults && (
          <div className="search-results">
            {/* Courses */}
            {searchResults.courses?.length > 0 && (
              <div className="result-group">
                <h4>Courses</h4>
                {searchResults.courses.map((item) => (
                  <div
                    key={`course-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick("course", item.id)}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.description?.slice(0, 50)}...</p>
                  </div>
                ))}
              </div>
            )}

            {/* Lessons */}
            {searchResults.lessons?.length > 0 && (
              <div className="result-group">
                <h4>Lessons</h4>
                {searchResults.lessons.map((item) => (
                  <div
                    key={`lesson-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick("lesson", item.id)}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.description?.slice(0, 50)}...</p>
                  </div>
                ))}
              </div>
            )}

            {/* Users */}
            {searchResults.users?.length > 0 && (
              <div className="result-group">
                <h4>Users</h4>
                {searchResults.users.map((item) => (
                  <div
                    key={`user-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick("user", item.id)}
                  >
                    <strong>{item.name}</strong>
                    <p>{item.email}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Blog Posts */}
            {searchResults.blog_posts?.length > 0 && (
              <div className="result-group">
                <h4>Blog Posts</h4>
                {searchResults.blog_posts.map((item) => (
                  <div
                    key={`blog-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick("blog_post", item.id)}
                  >
                    <strong>{item.title}</strong>
                    <p>{item.excerpt?.slice(0, 50)}...</p>
                  </div>
                ))}
              </div>
            )}

            {/* Fallback */}
            {!searchResults.courses?.length &&
              !searchResults.lessons?.length &&
              !searchResults.users?.length &&
              !searchResults.blog_posts?.length && (
                <p>No results found.</p>
              )}
          </div>
        )}
      </div>

      {/* Desktop Nav */}
      <div className="nav-menu desktop-menu">
        <div className="nav-links">
          <NavLink
            to="/home-after-login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/local-languages"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Learn
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About Us
          </NavLink>
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
        <button
          className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? "X" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-menu mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="nav-links">
          <NavLink
            to="/home-after-login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/local-languages"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Learn
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About Us
          </NavLink>
        </div>
        {token && (
          <div className="user-profile" onClick={toggleDropdown}>
            <img src={profilePic} alt="User Profile" className="profile-pic" />
            <span className="user-name">{userName}</span>
            <i className="fas fa-chevron-down dropdown-icon"></i>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button className="close-dropdown" onClick={closeDropdown}>
            ✖
          </button>
          <NavLink to="/edit-profile" className="dropdown-item">
            Edit Profile
          </NavLink>
          <NavLink to="/my-courses" className="dropdown-item">
            My Courses
          </NavLink>
          <NavLink to="/my-progress" className="dropdown-item">
            My Progress
          </NavLink>
          <NavLink to="/settings" className="dropdown-item">
            Settings
          </NavLink>
          <button className="dropdown-item logout" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      )}

      {/* Logout Confirm */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>
            <div className="modal-actions">
              <button onClick={confirmLogout} className="confirm-btn">
                Yes
              </button>
              <button onClick={cancelLogout} className="cancel-btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NewNavbar;
