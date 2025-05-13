import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import NewNavbar from '../components/Navbar1';
import WelcomeBackSection from '../components/coursespage/WelcomeBackSection';
import TopCategories from '../components/coursespage/TopCategories';
import CoursesSection from '../components/coursespage/CoursesSection';
import OnlineLearningCTA from '../components/coursespage/OnlineLearningCTA';
import StudentsViewing from '../components/coursespage/StudentsViewing';
import Footer from '../components/Footer';
import '../css/Courses.css';

const CoursesPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <NewNavbar />
      <WelcomeBackSection />
      <TopCategories />
      <CoursesSection title="Local Language Courses" />
      <OnlineLearningCTA />
      <CoursesSection title="Culture Courses" />
      <StudentsViewing />
      <Footer />
    </div>
  );
};

export default CoursesPage;