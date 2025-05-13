import React from 'react';
import '../../css/Courses.css';

const OnlineLearningCTA = () => {
  return (
    <section className="online-learning-cta" data-aos="fade-right">
      <h2>Online Lamnso Lessons for Remote Learning</h2>
      <p>
        Discover the beauty of your local language and culture from the comfort of your home. 
        Our interactive lessons are designed to make learning engaging and effective.
      </p>
      <ul className="cta-benefits">
        <li>✔ Interactive video lessons</li>
        <li>✔ Learn at your own pace</li>
        <li>✔ Affordable pricing</li>
        <li>✔ Expert instructors</li>
      </ul>
      <button className="cta-button">Start Learning Now</button>
    </section>
  );
};

export default OnlineLearningCTA;