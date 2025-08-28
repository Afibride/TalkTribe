import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../css/TestimonialsPage.css";
import Navbar from "../components/Navbar"; // Import regular Navbar
import NewNavbar from "../components/Navbar1"; // Import logged-in Navbar
import Footer from "../components/Footer";

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    text: "",
    rating: 5,
    reviews: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await api.get("/api/user/me");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/testimonials");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError("Failed to load testimonials. Please try again later.");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setNewTestimonial((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    if (!newTestimonial.text.trim()) {
      setError("Please enter your testimonial text");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await api.post("/api/testimonials", newTestimonial);
      
      setSuccess("Thank you for your testimonial! It has been submitted successfully.");
      
      setNewTestimonial({
        text: "",
        rating: 5,
        reviews: "",
      });
      setShowForm(false);
      
      // Refresh testimonials to include the new one
      const updatedResponse = await api.get("/api/testimonials");
      setTestimonials(updatedResponse.data);
      
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      setError(error.response?.data?.message || "Failed to submit testimonial");
      setSuccess(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        {isLoggedIn ? <NewNavbar /> : <Navbar />}
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading testimonials...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="testimonials-page">
        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span>✅ {success}</span>
          </div>
        )}
        
        {/* Login Modal */}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Login Required</h3>
              <p>Please log in to submit your review.</p>
              <div className="modal-actions">
                <button 
                  className="modal-btn secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
                <Link to="/login" className="modal-btn primary">
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="container">
          <h1 className="page-title">What Our Tribe Says 🗣️</h1>
          <p className="page-subtitle">
            We're building TalkTribe together — here's what people think so far.
          </p>

          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>

          {!showForm && (
            <div className="add-testimonial-cta">
              <h2>Got thoughts?</h2>
              <p>
                Tell us what you think about TalkTribe so far — your voice helps
                shape it!
              </p>
              <button
                className="open-form-btn"
                onClick={() => setShowForm(true)}
              >
                Add Your Review ✍️
              </button>
            </div>
          )}

          {showForm && (
            <div className="add-testimonial">
              <h2>Share Your Experience</h2>
              {error && <p className="form-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="text">Your Testimonial *</label>
                  <textarea
                    id="text"
                    name="text"
                    value={newTestimonial.text}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    placeholder="What's your honest take?"
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Rating *</label>
                  <div className="rating-selector" aria-label="Select rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= newTestimonial.rating ? "selected" : ""}`}
                        onClick={() => handleRatingChange(star)}
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        tabIndex={0}
                        disabled={submitting}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <div className="rating-text">
                    {newTestimonial.rating} star{newTestimonial.rating !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reviews">Reviews (optional)</label>
                  <input
                    type="text"
                    id="reviews"
                    name="reviews"
                    value={newTestimonial.reviews}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 reviews on Google"
                    disabled={submitting}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowForm(false);
                      setError(null);
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {error && !showForm && (
            <div className="error-message">
              {error}
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          <div className="testimonials-grid">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, index) => (
                <div key={testimonial.id || index} className="testimonial-card">
                  <img
                    src={
                      testimonial.image_url ||
                      testimonial.image ||
                      "/profile.png"
                    }
                    alt={testimonial.name || "User"}
                    className="testimonial-img"
                    onError={(e) => {
                      e.target.src = "/profile.png";
                    }}
                  />
                  <div className="testimonial-content">
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <strong className="testimonial-name">
                      {testimonial.name || "Anonymous"}
                    </strong>
                    <p className="testimonial-rating">
                      {Array(testimonial.rating).fill("⭐").join(" ")}
                      {testimonial.reviews && ` — ${testimonial.reviews}`}
                    </p>
                    <p className="testimonial-date">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              !error && (
                <p className="no-testimonials">
                  No testimonials available yet. Be the first to share your experience!
                </p>
              )
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TestimonialsPage;