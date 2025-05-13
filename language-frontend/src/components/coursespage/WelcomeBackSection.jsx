import React from 'react';
import '../../css/Courses.css';

const WelcomeBackSection = () => {
    const lessons = [
        { title: 'Lamnso Language and Culture', progress: 'Lesson 5 of 7', image: '/blog.jpg' },
        { title: 'Lamnso Language and Culture', progress: 'Lesson 3 of 10', image: '/blog.jpg' },
        { title: 'Lamnso Language and Culture', progress: 'Lesson 8 of 12', image: '/blog.jpg' },
        { title: 'Lamnso Language and Culture', progress: 'Lesson 8 of 12', image: '/blog.jpg' },
      ];

  return (
    <section className="welcome-back">
      <div className="welcome-header">
        <h2>Welcome back, ready for your next lesson?</h2>
        <a href="/history" className="view-history">View History</a>
      </div>
      <div className="lessons">
        {lessons.map((lesson, index) => (
          <div key={index} className="lesson-card" data-aos="fade-up">
            <img src={lesson.image} alt={lesson.title} />
            <div className="lesson-details">
              <h3>{lesson.title}</h3>
              <p>{lesson.progress}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WelcomeBackSection;