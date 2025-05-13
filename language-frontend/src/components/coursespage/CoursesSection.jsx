import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/Courses.css';

const CoursesSection = ({ title }) => {
  const courses = [
    {
      title: 'Lamnso Language and Culture',
      duration: '6 Weeks',
      level: 'Intermediate',
      instructor: 'Fondzenyuy Nicolas',
      image: '/blog.jpg',
      description:
        'Explore the rich culture and language of the Lamnso people. This course covers basic vocabulary, grammar, and cultural practices, providing a comprehensive introduction to the Lamnso language.',
    },
    {
      title: 'Oku Language Basics',
      duration: '4 Weeks',
      level: 'Beginner',
      instructor: 'John Doe',
      image: '/blog.jpg',
      description:
        'Learn the basics of the Oku language, including common phrases, grammar, and cultural insights.',
    },
    {
      title: 'Bamileke Dialect Mastery',
      duration: '8 Weeks',
      level: 'Advanced',
      instructor: 'Marie Claire',
      image: '/blog.jpg',
      description:
        'Master the Bamileke dialect with advanced lessons on vocabulary, grammar, and cultural nuances.',
    },
    {
      title: 'Fulani Language Essentials',
      duration: '5 Weeks',
      level: 'Beginner',
      instructor: 'Ali Baba',
      image: '/blog.jpg',
      description:
        'Get started with the Fulani language by learning essential phrases, grammar, and cultural practices.',
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="language-courses-section">
      <div className="language-courses-header">
        <h2 className="language-courses-title">{title}</h2>
        <a href="/courses" className="show-more-link">Show More</a>
      </div>
      <div className="language-courses-container">
        {courses.map((course, index) => (
          <Link to="/coursepage" key={index} className="language-course-card" data-aos="fade-up">
            <img src={course.image} alt={course.title} className="language-course-image" />
            <div className="language-course-details">
              <span className="course-meta">
                {course.duration} | {course.level} | By {course.instructor}
              </span>
              <h3 className="language-course-name">{course.title}</h3>
              <p
                className="language-course-description"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation when clicking the description
                  toggleDescription(index);
                }}
                style={{ cursor: 'pointer' }}
              >
                {expandedIndex === index
                  ? course.description
                  : `${course.description.slice(0, 50)}...`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;