import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import "../css/HomeLogin.css";
import "../css/NavbarSearch.css";
import api from "../api/api";
import SubNavbar from "./SubNavbar";

const NewNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user?.username || "User";
  const profilePic = user?.profile_pic_url || "/profile.png";

  useEffect(() => {
    if (token) {
      api
        .get("/api/notifications/count")
        .then((res) => setNotificationCount(res.data.count))
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [token]);

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
      state: { toastMessage: "👋 You've been logged out successfully." },
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

    if (type === "lesson") navigate(`/courses/${id}/lesson/${id}`);
    else if (type === "course") navigate(`/courses/${id}/lessons`);
    else if (type === "user") navigate(`/profile/${id}`);
    else if (type === "blog_post") navigate(`/blog/${id}`);
  };

  return (
    <nav className="navbar">
      <Link to={token ? "/home-after-login" : "/"} tabIndex={0}>
        <img src="/logo.png" alt="TalkTribe Logo" className="logo" />
      </Link>

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

            {searchResults.users?.length > 0 && (
              <div className="result-group">
                <h4>Users</h4>
                {searchResults.users.map((item) => (
                  <div
                    key={`user-${item.id}`}
                    className="search-result-item"
                    onClick={() => handleResultClick("user", item.username)}
                  >
                    <img
                      src={item.profile_pic_url || "/profil.png"}
                      alt={item.name}
                      className="user-avatar"
                      onError={(e) => {
                        e.target.src = "/profile.png";
                        e.target.onerror = null;
                      }}
                    />
                    <strong>{item.name}</strong>
                    <p>@{item.username}</p>
                  </div>
                ))}
              </div>
            )}

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

            {!searchResults.courses?.length &&
              !searchResults.lessons?.length &&
              !searchResults.users?.length &&
              !searchResults.blog_posts?.length && <p>No results found.</p>}
          </div>
        )}
      </div>

      <div className="nav-menu desktop-menu">
        <div className="nav-links">
          <NavLink
            to="/home-after-login"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="fas fa-home"></i> Home
          </NavLink>
          <NavLink
            to="/local-languages"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="fas fa-book-open"></i> Learn
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="fas fa-newspaper"></i> Blog
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="fas fa-info-circle"></i> About Us
          </NavLink>

          {token && (
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `notification-desktop ${isActive ? "active" : ""}`
              }
            >
              <div className="notification-icon">
                <i className="fas fa-bell"></i>
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                )}
              </div>
            </NavLink>
          )}
        </div>

        {token && (
          <div className="user-profile" onClick={toggleDropdown}>
            <img
              src={profilePic}
              alt="User Profile"
              className="nav-profile-pic"
            />
            <span className="user-name">{userName}</span>
            <i className="fas fa-chevron-down dropdown-icon"></i>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button className="search-icon" onClick={toggleSearch}>
          <i className="fas fa-search"></i>
        </button>

        {token && (
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `mobile-notification-link ${isActive ? "active" : ""}`
            }
          >
            <div className="notification-icon">
              <i className="fas fa-bell"></i>
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
          </NavLink>
        )}

        <button
          className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-links">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "mobile-nav-link active" : "mobile-nav-link"
            }
            onClick={toggleMenu}
          >
            <i className="fas fa-cog"></i> Settings
          </NavLink>
          <button
            className="mobile-nav-link logout"
            onClick={handleLogoutClick}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <button className="close-dropdown" onClick={closeDropdown}>
            ✖
          </button>
          <NavLink
            to={`/profile/${userName}`}
            className="dropdown-item"
            onClick={closeDropdown}
          >
            <i className="fas fa-user-circle"></i> My Profile
          </NavLink>
          <NavLink to="/my-courses" className="dropdown-item">
            <i className="fas fa-book"></i> My Courses
          </NavLink>
          <NavLink to="/my-progress" className="dropdown-item">
            <i className="fas fa-chart-line"></i> My Progress
          </NavLink>
          <NavLink to="/settings" className="dropdown-item">
            <i className="fas fa-cog"></i> Settings
          </NavLink>
          <button className="dropdown-item logout" onClick={handleLogoutClick}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      )}

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
      <SubNavbar />
    </nav>
  );
};

export default NewNavbar;
