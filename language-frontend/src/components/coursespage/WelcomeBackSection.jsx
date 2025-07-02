import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import '../../css/Courses.css';

const WelcomeBackSection = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/progress/user-courses');
        setProgressData(response.data);
      } catch (error) {
        toast.error('Failed to load progress data');
        console.error('Error fetching user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleContinueLearning = async (courseId, lessonId) => {
    try {
      // You can track this action if needed
      toast.info('Redirecting to your lesson...');
    } catch (error) {
      toast.error('Failed to navigate to lesson');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading your progress...</p>
      </div>
    );
  }

  return (
    <section className="welcome-back">
      <div className="welcome-header">
        <h2>Welcome back, ready for your next lesson?</h2>
        <a href="/history" className="view-history">View History</a>
      </div>
      
      <div className="lessons-grid">
        {progressData.length === 0 ? (
          <div className="empty-state">
            <p>You haven't started any courses yet.</p>
            <a href="/courses" className="browse-btn">Browse Courses</a>
          </div>
        ) : (
          progressData.map((course) => (
            <div key={course.course_id} className="course-card">
              <img 
                src={course.course_image || '/default-course.jpg'} 
                alt={course.course_title}
                className="course-thumbnail"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/default-course.jpg';
                }}
              />
              <div className="course-details">
                <h3>{course.course_title}</h3>
                
                <div className="progress-container">
                  <div className="progress-info">
                    <span>Progress: {course.progress_percent}%</span>
                    <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress_percent}%` }}
                    ></div>
                  </div>
                </div>

                <p className="last-activity">
                  {course.is_last_lesson_completed ? 'Completed: ' : 'Last Viewed: '}
                  {course.last_lesson_title}
                </p>

                <button
                  onClick={() => handleContinueLearning(course.course_id, course.last_lesson_id)}
                  className={`action-btn ${course.progress_percent === 100 ? 'completed' : ''}`}
                >
                  {course.progress_percent === 100 ? 'Review Course' : 'Continue Learning'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default WelcomeBackSection;