import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import NewNavbar from "../components/Navbar1";
import Footer from "../components/Footer";
import "../css/SettingsPage.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    language: "english",
    theme: "light",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save settings to your backend
    toast.success("Settings saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>
        <p>
          <span>Note</span> <br /> settings not yet functional. Coming soon
        </p>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-section">
            <h2 className="settings-section-title">Notification Preferences</h2>

            <div className="settings-checkbox-group">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="settings-checkbox"
              />
              <label
                htmlFor="notifications"
                className="settings-checkbox-label"
              >
                Enable notifications
              </label>
            </div>

            <div className="settings-checkbox-group">
              <input
                type="checkbox"
                id="emailUpdates"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleChange}
                className="settings-checkbox"
              />
              <label htmlFor="emailUpdates" className="settings-checkbox-label">
                Email updates
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">Language & Region</h2>

            <div className="settings-input-group">
              <label htmlFor="language" className="settings-label">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="english">English</option>
                <option value="french">French</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="settings-section-title">Appearance</h2>

            <div className="settings-input-group">
              <label htmlFor="theme" className="settings-label">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="settings-select"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          <div className="settings-buttons">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="settings-button settings-button-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="settings-button settings-button-save"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default SettingsPage;
