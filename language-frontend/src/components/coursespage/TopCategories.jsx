import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Courses.css';
import api from '../../api/api';

const TopCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories'); 
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="top-categories">
      <h2>Top Categories</h2>
      <p className="categories-subtitle">
        Explore a variety of our Top Categories to connect with your roots.
      </p>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="category-card" 
            data-aos="zoom-in"
            onClick={() => scrollToCategory(category.id)}
            style={{ cursor: 'pointer' }}
          >
            <img src={category.icon || '/blog.jpg'} alt={category.name} className="category-icon" />
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;