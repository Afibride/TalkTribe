import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaHeart, FaUsers } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/SupportCTA.css'; 

const SupportCTA = ({ variant = 'primary' }) => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className={`support-cta ${variant}`} data-aos="fade-up">
      <div className="support-content">
        <div className="support-text">
          <FaHandshake className="support-icon" />
          <h3>Become a Language Guardian</h3>
          <p>
            Your partnership helps sustain these vital cultural preservation efforts:
          </p>
          <ul className="support-impact">
            <li><FaHeart /> Adopt a language documentation project</li>
            <li><FaUsers /> Sponsor community learning programs</li>
            <li>Fund digital archives of native speakers</li>
            <li>Support free educational resources</li>
          </ul>
        </div>
        <div className="support-action">
          <Link to="/support" className="support-button">
            Join the Movement
          </Link>
          <p className="support-note">
            All contributions are tax-deductible and directly fund preservation initiatives.
          </p>
          <div className="support-levels">
            <span>Community Sponsor</span>
            <span>Cultural Partner</span>
            <span>Heritage Guardian</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCTA;