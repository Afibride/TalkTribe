import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "../../css/Courses.css";

const WelcomeBackSection = ({ refreshKey, coursesSectionRef }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/progress/user-courses");
        const data = response.data.data || response.data;

        if (Array.isArray(data)) {
          setProgressData(data);
        } else {
          throw new Error("Invalid progress data format");
        }
      } catch (error) {
        setError("Failed to load your progress");
        console.error("Error fetching user progress:", error);
        toast.error("Failed to load your learning progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleContinueLearning = async (courseId, lastLessonId) => {
    try {
      const response = await api.get(`/api/progress/next-lesson/${courseId}`);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to get next lesson");
      }

      navigate(
        `/courses/${courseId}/lessons?lesson=${response.data.next_lesson_id}`
      );
    } catch (error) {
      console.error("Continue Learning Error:", {
        error: error.message,
        response: error.response?.data,
        courseId,
        lastLessonId,
      });

      let errorMessage = "Failed to continue learning";
      let fallbackPath = `/courses/${courseId}`;

      // Specific error handling
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Please login again";
          fallbackPath = "/login";
        } else if (error.response.status === 404) {
          errorMessage = "Course not found";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      // If we have a last lesson, try to continue from there
      if (lastLessonId && error.response?.status !== 401) {
        fallbackPath = `/courses/${courseId}/lessons?lesson=${lastLessonId}`;
        errorMessage += " - Continuing from last lesson";
      }

      toast.error(errorMessage);
      navigate(fallbackPath);
    }
  };

  if (loading) {
    return (
      <div className="welcome-back loading-state">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading your learning progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="welcome-back error-state">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="welcome-back">
      <div className="welcome-header">
        <h2>Welcome back, ready for your next lesson?</h2>
        {progressData.length > 0 && (
          <a href="/history" className="view-history">
            View Full History
          </a>
        )}
      </div>

      <div className="horizontal-scroll-container">
        {progressData.length === 0 ? (
          <div className="empty-state">
            <img
              src="/images/empty-courses.svg"
              alt="No courses started"
              className="empty-illustration"
            />
            <h3>Your learning journey awaits!</h3>
            <p>You haven't started any courses yet.</p>
            <button
              className="primary-btn"
              onClick={() => {
                if (coursesSectionRef?.current) {
                  coursesSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              Browse Available Courses
            </button>
          </div>
        ) : (
          <div className="horizontal-scroll-wrapper">
            {progressData.map((course) => (
              <div key={course.course_id} className="course-card-horizontal">
                <div className="card-header">
                  <img
                    src={course.course_image || "/blog.jpg"}
                    alt={course.course_title}
                    className="course-thumbnail"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/blog.jpg";
                    }}
                  />
                  <span
                    className={`status-badge ${
                      course.progress_percent === 100
                        ? "completed"
                        : "in-progress"
                    }`}
                  >
                    {course.progress_percent === 100
                      ? "Completed"
                      : "In Progress"}
                  </span>
                </div>

                <div className="course-details">
                  <h3>{course.course_title}</h3>

                  <div className="progress-container">
                    <div className="progress-info">
                      <span>
                        {Math.round(course.progress_percent)}% Complete
                      </span>
                      <span>
                        {course.completed_lessons} of {course.total_lessons}{" "}
                        lessons
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress_percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {course.last_lesson_title && (
                    <p className="last-activity">
                      <i className="icon-clock"></i>
                      {course.is_last_lesson_completed
                        ? `Last completed: ${course.last_lesson_title}`
                        : `Last viewed: ${course.last_lesson_title}`}
                    </p>
                  )}

                  <button
                    onClick={() =>
                      handleContinueLearning(
                        course.course_id,
                        course.last_lesson_id
                      )
                    }
                    className={`action-btn ${
                      course.progress_percent === 100 ? "review" : "continue"
                    }`}
                  >
                    {course.progress_percent === 100 ? (
                      <>
                        <i className="icon-refresh"></i>
                        Review Course
                      </>
                    ) : (
                      <>
                        <i className="icon-play"></i>
                        Continue Learning
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeBackSection;
