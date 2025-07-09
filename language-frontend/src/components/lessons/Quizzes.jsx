import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/course_open.css";
import api from "../../api/api";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

const Quizzes = ({ lessons = [], standalone = false }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [generatingQuizzes, setGeneratingQuizzes] = useState([]);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const addToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/quizzes");
        const allQuizzes = Array.isArray(response?.data) ? response.data : [];

        const lessonIds = lessons.map((l) => l.id);
        const filteredQuizzes = standalone
          ? allQuizzes.filter((q) => lessonIds.includes(q.lesson_id))
          : allQuizzes;

        setQuizzes(filteredQuizzes);

        if (lessons.length > 0) {
          const missingQuizzes = lessons
            .filter(
              (lesson) => !allQuizzes.some((q) => q.lesson_id === lesson.id)
            )
            .map((lesson) => lesson.id);

          if (missingQuizzes.length > 0) {
            setGeneratingQuizzes(missingQuizzes);
            missingQuizzes.forEach((lessonId) => {
              generateQuiz(lessonId, false);
            });
          }
        }
      } catch (err) {
        console.error("Failed to load quizzes:", err);
        addToast("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [lessons, standalone]);

  const generateQuiz = async (lessonId, showMessage = true) => {
    try {
      setLoading(true);
      setGeneratingQuizzes((prev) => [...prev, lessonId]);

      const response = await api.post("/api/quizzes/generate", {
        lesson_id: lessonId,
      });
      const newQuiz = response?.data;

      if (newQuiz) {
        setQuizzes((prev) => [
          ...prev.filter((q) => q.lesson_id !== lessonId),
          newQuiz,
        ]);
        if (showMessage) addToast("Quiz generated successfully!", "success");
      } else {
        throw new Error("Empty quiz data received");
      }
    } catch (err) {
      console.error("Quiz generation error:", err);

      let errorMsg = "Failed to generate quiz. ";
      if (err.response) {
        if (err.response.status === 429) {
          errorMsg =
            "Please wait before generating another quiz (rate limit exceeded).";
        } else if (err.response.status === 404) {
          errorMsg += "Lesson not found.";
        } else if (err.response.data?.message) {
          errorMsg += err.response.data.message;
        } else {
          errorMsg += "Server error occurred.";
        }
      }
      addToast(errorMsg);
    } finally {
      setLoading(false);
      setGeneratingQuizzes((prev) => prev.filter((id) => id !== lessonId));
    }
  };

  const startQuiz = (quiz) => {
    if (!quiz?.questions?.length) {
      addToast("This quiz has no questions yet.");
      return;
    }

    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const currentQuestion = activeQuiz?.questions?.[currentQuestionIndex];
    if (currentQuestion && answerIndex === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizCompleted(true);
    try {
      if (activeQuiz) {
        await api.post(`/api/quiz/${activeQuiz.id}/submit`, {
          answers: activeQuiz.questions.map((q) => ({
            question_id: q.id,
            selected_option: q.correct_answer,
          })),
        });
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      addToast("Failed to save quiz results.");
    }
  };

  const resetQuiz = () => setActiveQuiz(null);
  const isGenerating = (lessonId) => generatingQuizzes.includes(lessonId);
  const getLessonTitle = (lessonId) =>
    lessons.find((l) => l.id === lessonId)?.title || "Unknown Lesson";

  return (
    <section className={`quizzes-section ${standalone ? "standalone" : ""}`}>
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={`toast-${toast.id}`}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {!standalone && (
        <>
          <h2>Quizzes</h2>
          <p className="quizzes-description">
            Test your knowledge with these interactive assessments.
          </p>
        </>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <span>Loading...</span>
        </div>
      )}

      {!activeQuiz ? (
        <>
          <div className="quizzes-grid">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={`quiz-card-${quiz.id}`} className="quiz-card">
                  <h3>
                    {quiz.title || `Quiz: ${getLessonTitle(quiz.lesson_id)}`}
                  </h3>
                  <p>{quiz.description || "Test your understanding"}</p>
                  <div className="quiz-meta">
                    <span>{quiz.questions?.length || 0} Questions</span>
                    <span>{quiz.duration || 15} Minutes</span>
                  </div>
                  <button
                    className="start-quiz-btn"
                    onClick={() => startQuiz(quiz)}
                    disabled={
                      !quiz.questions?.length || isGenerating(quiz.lesson_id)
                    }
                  >
                    {isGenerating(quiz.lesson_id)
                      ? "Generating..."
                      : "Start Quiz"}
                  </button>
                </div>
              ))
            ) : (
              !loading && (
                <p key="no-quizzes-message" className="no-quizzes">
                  No quizzes available yet.
                </p>
              )
            )}
          </div>

          {standalone && lessons.length > 0 && (
            <div key="quiz-generation-panel" className="quiz-generation-panel">
              <h3>Generate New Quizzes</h3>
              <div className="generate-options">
                {lessons.map((lesson) => {
                  const hasQuiz = quizzes.some(
                    (q) => q.lesson_id === lesson.id
                  );
                  return (
                    <div
                      key={`generate-card-${lesson.id}`}
                      className="generate-quiz-card"
                    >
                      <span>{lesson.title}</span>
                      <button
                        onClick={() => generateQuiz(lesson.id)}
                        disabled={isGenerating(lesson.id)}
                      >
                        {isGenerating(lesson.id)
                          ? "Generating..."
                          : hasQuiz
                          ? "Regenerate"
                          : "Generate"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="quiz-container">
          {!quizCompleted ? (
            <div className="quiz-question">
              <div className="quiz-progress">
                Question {currentQuestionIndex + 1} of{" "}
                {activeQuiz.questions?.length}
              </div>
              <h3>{activeQuiz.questions[currentQuestionIndex]?.question}</h3>

              <div className="quiz-options">
                {activeQuiz.questions[currentQuestionIndex]?.options?.map(
                  (option, index) => (
                    <button
                      key={`option-${currentQuestionIndex}-${index}`}
                      className={`quiz-option ${
                        selectedAnswer !== null &&
                        index ===
                          activeQuiz.questions[currentQuestionIndex]
                            .correct_answer
                          ? "correct"
                          : selectedAnswer === index
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </button>
                  )
                )}
              </div>

              {selectedAnswer !== null && (
                <div className="quiz-feedback">
                  <p>
                    {activeQuiz.questions[currentQuestionIndex].explanation ||
                      "No explanation provided"}
                  </p>
                  <button
                    className="next-question-btn"
                    onClick={goToNextQuestion}
                  >
                    {currentQuestionIndex < activeQuiz.questions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="quiz-results">
              <h3>Quiz Completed!</h3>
              <div className="quiz-score">
                Your score: {score} out of {activeQuiz.questions?.length || 0} (
                {Math.round(
                  (score / (activeQuiz.questions?.length || 1)) * 100
                )}
                %)
              </div>
              <div className="result-actions">
                <button className="retake-btn" onClick={resetQuiz}>
                  Take Another Quiz
                </button>
                {standalone && (
                  <button className="back-btn" onClick={() => navigate(-1)}>
                    Back to Quizzes
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Quizzes;