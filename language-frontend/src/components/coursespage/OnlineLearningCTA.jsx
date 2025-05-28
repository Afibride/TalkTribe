import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../../css/Courses.css';

const OnlineLearningCTA = () => {
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRandomCourse = async () => {
      try {
        const response = await api.get('/api/random-courses'); // Should return an array
        if (response.data && response.data.length > 0) {
          // Pick a random course from the array
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setCourse(response.data[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching random courses:', error);
      }
    };
    fetchRandomCourse();
  }, []);

  const handleStartLearning = () => {
    if (course) {
      navigate(`/courses/${course.id}/lessons`);
    }
  };

  return (
    <section className="online-learning-cta" data-aos="fade-right">
      <h2>
        {course
          ? `Start Learning ${course.title} Online`
          : 'Online Lamnso Lessons for Remote Learning'}
      </h2>
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
      <button className="cta-button" onClick={handleStartLearning} disabled={!course}>
        Start Learning Now
      </button>
    </section>
  );
};

export default OnlineLearningCTA;