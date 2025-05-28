import React from 'react';
import '../../css/course_open.css';

const LessonsGrid = ({ lessons, onLessonClick, courseTitle }) => {
  return (
    <section className="courses-grid">
      <h2>{courseTitle || "This Course's"} Lessons</h2>
      <p className="courses-description">
        Explore the lessons for this course. Click on a lesson to start learning.
      </p>
      <div className="grid">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="course-card"
              onClick={() => onLessonClick(lesson)}
            >
              <div className="course-image">
                <img
                  src={lesson.thumbnail ? `http://192.168.57.12:8000/storage/${lesson.thumbnail}` : '/blog.jpg'}
                  alt={lesson.title}
                  className="thumbnail"
                />
                <span className="video-number">{lesson.title}</span>
              </div>
              <div className="course-details">
                <h3>{lesson.title}</h3>
                <p>{lesson.description || 'No description available.'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='alt'>No lessons available for this course.</p>
        )}
      </div>
    </section>
  );
};

export default LessonsGrid;