import React from 'react';
import '../../css/course_open.css';

const LessonsGrid = ({ lessons, onLessonClick, courseTitle }) => {
  return (
    <section className="lessons-grid">
      <h2>{courseTitle || "This Course's"} Lessons</h2>
      <p className="lessons-description">
        Explore the lessons for this course. Click on a lesson to start learning.
      </p>
      <div className="lessons-container">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="lesson-card"
              onClick={() => onLessonClick(lesson)}
            >
              <div className="lesson-image">
                <img
                  src={lesson.thumbnail_url || '/blog.jpg'}
                  alt={lesson.title}
                  className="thumbnail"
                />
                <span className="lesson-title-overlay">{lesson.title}</span>
              </div>
              <div className="lesson-details">
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