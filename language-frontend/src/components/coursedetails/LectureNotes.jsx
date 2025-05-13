import React from 'react';
import '../../css/course_open.css';

const LectureNotes = () => {
  const notes = [
    {
      title: 'Introduction to Lamnso Language',
      lesson: 'Chapter 01',
      duration: '45 Minutes',
      description: 'Learn the basics of the Lamnso language, including common phrases and greetings.',
    },
    {
      title: 'Grammar Essentials',
      lesson: 'Chapter 02',
      duration: '1 Hour',
      description: 'Understand the foundational grammar rules of the Lamnso language.',
    },
    {
      title: 'Building Vocabulary',
      lesson: 'Chapter 03',
      duration: '1.5 Hours',
      description: 'Expand your vocabulary with commonly used words and phrases.',
    },
    {
      title: 'Cultural Insights',
      lesson: 'Chapter 04',
      duration: '1 Hour',
      description: 'Explore the cultural traditions and practices of the Lamnso people.',
    },
    {
      title: 'Conversational Practice',
      lesson: 'Chapter 05',
      duration: '1.5 Hours',
      description: 'Practice real-life conversations to improve your fluency and confidence.',
    },
  ];

  return (
    <section className="lecture-notes">
      <h2>Lecture Notes: Lamnso Language and Culture</h2>
      <p className="lecture-description">
        Dive into the chapters of the Lamnso Language and Culture course. Each chapter is designed to help you master the language and understand the culture step by step.
      </p>
      <div className="notes-grid">
        {notes.map((note, index) => (
          <div key={index} className="note-card" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
            <h3>{note.title}</h3>
            <p><strong>{note.lesson}</strong></p>
            <p>{note.duration}</p>
            <p className="note-description">{note.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LectureNotes;