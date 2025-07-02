import React from 'react';
import NewNavbar from './Navbar1';
import HeroSection from './home/HeroSection';
import '../css/HomeLogin.css';

const Header = ({ welcomeMessage, showBanner }) => {
  // Ensure welcomeMessage is a string before rendering
  const displayMessage = typeof welcomeMessage === 'string' 
    ? welcomeMessage 
    : 'Welcome!';

  return (
    <header>
      <NewNavbar />
      
      <div className="scrolling-motto">
        <p>
          🌍 TalkTribe — Reviving Local Languages | Celebrating Culture | Empowering Identity 💬
        </p>
      </div>

      {showBanner && (
        <div className="welcome-banner show">
          {displayMessage}
        </div>
      )}

      <HeroSection />
    </header>
  );
};

export default Header;