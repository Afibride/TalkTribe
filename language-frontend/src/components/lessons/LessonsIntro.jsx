import React from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import '../../css/course_open.css';

const LessonsIntro = ({ course, onStartLearning }) => {
  const handleStartLearning = async () => {
    try {
      if (!course?.lessons?.length) {
        toast.warning('This course has no lessons yet!');
        return;
      }

      const response = await api.post(`/api/progress/start-course/${course.id}`);
      
      toast.success(
        `Course started! ${response.data.course_progress.progress_percent}% completed`,
        { autoClose: 3000 }
      );

      if (onStartLearning) onStartLearning();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to start course',
        { autoClose: 5000 }
      );
      console.error('Error starting course:', error);
    }
  };

  return (
    <section className="course-intro">
      <h1>{course?.title || 'Course Title Not Available'}</h1>
      <p className="intro-description">
        <strong>{course?.description || 'Course Description Not Available'}</strong>
      </p>
      <ul className="intro-highlights">
        <li>✔ {course?.total_lessons || 0} Comprehensive Lessons</li>
        <li>✔ Cultural Insights and Traditions</li>
        <li>✔ Interactive Quizzes and Activities</li>
        <li>✔ Certificate of Completion</li>
      </ul>
      <button 
        className="start-learning-btn" 
        onClick={handleStartLearning}
        disabled={!course?.lessons?.length}
      >
        {course?.lessons?.length ? 'Start Learning Now' : 'Coming Soon'}
      </button>
    </section>
  );
};

export default LessonsIntro;