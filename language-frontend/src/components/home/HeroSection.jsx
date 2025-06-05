import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/HomeLogin.css';

const slides = [
  {
    image: '/hero.png',
    message: 'Studying Local Languages Online is now much easier',
    textColor: '#FFFFFF', // Color for the rest of the text
    firstWordColor: '#AB2526', // Color for the first word
  },
  {
    image: '/hero1.png',
    message: 'Explore the beauty of your native language',
    textColor: '#FFFFFF',
    firstWordColor: '#188B81',
  },
  {
    image: '/hero2.png',
    message: 'Join a community passionate about languages',
    textColor: '#FFFFFF',
    firstWordColor: '#F1A012',
    
  },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="hero"
      data-aos="fade-in" // AOS animation
      style={{
        backgroundImage: `url(${slides[currentIndex].image})`,
        transition: 'background-image 2.5s ease-in-out',
        height: '850px',
      }}
    >
      <div
        className="hero-content"
        style={{
          color: slides[currentIndex].textColor,
        }}
      >
        <h1>
          <span
            className="first-word"
            style={{
              color: slides[currentIndex].firstWordColor,
            }}
          >
            {slides[currentIndex].message.split(' ')[0]}
          </span>{' '}
          {slides[currentIndex].message.split(' ').slice(1).join(' ')}
        </h1>
        <p>
          Don’t let the exciting world of local languages pass you by. Learn yours online in an innovative way.
        </p>
        {!isLoggedIn && (
          <button className="join-btn" onClick={() => navigate('/register')}>
            Join TalkTribe
          </button>
        )}
      </div>
    </section>
  );
};

export default HeroSection;