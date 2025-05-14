import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import NewNavbar from '../components/Navbar1';
import CourseIntro from '../components/coursedetails/CourseIntro';
import VideoSection from '../components/coursedetails/VideoSection';
import CoursesGrid from '../components/coursedetails/CoursesGrid';
import LectureNotes from '../components/coursedetails/LectureNotes';
import Quizzes from '../components/coursedetails/Quizzes';
import Footer from '../components/Footer';
import '../css/Course_open.css';

const CoursePage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <NewNavbar />
      <CourseIntro />
      <VideoSection />
      <CoursesGrid />
      <LectureNotes />
      <Quizzes />
      <Footer />
    </div>
  );
};

export default CoursePage;