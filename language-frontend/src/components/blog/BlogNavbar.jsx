import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/BlogNavbar.css";
import api from "../../api/api";

const BlogNavbar = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("blog-home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get("/api/communities/user");
        setCommunities(response.data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <div className="blog-navbar">
      <div className="blog-navbar-tabs">
        <button
          className={`blog-navbar-tab ${activeTab === "blog-home" ? "active" : ""}`}
          onClick={() => handleTabChange("blog-home")}
        >
          <i className="fas fa-home"></i> Blog Home
        </button>
        
        <button
          className={`blog-navbar-tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => handleTabChange("news")}
        >
          <i className="fas fa-newspaper"></i> News
        </button>
        
        <div className="communities-dropdown">
          <button
            className={`blog-navbar-tab ${activeTab.startsWith("community-") ? "active" : ""}`}
            onClick={toggleDropdown}
            onBlur={() => setTimeout(closeDropdown, 200)}
          >
            <i className="fas fa-users"></i> Communities
          </button>
          
          <div className={`communities-dropdown-content ${showDropdown ? "active" : ""}`}>
            {loading ? (
              <div className="loading-communities">Loading communities...</div>
            ) : communities.length > 0 ? (
              <>
                {communities.map(community => (
                  <button
                    key={community.id}
                    className={`community-item ${activeTab === `community-${community.id}` ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(`community-${community.id}`);
                      navigate(`/community/${community.id}`);
                      closeDropdown();
                    }}
                  >
                    <img 
                      src={community.image || "/community-default.png"} 
                      alt={community.name}
                      className="community-avatar"
                    />
                    {community.name}
                  </button>
                ))}
                <button 
                  className="community-item"
                  onClick={() => {
                    setShowPopup(true);
                    closeDropdown();
                  }}
                >
                  <i className="fas fa-search"></i> Browse All Communities
                </button>
              </>
            ) : (
              <div className="no-communities">
                <p>You're not in any communities yet</p>
                <button 
                  className="join-community-btn"
                  onClick={() => {
                    setShowPopup(true);
                    closeDropdown();
                  }}
                >
                  Browse Communities
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Communities Popup */}
      {showPopup && (
        <div className="communities-popup">
          <div className="communities-popup-content">
            <div className="popup-header">
              <h3 className="popup-title">Browse Communities</h3>
              <button 
                className="close-popup" 
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
            </div>
            {/* Add your community browsing content here */}
            <p>Community browsing content will go here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogNavbar;