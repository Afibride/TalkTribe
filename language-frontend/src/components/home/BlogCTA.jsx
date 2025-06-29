import React from 'react';
import Slider from 'react-slick'; // Import React Slick
import '../../css/HomeLogin.css';
import 'slick-carousel/slick/slick.css'; // Slick CSS
import 'slick-carousel/slick/slick-theme.css'; // Slick Theme CSS
import { useNavigate } from 'react-router-dom';

const BlogCTASection = () => {
  const navigate = useNavigate();

  const images = [
    { src: '/blog1.jpg', alt: 'Cultural Dance' },
    { src: '/blog1.jpg', alt: 'Traditional Ceremony' },
    { src: '/blog1.jpg', alt: 'Local Art' },
    { src: '/blog1.jpg', alt: 'Community Gathering' },
  ];

  // Custom arrow components
  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow next-arrow" onClick={onClick}>
      &#9654; {/* Right arrow symbol */}
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev-arrow" onClick={onClick}>
      &#9664; {/* Left arrow symbol */}
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, // Custom next arrow
    prevArrow: <PrevArrow />, // Custom previous arrow
  };

  return (
    <section className="blog-cta-section" data-aos="fade-up">
      {/* Slideshow */}
      <div className="blog-slider-container">
        <Slider {...sliderSettings} className="blog-slider">
          {images.map((image, index) => (
            <div key={index} className="slider-image-container">
              <img src={image.src} alt={image.alt} className="slider-image" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Text and button below the slider */}
      <div className="blog-text-container">
        <h2 className="blog-title" data-aos="zoom-in">Explore Your Culture</h2>
        <p className="blog-subtext" data-aos="fade-right">
          Discover the beauty of your heritage through stories, traditions, and activities that connect you to your roots. 
          Learn how language and culture shape identity and community.
        </p>
        <button
          className="blog-btn"
          data-aos="fade-up"
          onClick={() => navigate('/blog')}
        >
          Visit the Blog
        </button>
      </div>
    </section>
  );
};

export default BlogCTASection;
