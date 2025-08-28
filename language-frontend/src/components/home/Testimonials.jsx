import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import "../../css/HomeLogin.css";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newTestimonialText, setNewTestimonialText] = useState("");
  const [rating, setRating] = useState(5);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          await api.get("/api/user/me");
          setIsLoggedIn(true);
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
        const response = await api.get("/api/testimonials?limit=2");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError("Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    if (!newTestimonialText.trim()) {
      setError("Please enter your testimonial text");
      return;
    }

    try {
      setError(null);
      const response = await api.post("/api/testimonials", {
        text: newTestimonialText,
        rating: rating,
        reviews: "New review",
      });

      setTestimonials((prev) => [response.data, ...prev].slice(0, 2));
      setNewTestimonialText("");
      setRating(5);
      setSuccess("Thank you for your review!");
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error("Submission error:", error.response?.data);
      setError(error.response?.data?.message || "Failed to submit testimonial");
      setSuccess(null);
    }
  };

  if (loading) {
    return <div className="testimonials-loading">Loading testimonials...</div>;
  }

  return (
    <section className="testimonials-section">
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
      
      <div className="testimonial-layout">
        <div className="testimonial-header">
          <h2 className="testimonial-title">What They Say?</h2>
          <p className="testimonial-subtitle">
            TalkTribe has got more than 100 positive ratings from our users
            around the world.
          </p>
          <p className="testimonial-subtitle">
            Are you too? Please give your assessment.
          </p>

          {error && <p className="testimonial-error">{error}</p>}

          <form className="assessment-form" onSubmit={handleSubmitTestimonial}>
            <textarea
              placeholder="Write your assessment..."
              className="assessment-input"
              value={newTestimonialText}
              onChange={(e) => setNewTestimonialText(e.target.value)}
              rows="3"
              required
            />
            <div className="rating-selector" aria-label="Select rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= rating ? "selected" : ""}`}
                  onClick={() => setRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  tabIndex={0}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating} star{rating !== 1 ? 's' : ''}
            </div>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>

        <div className="testimonial-cards">
          {testimonials.length > 0
            ? testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id || index}
                  className="testimonial-card"
                  data-aos="zoom-in"
                >
                  <img
                    src={
                      testimonial.image_url ||
                      testimonial.image ||
                      "/profile.png"
                    }
                    alt={testimonial.name}
                    className="testimonial-img"
                    onError={(e) => {
                      e.target.src = "/profile.png";
                    }}
                  />
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <strong className="testimonial-name">
                    {testimonial.name}
                  </strong>
                  <p className="testimonial-rating">
                    {Array(testimonial.rating).fill("⭐").join(" ")}{" "}
                    {testimonial.reviews}
                  </p>
                </div>
              ))
            : !error && (
                <p className="no-testimonials">No testimonials to show</p>
              )}
        </div>
      </div>
      <Link to="/testimonials" className="show-more-btn">
        Show All Testimonials
      </Link>
    </section>
  );
};

export default TestimonialsSection;