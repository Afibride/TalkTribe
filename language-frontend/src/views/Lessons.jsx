import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const continueLessonId = query.get('lesson');

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningStarted, setLearningStarted] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/api/courses/${id}/lessons`);
        setCourse(response.data);

        // If coming from "Continue Learning", set the video to the correct lesson
        if (continueLessonId && response.data.lessons) {
          const lessonToContinue = response.data.lessons.find(
            (l) => String(l.id) === String(continueLessonId)
          );
          if (lessonToContinue) setSelectedLesson(lessonToContinue);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [id, continueLessonId]);

  // Check if user has progress for this course
  useEffect(() => {
    const checkProgress = async () => {
      if (!course || !course.lessons || course.lessons.length === 0) return;
      try {
        // Check progress for the first lesson in this course
        const lessonId = course.lessons[0].id;
        const res = await api.get(`/api/lesson-progress/${lessonId}`);
        if (res.data && res.data.progress_percent !== undefined) {
          setLearningStarted(true); // Skip intro if progress exists
        }
      } catch (error) {
        // No progress found, show intro
        setLearningStarted(false);
      }
    };
    checkProgress();
  }, [course]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowPopup(true);
  };
  const closePopup = () => setSelectedLesson(null);

  const handlePlayVideo = (videoUrl) => {
    const videoElement = document.getElementById('main-video');
    if (videoElement) {
      videoElement.src = videoUrl;
      videoElement.play();
    }
    closePopup();
  };

  if (!course) {
    return <div className='loading'>Loading...</div>;
  }

  // Only show LessonsIntro until learningStarted is true
  if (!learningStarted) {
    return (
      <div>
        <NewNavbar />
        <LessonsIntro
          course={course}
          onStartLearning={() => {
            setLearningStarted(true);
            if (onProgressUpdate) onProgressUpdate(); // <-- trigger refresh
          }}
        />
        <Footer />
      </div>
    );
  }

  // Show the rest of the lesson page after learning has started
  return (
    <div>
      <NewNavbar />
      {learningStarted ? (
        <>
          <VideoSection
            videos={course.lessons || []}
            courseTitle={course.title}
            initialLesson={selectedLesson}
            currentVideoUrl={currentVideoUrl}
          />
          <LessonsGrid
            chapters={course.chapters || []}
            lessons={course.lessons || []}
            courseTitle={course.title}
            onLessonClick={handleLessonClick}
          />
          <LectureNotes lessons={course.lessons || []} courseTitle={course.title} />
          <Quizzes quizzes={course.quizzes || []} />
          <Footer />
          {showPopup && selectedLesson && (
            <LessonPopup
              lesson={selectedLesson}
              onClose={() => setShowPopup(false)}
              onPlay={(videoUrl) => {
                setCurrentVideoUrl(videoUrl);
                setShowPopup(false);
              }}
            />
          )}
        </>
      ) : (
        <LessonsIntro
          course={course}
          onStartLearning={() => {
            setLearningStarted(true);
            if (onProgressUpdate) onProgressUpdate();
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default LessonsPage;