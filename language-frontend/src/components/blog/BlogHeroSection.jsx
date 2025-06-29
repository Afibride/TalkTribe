import React from 'react';
import '../../css/Blog.css';

const BlogHeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Discover the Power of Local Languages</h1>
        <p>
          Explore the beauty of your native tongue and its cultural significance. 
          Join us in preserving the heritage of local languages through engaging blogs and resources.
        </p>
        <button className="explore-btn">Explore Blogs</button>
      </div>
      <img
        src="/blog.jpg"
        alt="Team collaborating with sticky notes"
        className="hero-image"
      />
    </section>
  );
};

export default BlogHeroSection;