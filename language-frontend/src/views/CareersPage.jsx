import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import { FaHandshake, FaUsers, FaGlobe, FaBook, FaMicrophone } from 'react-icons/fa';

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
          <h1>Join Our Language Movement</h1>
          <p>Partner with us to preserve and revitalize indigenous languages worldwide</p>
        </div>

        <div className="policy-content">
          <section className="career-section">
            <h2>Community Partnership Opportunities</h2>
            <p>
              We collaborate with language activists, educators, and cultural practitioners to document
              and revitalize endangered languages through these partnership roles:
            </p>
            
            <div className="opportunity-cards">
              <div className="opportunity-card">
                <FaMicrophone className="opportunity-icon" />
                <h3>Language Documenters</h3>
                <p>Record and preserve your native language through audio, video, and written materials.</p>
                <Link to="/contact" className="apply-btn">Express Interest</Link>
              </div>
              
              <div className="opportunity-card">
                <FaUsers className="opportunity-icon" />
                <h3>Cultural Ambassadors</h3>
                <p>Help facilitate connections between learners and native speakers.</p>
                <Link to="/contact" className="apply-btn">Express Interest</Link>
              </div>
              
              <div className="opportunity-card">
                <FaBook className="opportunity-icon" />
                <h3>Language Mentors</h3>
                <p>Guide learners through cultural nuances and language subtleties.</p>
                <Link to="/contact" className="apply-btn">Express Interest</Link>
              </div>
            </div>
          </section>

          <section className="career-section">
            <h2>Sustain Our Work</h2>
            <p>
              Your partnership helps maintain our platform, develop new learning resources, 
              and support language communities:
            </p>
            
            <div className="support-options">
              <div className="support-card">
                <FaHandshake className="support-icon" />
                <h3>Sustaining Partnerships</h3>
                <p>Provide ongoing support through financial contributions:</p>
                <ul>
                  <li>Fund language documentation projects</li>
                  <li>Support free access for indigenous communities</li>
                  <li>Sponsor educational resource development</li>
                </ul>
                <Link to="/support" className="partner-btn">Become a Partner</Link>
              </div>
              
              <div className="support-card">
                <FaGlobe className="support-icon" />
                <h3>Resource Contributions</h3>
                <p>Contribute services or resources that advance our mission:</p>
                <ul>
                  <li>Technical expertise (development, design)</li>
                  <li>Equipment (recording devices, computers)</li>
                  <li>Professional services (translation, legal)</li>
                </ul>
                <Link to="/contact" className="contribute-btn">Offer Resources</Link>
              </div>
            </div>
          </section>

          <section className="career-section">
            <h2>Why Partner With Us?</h2>
            <div className="benefits">
              <div className="benefit-item">
                <h3>Cultural Impact</h3>
                <p>Help safeguard linguistic diversity and ancestral knowledge.</p>
              </div>
              <div className="benefit-item">
                <h3>Flexible Engagement</h3>
                <p>Contribute according to your capacity and availability.</p>
              </div>
              <div className="benefit-item">
                <h3>Mutual Growth</h3>
                <p>Gain experience while supporting language revitalization.</p>
              </div>
              <div className="benefit-item">
                <h3>Global Network</h3>
                <p>Connect with language activists worldwide.</p>
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
            
            {modalContent === 'Resource Contributions' ? (
              <>
                <p>We welcome these types of resource partnerships:</p>
                <ul>
                  <li>Technical expertise (development, design)</li>
                  <li>Equipment (recording devices, computers)</li>
                  <li>Professional services (translation, legal)</li>
                </ul>
                <p>Contact us to discuss how we can collaborate:</p>
                <div style={{marginTop: '1.5rem'}}>
                  <Link to="/contact" className="contribute-btn" onClick={closeModal}>Contact Us</Link>
                  <button className="partner-btn" onClick={closeModal} style={{marginLeft: '1rem'}}>Close</button>
                </div>
              </>
            ) : (
              <>
                <p>Thank you for your interest in {modalContent}. Please share your details and we'll follow up to discuss partnership opportunities.</p>
                <div style={{marginTop: '1.5rem'}}>
                  <Link to="/contact" className="contribute-btn" onClick={closeModal}>Contact Page</Link>
                  <button className="partner-btn" onClick={closeModal} style={{marginLeft: '1rem'}}>Close</button>
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