import React, { useState, useEffect } from 'react';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';

const DonatePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [donationType, setDonationType] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const openModal = (type) => {
    setDonationType(type);
    setShowModal(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeModal = () => {
    setShowModal(false);
    setDonationType('');
    document.body.style.overflow = 'auto'; 
  };

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="policy-page">
        <div className="policy-header">
          <h1>Support Our Mission</h1>
          <p>Help us preserve and promote local languages in Cameroon and around the world</p>
        </div>

        <div className="policy-content">
          <section className="donate-section">
            <h2>Why Donate?</h2>
            <p>
              Every contribution directly supports our projects — from creating free
              learning tools to documenting endangered Cameroonian languages. 
              With your help, we can keep language heritage alive for future generations.
            </p>
          </section>

          <section className="donate-section">
            <h2>Ways to Give</h2>
            <div className="support-options">
              <div className="support-card">
                <h3>One-Time Donation</h3>
                <p>Choose any amount and make a one-time contribution to our work.</p>
                <button className="donate-btn" onClick={() => openModal('One-Time Donation')}>Donate Once</button>
              </div>

              <div className="support-card">
                <h3>Monthly Giving</h3>
                <p>Join our community of monthly donors and provide ongoing support.</p>
                <button className="donate-btn" onClick={() => openModal('Monthly Giving')}>Donate Monthly</button>
              </div>

              <div className="support-card">
                <h3>Sponsor a Project</h3>
                <p>Fund a specific project like language recording, workshops, or app development.</p>
                <button className="donate-btn" onClick={() => openModal('Sponsor a Project')}>Sponsor Now</button>
              </div>
            </div>
          </section>

          <section className="donate-section">
            <h2>Other Ways to Help</h2>
            <ul>
              <li>Donate equipment (recorders, laptops, cameras)</li>
              <li>Offer professional services (translation, design, legal)</li>
              <li>Share our mission with your friends & community</li>
            </ul>
          </section>

          <section className="donate-section">
            <h2>Secure Payment</h2>
            <p>
              All donations are processed securely. You’ll receive a confirmation
              and receipt via email or SMS after your contribution.
            </p>
          </section>
        </div>
      </div>

      {/* Donation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{donationType}</h2>
            <p>Choose one of the following methods to make your donation:</p>

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

            <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>
              After making your donation, please send proof of payment via 
              WhatsApp or email so we can confirm and send you a receipt.
            </p>
            
            <div style={{marginTop: '1.5rem'}}>
              <button className="donate-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DonatePage;