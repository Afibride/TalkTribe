import React from 'react';
import Navbar from './Navbar'; 
import HeroSection from './home/HeroSection';
import '../css/HomeLogin.css';


const Header = () => {
  return (
    <header>
      <Navbar /> 
      <HeroSection /> 
    </header>
  );
};

export default Header;