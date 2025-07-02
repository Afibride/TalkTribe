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

  // Fetch course details and progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details with lessons
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/api/courses/${courseId}/lessons`),
          api.get(`/api/progress/course/${courseId}`)
        ]);

        setCourse(courseRes.data);
        setCourseProgress(progressRes.data.data || progressRes.data);

        // Check if we have progress data
        if (progressRes.data.data || progressRes.data) {
          setLearningStarted(true);
        }

        // Handle continue lesson if specified
        if (continueLessonId && courseRes.data.lessons) {
          const lessonToContinue = courseRes.data.lessons.find(
            l => String(l.id) === String(continueLessonId)
          );
          if (lessonToContinue) {
            setSelectedLesson(lessonToContinue);
            setCurrentVideoUrl(lessonToContinue.video_url);
          }
        } else if (progressRes.data?.last_lesson_id) {
          // If no continueLessonId but we have last lesson progress
          const lastLesson = courseRes.data.lessons.find(
            l => String(l.id) === String(progressRes.data.last_lesson_id)
          );
          if (lastLesson) {
            setSelectedLesson(lastLesson);
            setCurrentVideoUrl(lastLesson.video_url);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [courseId, continueLessonId]);

  const handleLessonClick = async (lesson) => {
    try {
      // Mark lesson as started if not already completed
      await api.post('/api/progress/lesson', {
        lesson_id: lesson.id,
        is_completed: false
      });
      
      setSelectedLesson(lesson);
      setShowPopup(true);
      
      // Refresh progress data
      if (onProgressUpdate) onProgressUpdate();
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error('Failed to start lesson');
    }
  };

  const handlePlayVideo = async (videoUrl) => {
    try {
      if (selectedLesson) {
        // Mark lesson as completed when video starts playing
        await api.post('/api/progress/lesson', {
          lesson_id: selectedLesson.id,
          is_completed: true
        });
        
        setCurrentVideoUrl(videoUrl);
        setShowPopup(false);
        
        // Refresh progress data
        const progressRes = await api.get(`/api/progress/course/${courseId}`);
        setCourseProgress(progressRes.data.data || progressRes.data);
        if (onProgressUpdate) onProgressUpdate();
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const handleStartLearning = async () => {
    try {
      // Call the start-course endpoint
      const response = await api.post(`/api/progress/start-course/${courseId}`);
      
      setLearningStarted(true);
      if (onProgressUpdate) onProgressUpdate();
      
      // Set the first lesson as selected
      if (course?.lessons?.length > 0) {
        setSelectedLesson(course.lessons[0]);
        setCurrentVideoUrl(course.lessons[0].video_url);
      }
    } catch (error) {
      console.error('Error starting course:', error);
      toast.error('Failed to start course');
    }
  };

  if (!course) {
    return <div className='loading'>Loading...</div>;
  }

  // Show intro until learning has started
  if (!learningStarted) {
    return (
      <div>
        <NewNavbar />
        <LessonsIntro
          course={course}
          onStartLearning={handleStartLearning}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <NewNavbar />
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
        courseProgress={courseProgress}
      />
      <LectureNotes lessons={course.lessons || []} courseTitle={course.title} />
      <Quizzes quizzes={course.quizzes || []} />
      
      {showPopup && selectedLesson && (
        <LessonPopup
          lesson={selectedLesson}
          onClose={() => setShowPopup(false)}
          onPlay={handlePlayVideo}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default LessonsPage;