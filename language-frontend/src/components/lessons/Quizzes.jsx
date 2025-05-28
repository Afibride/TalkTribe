import React from 'react';
import '../../css/course_open.css';

const Quizzes = () => {
  const quizzes = [
    {
      title: 'Basic Vocabulary Quiz',
      description: 'Test your knowledge of basic Lamnso vocabulary.',
      duration: '10 Minutes',
    },
    {
      title: 'Grammar Essentials Quiz',
      description: 'Assess your understanding of Lamnso grammar rules.',
      duration: '15 Minutes',
    },
    {
      title: 'Cultural Insights Quiz',
      description: 'Evaluate your knowledge of Lamnso cultural practices.',
      duration: '10 Minutes',
    },
    {
      title: 'Conversational Practice Quiz',
      description: 'Practice real-life conversations with this quiz.',
      duration: '20 Minutes',
    },
  ];

  return (
    <section className="quizzes-section">
      <h2>Quizzes</h2>
      <p className="quizzes-description">
        Test your knowledge and track your progress with these interactive quizzes. Each quiz is designed to reinforce your learning and boost your confidence.
      </p>
      <div className="quizzes-grid">
        {quizzes.map((quiz, index) => (
          <div key={index} className="quiz-card" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <p className="quiz-duration">Duration: {quiz.duration}</p>
            <button className="start-quiz-btn">Start Quiz</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Quizzes;