import React from 'react';
import Navbar from './Navbar'; 
import HeroSection from './home/HeroSection';
import '../css/HomeLogin.css';


const Header = () => {
  return (
    <header>
      <Navbar /> 
      <div className="scrolling-motto">
        <p>
          🌍 TalkTribe — Reviving Local Languages | Celebrating Culture | Empowering Identity 💬
        </p>
      </div>
      <HeroSection /> 
    </header>
  );
};

export default Header;