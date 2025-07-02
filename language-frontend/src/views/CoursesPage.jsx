import React, { useEffect, useState, useRef } from 'react';
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
  const [categoriesWithCourses, setCategoriesWithCourses] = useState([]);
  const [mostClickedCourses, setMostClickedCourses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const coursesSectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const coursesResponse = await api.get('/api/courses-by-category');
        setCategoriesWithCourses(coursesResponse.data);
      
        const clickedResponse = await api.get('/api/most-clicked-courses');
        setMostClickedCourses(clickedResponse.data);
        
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [mostClickedCourses, categoriesWithCourses]);

  if (loading) {
    return (
      <div className="courses-page-loading">
        <NewNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page-error">
        <NewNavbar />
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="courses-page">
      <NewNavbar />
      
      <WelcomeBackSection 
        refreshKey={refreshKey} 
        coursesSectionRef={coursesSectionRef} 
      />
      
      <TopCategories />
      
      <OnlineLearningCTA />
      
      {/* First category section with ref for scrolling */}
      <div 
        ref={coursesSectionRef} 
        id="courses-section" 
        className="category-section"
      >
        {categoriesWithCourses.length > 0 && (
          <CoursesSection 
            title={categoriesWithCourses[0].name} 
            courses={categoriesWithCourses[0].courses} 
          />
        )}
      </div>
      
      {/* Remaining category sections */}
      {categoriesWithCourses.slice(1).map(category => (
        <div 
          key={category.id} 
          id={`category-${category.id}`} 
          className="category-section"
        >
          <CoursesSection 
            title={category.name} 
            courses={category.courses} 
          />
        </div>
      ))}
      
      <StudentsViewing courses={mostClickedCourses} />
      
      <Footer />
    </div>
  );
};

export default CoursesPage;