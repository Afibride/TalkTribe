import React from 'react';
import '../../css/course_open.css';

const CoursesGrid = () => {
  const videos = Array(12).fill(null); // Representing 12 videos or chapters

  return (
    <section className="courses-grid">
      <h2>Start Learning Now</h2>
      <p className="courses-description">
        Explore the chapters and videos for this course. Begin your journey to mastering the content step by step.
      </p>
      <div className="grid">
        {videos.map((_, index) => (
          <div key={index} className="course-card">
            <div className="course-image">
              <img
                src={`/blog.jpg`} // Example thumbnail path
                alt={`Thumbnail for Chapter ${index + 1}`}
                className="thumbnail"
              />
              <span className="video-number">Chapter {index + 1}</span>
            </div>
            <div className="course-details">
              <h3>Video {index + 1}</h3>
              <p>Click to start this chapter</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesGrid;