import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import Quizzes from '../components/lessons/Quizzes';
import '../css/course_open.css';

const QuizzesPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}/lessons`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <NewNavbar />
      
      <div className="course-content-container">
        <div className="quizzes-page-container">
          <h1>Course Quizzes</h1>
          <p className="page-description">
            Test your knowledge with these interactive quizzes based on the course lessons.
          </p>
          
          <Quizzes lessons={course.lessons || []} standalone={true} />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default QuizzesPage;