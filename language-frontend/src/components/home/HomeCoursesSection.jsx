import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import '../../css/HomeLogin.css';

const CoursesSection = ({ userId, userName, userEmail }) => {
  const [courses, setCourses] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/home-courses', {
          params: { limit: 12 }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    if (!userId) {
      toast.info('Please login to view this course');
      navigate('/login', { state: { from: 'course-access' } });
      return false; 
    }
    return true; 
  };

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Safe render function for instructor name
  const renderInstructor = (instructor) => {
    if (typeof instructor === 'string') return instructor;
    if (instructor?.name) return instructor.name;
    return 'TalkTribe Team';
  };

  if (loading) {
    return (
      <section className="courses-section">
        <div className="loading-courses">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="courses-section" data-aos="fade-up">
      <h2 className="courses-title">Our Courses</h2>
      <p className="courses-subtitle">
        Learn your native tongue through engaging, interactive courses led by experienced native speakers and tech-aided formats.
      </p>
      
      <div className="course-grid">
        {courses.map((course, index) => (
          <div key={course.id || index} className="course-card" data-aos="zoom-in" data-aos-delay={`${index * 100}`}>
            <img 
              src={course.image_url || '/blog.jpg'} 
              alt={`${course.title} course`} 
              className="course-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/blog.jpg';
              }}
            />
            <div className="course-details">
              <span className="course-meta">
                {course.duration || 'Self-paced'} | {course.level || 'All levels'} | By {renderInstructor(course.instructor)}
              </span>
              <h3>{course.title}</h3>
              <p
                className="course-description"
                onClick={() => toggleDescription(index)}
                style={{ cursor: 'pointer' }}
              >
                {expandedIndex === index
                  ? course.description
                  : `${course.description?.slice(0, 50) || 'No description available'}...`}
              </p>
              <div className="course-actions">
                <Link 
                  to={`/courses/${course.id}/lessons`} 
                  className="course-btn"
                  onClick={(e) => !handleCourseClick(course.id) && e.preventDefault()}
                >
                  Start Now!
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div>
        <Link to="/local-languages" className="see-all-btn" data-aos="fade-up">
          View All Courses
        </Link>
      </div>
    </section>
  );
};

export default CoursesSection;