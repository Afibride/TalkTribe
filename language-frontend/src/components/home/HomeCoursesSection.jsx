import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api'; // Make sure this points to your axios instance
import '../../css/HomeLogin.css';

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses?limit=12');
        setCourses(response.data.data || response.data); // Adjust if your API wraps in 'data'
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="courses-section" data-aos="fade-up">
      <h2 className="courses-title">Our Courses</h2>
      <p className="courses-subtitle">
        Learn your native tongue through engaging, interactive courses led by experienced native speakers and tech-aided formats.
      </p>
      <div className="course-grid">
        {courses.map((course, index) => (
          <div key={index} className="course-card" data-aos="zoom-in" data-aos-delay={`${index * 100}`}>
            <img src={course.image} alt={`${course.title} course`} className="course-image" />
            <div className="course-details">
              <span className="course-meta">
                {course.duration} | {course.level} | By {course.instructor}
              </span>
              <h3>{course.title}</h3>
              <p
                className="course-description"
                onClick={() => toggleDescription(index)}
                style={{ cursor: 'pointer' }}
              >
                {expandedIndex === index
                  ? course.description
                  : `${course.description.slice(0, 50)}...`}
              </p>
              <div className="course-actions">
                <Link to="/courses/:id/lessons" className="course-btn">
                  Start Now!
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button className="see-all-btn" data-aos="fade-up">
          View All
        </button>
      </div>
    </section>
  );
};

export default CoursesSection;