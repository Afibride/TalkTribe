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
          {lesson.video_url && (
            <div>
              <button className="play-btn" onClick={() => onPlay(lesson.video_url)}>Play Video</button>
            </div>
          )}
          {lesson.notes_file && (
            <a href={`http://192.168.57.12:8000/storage/${lesson.notes_file}`} target="_blank" rel="noopener noreferrer">
              Download Notes
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPopup;