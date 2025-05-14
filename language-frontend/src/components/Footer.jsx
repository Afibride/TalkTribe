import React from 'react';
import '../css/HomeLogin.css';

const Footer = () => {
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
        <a href="#careers">Careers</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms & Conditions</a>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TalkTribe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
