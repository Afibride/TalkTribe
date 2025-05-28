import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import NewNavbar from '../components/Navbar1';
import WelcomeBackSection from '../components/coursespage/WelcomeBackSection';
import TopCategories from '../components/coursespage/TopCategories';
import CoursesSection from '../components/coursespage/CoursesSection';
import OnlineLearningCTA from '../components/coursespage/OnlineLearningCTA';
import StudentsViewing from '../components/coursespage/StudentsViewing';
import Footer from '../components/Footer';
import api from '../api/api';
import '../css/Courses.css';

const CoursesPage = () => {
  const [localLanguageCourses, setLocalLanguageCourses] = useState([]);
  const [cultureCourses, setCultureCourses] = useState([]);
  const [mostClickedCourses, setMostClickedCourses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses-by-category');
        setLocalLanguageCourses(response.data.localLanguageCourses);
        setCultureCourses(response.data.cultureCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    const fetchMostClickedCourses = async () => {
      try {
        const response = await api.get('/api/most-clicked-courses');
        setMostClickedCourses(response.data);
      } catch (error) {
        console.error('Error fetching most clicked courses:', error);
      }
    };
    fetchMostClickedCourses();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [mostClickedCourses]);


  return (
    <div>
      <NewNavbar />
      <WelcomeBackSection refreshKey={refreshKey} />
      <TopCategories />
      <CoursesSection title="Local Language Courses" courses={localLanguageCourses} />
      <OnlineLearningCTA />
      <CoursesSection title="Culture Courses" courses={cultureCourses} />
      <StudentsViewing courses={mostClickedCourses} />
      <Footer />
    </div>
  );
};

export default CoursesPage;