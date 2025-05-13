import React from 'react';
import '../../css/course_open.css';

const VideoSection = () => {
  return (
    <section className="video-section" data-aos="fade-up">
      <div className="video-container">
        <img src="/blog.jpg" alt="Course Video" className="video-thumbnail" />
        <div className="video-overlay">
          <button className="play-button">
            <i className="fas fa-play"></i>
          </button>
        </div>
      </div>
      <div className="video-details">
        <h2>Introduction to the Course</h2>
        <p>
          Watch this introductory video to get an overview of what you'll learn in this course. 
          Gain insights into the course structure, objectives, and key takeaways.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;