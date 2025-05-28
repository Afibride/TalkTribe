import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Courses.css';

const CoursesSection = ({ title, courses }) => {
  const [expandedCourseId, setExpandedCourseId] = useState(null); // State to track which course's description is expanded

  const toggleDescription = (courseId) => {
    setExpandedCourseId((prevId) => (prevId === courseId ? null : courseId)); // Toggle the expanded state
  };

  return (
    <section className="language-courses-section">
      <div className="language-courses-header">
        <h2 className="language-courses-title">{title}</h2>
        <a href="/courses" className="show-more-link">Show More</a>
      </div>
      <div className="language-courses-container">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <Link to={`/courses/${course.id}/lessons`} key={index} className="language-course-card" data-aos="fade-up">
              <img
                src={course.image ? `http://192.168.57.12:8000/storage/${course.image}` : '/blog.jpg'}
                alt={course.title}
                className="language-course-image"
              />
              <div className="language-course-details">
                <span className="course-meta">
                  {course.duration || 'N/A'} | {course.level || 'N/A'} | By {course.instructor?.name || 'Unknown'}
                </span>
                <h3 className="language-course-name">{course.title}</h3>
                <p className="language-course-description">
                  {course.description.slice(0, 50)}...
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-courses-message">No courses available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;