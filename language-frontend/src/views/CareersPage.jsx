import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';

const CareersPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent('');
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="policy-page">
        <div className="policy-header">
          <h1>Join Our Team</h1>
          <p>Help us preserve and promote local languages around the world</p>
        </div>

        <div className="policy-content">
          <section className="career-section">
            <h2>Volunteer Opportunities</h2>
            <p>
              We're always looking for passionate individuals to volunteer their time and skills 
              to help document, teach, and preserve local languages. No matter where you are in 
              the world, you can contribute.
            </p>
            
            <div className="opportunity-cards">
              <div className="opportunity-card">
                <h3>Language Contributors</h3>
                <p>Help document and record your native language through audio, video, and written materials.</p>
                <Link to="/contact" className="apply-btn">Apply Now</Link>
              </div>
              
              <div className="opportunity-card">
                <h3>Community Moderators</h3>
                <p>Help manage our online communities and ensure positive interactions.</p>
                <Link to="/contact" className="apply-btn">Apply Now</Link>
              </div>
              
              <div className="opportunity-card">
                <h3>Translation Volunteers</h3>
                <p>Help translate learning materials and app interfaces into different languages.</p>
                <Link to="/contact" className="apply-btn">Apply Now</Link>
              </div>
            </div>
          </section>

          <section className="career-section">
            <h2>Support Our Mission</h2>
            <p>
              Your support helps us maintain our platform, develop new learning tools, 
              and reach more language communities worldwide.
            </p>
            
            <div className="support-options">
              <div className="support-card">
                <h3>Financial Contributions</h3>
                <p>Make a one-time or recurring donation to support our operations.</p>
                <ul>
                  <li>Help fund language documentation projects</li>
                  <li>Support free access for underserved communities</li>
                  <li>Sponsor new learning tool development</li>
                </ul>
                <Link to="/donate" className="donate-btn">Donate Now</Link>
              </div>
              
              <div className="support-card">
                <h3>In-Kind Support</h3>
                <p>Contribute services or resources that can help our mission.</p>
                <ul>
                  <li>Technical services (web development, design)</li>
                  <li>Equipment donations (recording devices, computers)</li>
                  <li>Professional services (legal, marketing)</li>
                </ul>
                <Link to="/contact" className="contact-btn">Offer Support</Link>
              </div>
            </div>
          </section>

          <section className="career-section">
            <h2>Why Join Us?</h2>
            <div className="benefits">
              <div className="benefit-item">
                <h3>Make an Impact</h3>
                <p>Help preserve linguistic diversity and cultural heritage.</p>
              </div>
              <div className="benefit-item">
                <h3>Flexible Commitment</h3>
                <p>Contribute as much or as little time as you can spare.</p>
              </div>
              <div className="benefit-item">
                <h3>Learn & Grow</h3>
                <p>Gain experience in language documentation and education.</p>
              </div>
              <div className="benefit-item">
                <h3>Global Community</h3>
                <p>Connect with language enthusiasts around the world.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{modalContent}</h2>
            
            {modalContent === 'In-Kind Support' ? (
              <>
                <p>We welcome the following types of in-kind support:</p>
                <ul>
                  <li>Technical services (web development, design)</li>
                  <li>Equipment donations (recording devices, computers)</li>
                  <li>Professional services (legal, marketing)</li>
                </ul>
                <p>Please contact us with details about what you'd like to contribute:</p>
                <div style={{marginTop: '1.5rem'}}>
                  <Link to="/contact" className="contact-btn" onClick={closeModal}>Contact Us</Link>
                  <button className="donate-btn" onClick={closeModal} style={{marginLeft: '1rem'}}>Close</button>
                </div>
              </>
            ) : (
              <>
                <p>Thank you for your interest in {modalContent}. Please send us your details via our contact page or email, and we'll get back to you.</p>
                <div style={{marginTop: '1.5rem'}}>
                  <Link to="/contact" className="contact-btn" onClick={closeModal}>Go to Contact Page</Link>
                  <button className="donate-btn" onClick={closeModal} style={{marginLeft: '1rem'}}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CareersPage;