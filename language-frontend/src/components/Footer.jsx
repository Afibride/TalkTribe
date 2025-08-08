import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomeLogin.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-container">
          <img src="/logo.png" alt="TalkTribe Logo" className="footer-logo" />
          <div className="footer-divider" />
          <h2 className="footer-title">Local Language <br /> Learning</h2>
        </div>

        <div className="newsletter">
          <p className="newsletter-text">Subscribe to get our Newsletter</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-links">
        <Link to="/careers" onClick={scrollToTop}>Careers</Link>
        <Link to="/privacy-policy" onClick={scrollToTop}>Privacy Policy</Link>
        <Link to="/terms-conditions" onClick={scrollToTop}>Terms & Conditions</Link>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TalkTribe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;