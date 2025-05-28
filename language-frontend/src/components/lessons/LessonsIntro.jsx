import React from 'react';
import api from '../../api/api';
import '../../css/course_open.css';

const LessonsIntro = ({ course, onStartLearning }) => {
  const handleStartLearning = async () => {
    try {
      const currentLessonId = course.lessons[0]?.id; // Get the current lesson ID
      await api.post('/api/lesson-progress', {
        lesson_id: currentLessonId,
        progress_percent: 100,
      });
      alert('Progress started!');
      if (onStartLearning) onStartLearning();
    } catch (error) {
      console.error('Error starting course progress:', error);
    }
  };

  return (
    <section className="course-intro">
      <h1>{course?.title || 'Course Title Not Available'}</h1>
      <p className="intro-description">
        <strong>{course?.description || 'Course Description Not Available'}</strong>
      </p>
      <ul className="intro-highlights">
        <li>✔ Comprehensive Language Lessons</li>
        <li>✔ Cultural Insights and Traditions</li>
        <li>✔ Interactive Quizzes and Activities</li>
        <li>✔ Certificate of Completion</li>
      </ul>
      <button className="start-learning-btn" onClick={handleStartLearning}>
        Start Learning Now
      </button>
    </section>
  );
};

export default LessonsIntro;