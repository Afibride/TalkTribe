import React from 'react';
import NewNavbar from './Navbar1'; 
import HeroSection from './home/HeroSection';
import '../css/HomeLogin.css';


const Header = () => {
  return (
    <header>
      <NewNavbar /> 
      <HeroSection /> 
    </header>
  );
};

export default Header;