import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/HomeLogin.css';
import api from "../api/api"; 

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('error');
      setTimeout(() => setSubscriptionStatus(null), 3000);
      return;
    }

    setIsSubscribing(true);
    
    try {

      const response = await api.post('/api/newsletter/subscribe', { email });
      
      if (response.data.success) {
        setSubscriptionStatus('success');
        setEmail(''); 
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionStatus(null), 5000);
    }
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
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-input">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubscribing}
              />
              <button type="submit" disabled={isSubscribing}>
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
          
          {/* Subscription Status Messages */}
          {subscriptionStatus === 'success' && (
            <div className="subscription-message success">
              Thank you for subscribing to our newsletter!
            </div>
          )}
          {subscriptionStatus === 'error' && (
            <div className="subscription-message error">
              Please enter a valid email address or try again later.
            </div>
          )}
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