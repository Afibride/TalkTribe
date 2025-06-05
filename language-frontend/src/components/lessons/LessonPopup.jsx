import React from 'react';
import '../../css/course_open.css';

const LessonPopup = ({ lesson, onClose, onPlay }) => {
  return (
    <div className="lesson-popup-overlay">
      <div className="lesson-popup">
        <div className="popup-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
          {lesson.video_url_full && (
            <div>
              <button className="play-btn" onClick={() => onPlay(lesson.video_url_full)}>Play Video</button>
            </div>
          )}
          {lesson.notes_file_url_full && (
            <a href={lesson.notes_file_url_full} target="_blank" rel="noopener noreferrer">
              Download Notes
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPopup;