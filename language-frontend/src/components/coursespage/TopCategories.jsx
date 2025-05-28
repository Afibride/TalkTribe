import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../css/Courses.css';

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

  return (
    <section className="top-categories">
      <h2>Choose Your Favourite Local Language</h2>
      <p className="categories-subtitle">
        Explore a variety of local languages and cultures to connect with your roots.
      </p>
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-card" data-aos="zoom-in">
            <img src={category.icon || '/default-category.jpg'} alt={category.name} className="category-icon" />
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopCategories;