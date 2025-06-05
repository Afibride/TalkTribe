import React from 'react';
import { Link } from 'react-router-dom'; 
import '../../css/Courses.css';

const StudentsViewing = ({ courses }) => {
  const courseList = Array.isArray(courses) ? courses : [];

  return (
    <section className="students-viewing">
      <div className="students-viewing-header">
        <h2>Students are Viewing</h2>
        <a href="/see-all" className="view-all">See All</a>
      </div>
      <div className="students-viewing-courses">
        {courseList.length === 0 ? (
          <p>No popular courses yet!</p>
        ) : (
          courseList.map((course, index) => (
            <Link
              to={`/courses/${course.id}/lessons`} // Navigate to the course lessons page
              key={index}
              className="students-viewing-card reduced-size" // Add a class for reduced size
              data-aos="fade-up"
            >
              <img
                src={course.image_url || '/blog.jpg'}
                alt={course.title}
                className="students-viewing-image"
              />
              <div className="students-viewing-details">
                <p className="students-viewing-info">
                  {course.duration || 'Duration N/A'} | {course.level || 'Beginner'} <br />
                  Instructor: {course.instructor?.name || 'Unknown'}
                </p>
                <h3 className="students-viewing-title">{course.title}</h3>
                <p className="students-viewing-description">
                  {course.description ? course.description.slice(0, 50) + '...' : 'No description available.'}
                </p>
                <p className="students-viewing-clicks">
                  👁 {course.clicks} views
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default StudentsViewing;
