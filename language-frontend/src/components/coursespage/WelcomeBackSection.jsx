import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../css/Courses.css';

const WelcomeBackSection = () => {
  const [progressData, setProgressData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // <-- add refreshKey state

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/api/user-course-progress');
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchProgress();
  }, [refreshKey]); // <-- add refreshKey as dependency

  return (
    <section className="welcome-back">
      <div className="welcome-header">
        <h2>Welcome back, ready for your next lesson?</h2>
        <a href="/history" className="view-history">View History</a>
      </div>
      <div className="lessons">
        {progressData.length === 0 ? (
          <p>No progress yet. Start learning a course!</p>
        ) : (
          progressData.map((progress) => (
            <div key={progress.course_id} className="lesson-card" data-aos="fade-up">
              <img src={progress.course_image || '/blog.jpg'} alt={progress.course_title} />
              <div className="lesson-details">
                <h3>{progress.course_title}</h3>
                <p>Last Lesson: {progress.last_lesson_title}</p>
                <p>Progress: {progress.progress_percent}%</p>
                <a
                  href={`/courses/${progress.course_id}/lessons?lesson=${progress.lesson_id}`}
                  className="continue-btn"
                >
                  Continue Learning
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default WelcomeBackSection;