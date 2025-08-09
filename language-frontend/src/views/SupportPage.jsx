import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import { FaHandshake, FaUsers, FaLanguage, FaBook, FaGlobeAfrica } from 'react-icons/fa';

const SupportPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [supportType, setSupportType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const openModal = (type) => {
    setSupportType(type);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setShowModal(false);
    setSupportType('');
    document.body.style.overflow = 'auto'; 
  };

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="policy-page">
        <div className="policy-header">
          <h1>Become a Language Guardian</h1>
          <p>Partner with us to preserve and promote indigenous languages in Cameroon and beyond</p>
        </div>

        <div className="policy-content">
          <section className="donate-section">
            <h2>Why Support Us?</h2>
            <p>
              Your partnership directly enables our cultural preservation work - from creating free
              learning resources to documenting endangered languages. Together, we can keep linguistic
              heritage alive for future generations.
            </p>
          </section>

          <section className="donate-section">
            <h2>Ways to Partner</h2>
            <div className="support-options">
              <div className="support-card">
                <FaHandshake className="support-icon" />
                <h3>One-Time Contribution</h3>
                <p>Make a single contribution to support our ongoing initiatives.</p>
                <button className="donate-btn" onClick={() => openModal('One-Time Support')}>Support Now</button>
              </div>

              <div className="support-card">
                <FaUsers className="support-icon" />
                <h3>Sustaining Partnership</h3>
                <p>Join our community of monthly supporters for consistent impact.</p>
                <button className="donate-btn" onClick={() => openModal('Monthly Partnership')}>Partner Monthly</button>
              </div>

              <div className="support-card">
                <FaLanguage className="support-icon" />
                <h3>Project Sponsorship</h3>
                <p>Fund specific initiatives like language documentation or educational programs.</p>
                <button className="donate-btn" onClick={() => openModal('Project Sponsorship')}>Sponsor a Project</button>
              </div>
            </div>
          </section>

          <section className="donate-section">
            <h2>Other Partnership Opportunities</h2>
            <ul className="support-impact">
              <li><FaBook /> Provide equipment (recorders, laptops, cameras)</li>
              <li><FaGlobeAfrica /> Offer professional services (translation, design, legal)</li>
              <li>Introduce us to potential partners in your network</li>
            </ul>
          </section>

          <section className="donate-section">
            <h2>Secure Contribution Process</h2>
            <p>
              All contributions are processed securely. You'll receive confirmation
              and documentation for your records.
            </p>
          </section>
        </div>
      </div>

      {/* Support Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{supportType}</h2>
            <p>Choose one of the following methods to make your contribution:</p>

            <div className="donation-method">
              <h3>MTN Mobile Money</h3>
              <p>Number: <strong>+237 680 225 855</strong></p>
              <p>Name: Afi Sheron</p>
            </div>

            <div className="donation-method">
              <h3>Orange Money</h3>
              <p>Number: <strong>+237 69X XXX XXX</strong></p>
              <p>Name: TalkTribe Foundation</p>
            </div>

            <div className="donation-method">
              <h3>Bank Transfer</h3>
              <p>TalkTribe currently has no bank account</p>
              <p>Bank: xxxx</p>
              <p>Account Name: TalkTribe Foundation</p>
              <p>Account Number: xxx xxx xxxx</p>
              <p>SWIFT/BIC: AFRICMCX</p>
            </div>

            <p className="donation-note">
              After making your contribution, please send proof of payment via 
              WhatsApp or email so we can confirm and send you documentation.
            </p>
            
            <div className="modal-actions">
              <button className="donate-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default SupportPage;