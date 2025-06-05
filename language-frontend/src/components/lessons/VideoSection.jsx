import React, { useEffect, useRef, useState } from 'react';
import '../../css/course_open.css';

const VideoSection = ({ videos, courseTitle, initialLesson, currentVideoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastSentPercent, setLastSentPercent] = useState(0);
  const videoRef = useRef(null);

  // Find the index of the initial lesson, or default to 0
  const initialIndex = initialLesson
    ? videos.findIndex((v) => v.id === initialLesson.id)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  useEffect(() => {
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [initialIndex]);

  useEffect(() => {
    // Disable scrolling when the video is playing
    if (isPlaying) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  return (
    <section className="video-section">
      <h2>{courseTitle || 'this course'} Lessons</h2>
      <p className="video-description">
        Explore the lessons for this course. Click on a thumbnail to play the video.
      </p>     <div className="video-thumbnails">
        {videos.map((lesson, idx) => (
          <img
            key={lesson.id}
            src={lesson.thumbnail_url || '/blog.jpg'}
            alt={lesson.title}
            className={`video-thumb ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            style={{ cursor: 'pointer', width: 80, marginRight: 8, border: currentIndex === idx ? '2px solid #702424' : 'none' }}
          />
        ))}
      </div>
 
      {videos.length > 0 ? (
        <video
          width="100%"
          height="100%"
          id="main-video"
          controls
          ref={videoRef}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={e => {
            const video = e.target;
            const percent = Math.floor((video.currentTime / video.duration) * 100);
            // Only send if percent has increased
            if (percent > lastSentPercent) {
              api.post('/api/lesson-progress', {
                lesson_id: currentLessonId,
                progress_percent: percent,
              });
              setLastSentPercent(percent);
            }
          }}
          src={videos[currentIndex]?.video_url_full}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No videos available for this course.</p>
      )}
    </section>
  );
};

export default VideoSection;