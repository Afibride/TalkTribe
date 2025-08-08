import React from 'react';
import { Link } from 'react-router-dom';
import '../css/DonationCTA.css'; 

const DonationCTA = ({ variant = 'primary' }) => {
  return (
    <div className={`donation-cta ${variant}`}>
      <h3>Support Our Mission</h3>
      <p>Your contribution helps preserve endangered languages and cultures</p>
      <Link to="/donate" className="donate-button">
        Donate Now
      </Link>
    </div>
  );
};

export default DonationCTA;