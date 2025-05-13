import React from 'react';
import '../../css/course_open.css';

const CourseIntro = () => {
  return (
    <section className="course-intro">
      <h1>Welcome to Lamnso Language and Culture</h1>
      <p className="intro-description">
        <strong>Master the Art of Communication!</strong> This course is designed to help you learn and embrace your local language with ease. Dive into interactive lessons, cultural insights, and practical exercises that will transform your linguistic skills.
      </p>
      <ul className="intro-highlights">
        <li>✔ Comprehensive Language Lessons</li>
        <li>✔ Cultural Insights and Traditions</li>
        <li>✔ Interactive Quizzes and Activities</li>
        <li>✔ Certificate of Completion</li>
      </ul>
      <button className="start-learning-btn">Start Learning Now</button>
    </section>
  );
};

export default CourseIntro;