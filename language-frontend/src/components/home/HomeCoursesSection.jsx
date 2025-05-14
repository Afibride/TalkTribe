import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/HomeLogin.css';

const CoursesSection = () => {
  const courses = [
    {
      title: "Lamnso Language and Culture",
      duration: "6 Weeks",
      level: "Intermediate",
      instructor: "Fondzenyuy Nicolas",
      image: "/blog.jpg",
      description:
        "Explore the rich culture and language of the Lamnso people. This course covers basic vocabulary, grammar, and cultural practices, providing a comprehensive introduction to the Lamnso language.",
    },
    {
      title: "Oku Language Basics",
      duration: "4 Weeks",
      level: "Beginner",
      instructor: "John Doe",
      image: "/blog.jpg",
      description:
        "Learn the basics of the Oku language, including common phrases, grammar, and cultural insights.",
    },
    {
      title: "Bamileke Dialect Mastery",
      duration: "8 Weeks",
      level: "Advanced",
      instructor: "Marie Claire",
      image: "/blog.jpg",
      description:
        "Master the Bamileke dialect with advanced lessons on vocabulary, grammar, and cultural nuances.",
    },
    {
      title: "Fulani Language Essentials",
      duration: "5 Weeks",
      level: "Beginner",
      instructor: "Ali Baba",
      image: "/blog.jpg",
      description:
        "Get started with the Fulani language by learning essential phrases, grammar, and cultural practices.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

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
                <Link to="/coursepage" className="course-btn">
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