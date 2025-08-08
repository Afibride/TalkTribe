import React, { useState, useEffect } from 'react';
import '../css/PolicyPages.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
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
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="policy-content">
          <section>
            <h2>1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The types of information we collect include:
            </p>
            <ul>
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and other basic profile information.</li>
              <li><strong>Language Data:</strong> We collect the language content you contribute to help preserve and teach languages.</li>
              <li><strong>Usage Data:</strong> We collect information about how you interact with our services to improve user experience.</li>
              <li><strong>Device Information:</strong> We may collect device-specific information for compatibility and optimization purposes.</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Personalize content and learning experiences</li>
              <li>Communicate with you about updates and opportunities</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share information in these limited circumstances:
            </p>
            <ul>
              <li><strong>With Your Consent:</strong> We will share personal information with third parties when we have your consent.</li>
              <li><strong>For Legal Reasons:</strong> We may disclose information if required by law or to protect our rights.</li>
              <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data with researchers and partners.</li>
            </ul>
          </section>

          <section>
            <h2>4. Your Choices</h2>
            <p>You have choices regarding your information:</p>
            <ul>
              <li>You can review and update your account information at any time</li>
              <li>You can opt-out of non-essential communications</li>
              <li>You can request deletion of your account and associated data</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
            </p>
          </section>

          <section>
            <h2>6. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section>
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at afibright07@gmail.com.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;