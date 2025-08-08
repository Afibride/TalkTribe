import React, { useState, useEffect } from 'react';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';

const TermsConditionsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <div className="policy-page">
        <div className="policy-header">
          <h1>Terms & Conditions</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="policy-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the TalkTribe platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section>
            <h2>3. User Contributions</h2>
            <p>
              Users may contribute language content, including text, audio, and video materials. By contributing content, you:
            </p>
            <ul>
              <li>Grant TalkTribe a non-exclusive, royalty-free license to use, reproduce, and distribute your contributions</li>
              <li>Affirm that you have the necessary rights to share the content</li>
              <li>Agree not to contribute harmful, offensive, or copyrighted material without permission</li>
            </ul>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>
              The TalkTribe platform and its original content, features, and functionality are owned by TalkTribe and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2>5. Prohibited Uses</h2>
            <p>You may use the service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Use the service in any way that violates any applicable law</li>
              <li>Exploit the service for any commercial purpose without express consent</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Upload or transmit viruses or any other malicious code</li>
              <li>Harass, abuse, or harm another person</li>
            </ul>
          </section>

          <section>
            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall TalkTribe, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages arising out of or in connection with your use of the service.
            </p>
          </section>

          <section>
            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at afibright07@gmail.com.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditionsPage;