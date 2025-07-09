import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LessonsIntro from '../components/lessons/LessonsIntro';
import api from '../api/api';
import NewNavbar from '../components/Navbar1';
import VideoSection from '../components/lessons/VideoSection';
import LessonsGrid from '../components/lessons/LessonsGrid';
import LectureNotes from '../components/lessons/LectureNotes';
import Quizzes from '../components/lessons/Quizzes';
import Footer from '../components/Footer';
import LessonPopup from '../components/lessons/LessonPopup';
import '../css/Course_open.css';

const LessonsPage = ({ onProgressUpdate }) => {
  const { id: courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const continueLessonId = query.get('lesson');

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningStarted, setLearningStarted] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [courseProgress, setCourseProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' or 'quizzes'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/api/courses/${courseId}/lessons`),
          api.get(`/api/progress/course/${courseId}`)
        ]);

        setCourse(courseRes.data);
        setCourseProgress(progressRes.data.data || progressRes.data);

        if (progressRes.data.data || progressRes.data) {
          setLearningStarted(true);
        }

        if (continueLessonId && courseRes.data.lessons) {
          const lessonToContinue = courseRes.data.lessons.find(
            l => String(l.id) === String(continueLessonId)
          );
          if (lessonToContinue) {
            setSelectedLesson(lessonToContinue);
            setCurrentVideoUrl(lessonToContinue.video_url);
          }
        } else if (progressRes.data?.last_lesson_id) {
          const lastLesson = courseRes.data.lessons.find(
            l => String(l.id) === String(progressRes.data.last_lesson_id)
          );
          if (lastLesson) {
            setSelectedLesson(lastLesson);
            setCurrentVideoUrl(lastLesson.video_url);
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, continueLessonId]);

  const handleLessonClick = async (lesson) => {
    try {
      await api.post('/api/progress/lesson', {
        lesson_id: lesson.id,
        is_completed: false
      });

      setSelectedLesson(lesson);
      setShowPopup(true);

      if (onProgressUpdate) onProgressUpdate();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  const handlePlayVideo = async (videoUrl) => {
    try {
      if (selectedLesson) {
        await api.post('/api/progress/lesson', {
          lesson_id: selectedLesson.id,
          is_completed: true
        });

        setCurrentVideoUrl(videoUrl);
        setShowPopup(false);

        const progressRes = await api.get(`/api/progress/course/${courseId}`);
        setCourseProgress(progressRes.data.data || progressRes.data);
        if (onProgressUpdate) onProgressUpdate();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleStartLearning = async () => {
    try {
      await api.post(`/api/progress/start-course/${courseId}`);

      setLearningStarted(true);
      if (onProgressUpdate) onProgressUpdate();

      if (course?.lessons?.length > 0) {
        setSelectedLesson(course.lessons[0]);
        setCurrentVideoUrl(course.lessons[0].video_url);
      }
    } catch (error) {
      console.error('Error starting course:', error);
    }
  };

  const navigateToQuizzes = () => {
    navigate(`/courses/${courseId}/quizzes`);
  };

  if (!course) {
    return <div className="loading">Loading...</div>;
  }

  if (!learningStarted) {
    return (
      <>
        <NewNavbar />
        <LessonsIntro
          course={course}
          onStartLearning={handleStartLearning}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <NewNavbar />

      <VideoSection
        videos={course.lessons || []}
        courseTitle={course.title}
        initialLesson={selectedLesson}
        currentVideoUrl={currentVideoUrl}
      />

      <div className="course-tabs">
        <button
          className={`tab-button ${activeTab === 'lessons' ? 'active' : ''}`}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
        <button
          className={`tab-button ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button 
          className="standalone-quizzes-button"
          onClick={navigateToQuizzes}
        >
          View All Quizzes
        </button>
      </div>

      <div className="course-content-container">
        {activeTab === 'lessons' ? (
          <>
            <LessonsGrid
              chapters={course.chapters || []}
              lessons={course.lessons || []}
              courseTitle={course.title}
              onLessonClick={handleLessonClick}
              courseProgress={courseProgress}
            />

            <LectureNotes lessons={course.lessons || []} courseTitle={course.title} />

            <div className="section-divider"></div>

            <h2>Lesson Quizzes</h2>
            <Quizzes lessons={course.lessons || []} standalone={false} />
          </>
        ) : (
          <Quizzes lessons={course.lessons || []} standalone={true} />
        )}
      </div>

      {showPopup && selectedLesson && (
        <LessonPopup
          lesson={selectedLesson}
          onClose={() => setShowPopup(false)}
          onPlay={handlePlayVideo}
        />
      )}

      <Footer />
    </>
  );
};

export default LessonsPage;