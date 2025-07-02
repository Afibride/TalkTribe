import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import '../../css/course_open.css';

const LessonsIntro = ({ course, onStartLearning, refreshProgress }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [progressData, setProgressData] = useState(null);

  // Fetch initial progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (course?.id) {
          const response = await api.get(`/api/progress/course/${course.id}`);
          setProgressData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };
    
    fetchProgress();
  }, [course?.id, refreshProgress]);

  const handleStartLearning = async () => {
    if (!course?.lessons?.length || isStarting) return;
    
    setIsStarting(true);
    
    try {
      const response = await api.post(`/api/progress/start-course/${course.id}`);
      
      toast.success(
        `Course started! ${response.data.course_progress.progress_percent}% completed`,
        { autoClose: 3000 }
      );

      // Update local progress data
      setProgressData(response.data.course_progress);
      
      if (onStartLearning) onStartLearning();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to start course';
      toast.error(errorMessage, { autoClose: 5000 });
      console.error('Error starting course:', error);
    } finally {
      setIsStarting(false);
    }
  };

  // Calculate progress percentage
  const progressPercent = progressData?.progress_percent || 0;
  const hasStarted = progressPercent > 0;
  const lessonsAvailable = course?.lessons?.length > 0;

  return (
    <section className="course-intro">
      <div className="course-header">
        <h1>{course?.title || 'Course Title Not Available'}</h1>
        {hasStarted && (
          <div className="progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
        )}
      </div>
      
      <p className="intro-description">
        <strong>{course?.description || 'Course Description Not Available'}</strong>
      </p>
      
      <ul className="intro-highlights">
        <li>✔ {course?.lessons?.length || 0} Comprehensive Lessons</li>
        <li>✔ {course?.duration || 'N/A'} Hours of Content</li>
        <li>✔ Interactive Quizzes and Activities</li>
        <li>✔ Certificate of Completion</li>
      </ul>
      
      <div className="course-actions">
        <button 
          className={`start-learning-btn ${hasStarted ? 'continue' : ''}`}
          onClick={handleStartLearning}
          disabled={!lessonsAvailable || isStarting}
        >
          {isStarting ? 'Starting...' : 
           hasStarted ? 'Continue Learning' : 
           lessonsAvailable ? 'Start Learning Now' : 'Coming Soon'}
        </button>
        
        {hasStarted && (
          <div className="progress-details">
            <span>
              {progressData?.completed_lessons || 0} of {progressData?.total_lessons || 0} lessons completed
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default LessonsIntro;