import React from 'react';
import '../../css/course_open.css';

const LectureNotes = ({ lessons, courseTitle }) => {
  return (
    <section className="lecture-notes">
      <h2>Lecture Notes for {courseTitle || 'this Course'}</h2>
      <p className="lecture-description">
        Explore the lecture notes for this course.
      </p>
      <div className="notes-grid">
        {lessons.length > 0 ? (
          lessons.map((lesson, index) =>
            lesson.notes_file ? (
              <div key={index} className="note-card" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <h3>{lesson.title}</h3>
                <p>{lesson.description}</p>
                <a
                  href={`http://192.168.57.12:8000/storage/${lesson.notes_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Notes
                </a>
              </div>
            ) : null
          )
        ) : (
          <p className='alt'>No notes available for this course.</p>
        )}
      </div>
    </section>
  );
};

export default LectureNotes;