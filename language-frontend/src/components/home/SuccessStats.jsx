import React from 'react';
import '../../css/HomeLogin.css';

const SuccessSection = () => {
  return (
    <section className="success">
      <h1 className="success-title">Our Success</h1>
      <p className="success-subtitle">
        We’ve helped thousands of learners grow their language skills and cultural understanding across Africa.
      </p>
      <div className="stats">
        <div className="stat-item">
          <h3>15K+</h3>
          <p>Students</p>
        </div>
        <div className="stat-item">
          <h3>75%</h3>
          <p>Total success</p>
        </div>
        <div className="stat-item">
          <h3>35</h3>
          <p>Main questions</p>
        </div>
        <div className="stat-item">
          <h3>26</h3>
          <p>Chief experts</p>
        </div>
        <div className="stat-item">
          <h3>16</h3>
          <p>Years of experience</p>
        </div>
      </div>
    </section>
  );
};

export default SuccessSection;
