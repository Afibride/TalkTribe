import React from 'react';
import '../../css/Courses.css';

const TopCategories = () => {
  const categories = [
    { name: 'Lamnso', icon: '/blog.jpg', description: 'Learn the Lamnso language and culture.' },
    { name: 'Oku', icon: '/blog.jpg', description: 'Explore the basics of the Oku language.' },
    { name: 'Bamileke', icon: '/blog.jpg', description: 'Master the Bamileke dialect and traditions.' },
    { name: 'Fulani', icon: '/blog.jpg', description: 'Discover the Fulani language and heritage.' },
    { name: 'Hausa', icon: '/blog.jpg', description: 'Learn the Hausa language and its rich culture.' },
    { name: 'Yoruba', icon: '/blog.jpg', description: 'Dive into the Yoruba language and customs.' },
  ];

  return (
    <section className="top-categories">
      <h2>Choose Your Favourite Local Language</h2>
      <p className="categories-subtitle">
        Explore a variety of local languages and cultures to connect with your roots.
      </p>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card" data-aos="zoom-in">
            <img src={category.icon} alt={category.name} className="category-icon" />
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;