import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/HomeLogin.css';

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section className="about" data-aos="fade-up">
      <div className="about-container">
        <h2 className="section-title" data-aos="zoom-in">
          What is <span>TalkTribe?</span>
        </h2>
        <div className="about-content">
          <img
            src="/asset.png"
            alt="TalkTribe culture"
            className="about-image"
            data-aos="fade-right"
          />
          <div className="about-text" data-aos="fade-left">
            <p>
              <strong>TalkTribe</strong> is a digital local language learning and discovery platform that connects learners with <strong>language experts</strong> and native instructors.
              We offer a culturally rich and immersive learning experience designed to help you understand your <strong>heritage</strong>, traditions, and mother tongue.
            </p>
            <p>
              Through <strong>interactive courses</strong>, a vibrant <strong>blog</strong>, and more, you’ll gain more than just language proficiency—you’ll gain a sense of <strong>identity</strong> and belonging.
            </p>
            <button
              className="learn-more-btn"
              data-aos="fade-up"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
