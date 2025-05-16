import React from 'react';
import NewNavbar from './Navbar1';
import HeroSection from './home/HeroSection';
import '../css/HomeLogin.css';

const Header = ({ welcomeMessage, showBanner }) => {
  return (
    <header>
      <NewNavbar />
      
      <div className="scrolling-motto">
        <p>
          🌍 TalkTribe — Reviving Local Languages | Celebrating Culture | Empowering Identity 💬
        </p>
      </div>

      {showBanner && welcomeMessage && (
        <div className="welcome-banner show">
          {welcomeMessage}
        </div>
      )}

      <HeroSection />
    </header>
  );
};

export default Header;
