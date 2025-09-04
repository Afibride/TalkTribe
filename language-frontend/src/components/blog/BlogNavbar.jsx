import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "../../css/BlogNavbar.css";
import api from "../../api/api";

const BlogNavbar = () => {
  const [communities, setCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communitiesLoading, setCommunitiesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blog-home");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get("/api/communities/user");
        setCommunities(response.data);
      } catch (error) {
        console.error("Error fetching user communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    // Set active tab based on current route
    if (location.pathname === '/news') {
      setActiveTab('news');
    } else if (location.pathname === '/blog' || location.pathname === '/') {
      setActiveTab('blog-home');
    } else if (location.pathname.startsWith('/community/')) {
      const communityId = location.pathname.split('/')[2];
      setActiveTab(`community-${communityId}`);
    }
  }, [location.pathname]);

  const fetchAllCommunities = async (search = "") => {
    setCommunitiesLoading(true);
    try {
      const response = await api.get(`/api/communities?search=${search}`);
      setAllCommunities(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching all communities:", error);
    } finally {
      setCommunitiesLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDropdown(false);
    
    if (tab === "news") {
      navigate("/news");
    } else if (tab === "blog-home") {
      navigate("/blog");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleCommunityJoin = async (communityId) => {
    try {
      await api.post(`/api/communities/${communityId}/join`);
      // Refresh communities list
      const response = await api.get("/api/communities/user");
      setCommunities(response.data);
      setShowPopup(false);
    } catch (error) {
      console.error("Error joining community:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    fetchAllCommunities(e.target.value);
  };

  return (
    <div className="blog-navbar">
      <div className="blog-navbar-tabs">
        <button
          className={`blog-navbar-tab ${
            activeTab === "blog-home" ? "active" : ""
          }`}
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
            className={`blog-navbar-tab ${
              activeTab.startsWith("community-") ? "active" : ""
            }`}
            onClick={toggleDropdown}
            onBlur={closeDropdown}
          >
            <i className="fas fa-users"></i> Communities
          </button>

          <div
            className={`communities-dropdown-content ${
              showDropdown ? "active" : ""
            }`}
          >
            {loading ? (
              <div className="loading-communities">Loading communities...</div>
            ) : communities.length > 0 ? (
              <>
                <div className="dropdown-header">Your Communities</div>
                {communities.map((community) => (
                  <button
                    key={community.id}
                    className={`community-item ${
                      activeTab === `community-${community.id}` ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(`community-${community.id}`);
                      navigate(`/community/${community.id}`);
                    }}
                  >
                    <img
                      src={community.image || "/community-default.png"}
                      alt={community.name}
                      className="community-avatar"
                    />
                    <span className="community-name">{community.name}</span>
                  </button>
                ))}
                <div className="dropdown-divider"></div>
                <button
                  className="community-item browse-all"
                  onClick={() => {
                    setShowPopup(true);
                    fetchAllCommunities();
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
                    fetchAllCommunities();
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
        <div className="communities-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="communities-popup" onClick={(e) => e.stopPropagation()}>
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
              
              <div className="popup-search">
                <input
                  type="text"
                  placeholder="Search communities..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="fas fa-search"></i>
              </div>

              <div className="popup-communities-list">
                {communitiesLoading ? (
                  <div className="loading-popup">Loading communities...</div>
                ) : allCommunities.length > 0 ? (
                  allCommunities.map((community) => {
                    const isMember = communities.some(c => c.id === community.id);
                    return (
                      <div key={community.id} className="popup-community-item">
                        <img
                          src={community.image || "/community-default.png"}
                          alt={community.name}
                          className="popup-community-avatar"
                        />
                        <div className="popup-community-info">
                          <h4>{community.name}</h4>
                          <p>{community.description}</p>
                          <span className="member-count">
                            {community.members_count || 0} members
                          </span>
                        </div>
                        <button
                          className={`join-btn ${isMember ? 'joined' : ''}`}
                          onClick={() => !isMember && handleCommunityJoin(community.id)}
                          disabled={isMember}
                        >
                          {isMember ? 'Joined' : 'Join'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-communities-found">
                    No communities found matching your search.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogNavbar;