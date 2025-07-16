import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/InstructorCourses.css';
import InstructorCourseLessons from './InstructorCourseLessons';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EditCourseModal from './EditCourseModal';
import api from '../../api/api'; 

const InstructorCourses = ({ 
  courses, 
  onCourseCreated,
  onCourseUpdated, 
  onCourseDeleted
}) => {
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleManageLessons = (courseId) => {
    setSelectedCourseId(courseId);
    setShowLessonsModal(true);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    try {
      await api.delete(`/api/courses/${selectedCourse.id}`);
      onCourseDeleted(selectedCourse.id); 
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setShowDeleteModal(false);
      setSelectedCourse(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleCourseUpdated = (updatedCourse) => {
    onCourseUpdated(updatedCourse);
    toast.success('Course updated successfully!');
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="instructor-courses">
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <div className="no-courses">
          <p>You haven't created any courses yet.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image-container">
                <img 
                  src={course.image_url || '/blog.jpg'} 
                  alt={course.title}
                  onError={(e) => { e.target.src = '/blog.jpg'; }}
                />
                <div className="course-status">
                  {course.is_published ? (
                    <span className="published">Published</span>
                  ) : (
                    <span className="draft">Draft</span>
                  )}
                </div>
              </div>
              <div className="course-details">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <span className="enrollment-count">
                    <i className="fas fa-users"></i> {course.enrollments_count || 0}
                  </span>
                </div>
                <p className="course-description">
                  {course.description.length > 100 
                    ? `${course.description.substring(0, 100)}...` 
                    : course.description}
                </p>
                <div className="course-meta">
                  <span className={`course-level ${course.level}`}>
                    {course.level}
                  </span>
                  <span className="course-duration">
                    <i className="far fa-clock"></i> {course.duration || 'N/A'}
                  </span>
                  <span className="course-category">
                    {course.category?.name || 'Uncategorized'}
                  </span>
                </div>
                <div className="course-actions">
                  <button 
                    className="manage-lessons-btn"
                    onClick={() => handleManageLessons(course.id)}
                  >
                    <i className="fas fa-tasks"></i> Lessons
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(course)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteClick(course)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLessonsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InstructorCourseLessons 
              courseId={selectedCourseId}
              onClose={() => setShowLessonsModal(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && selectedCourse && (
        <ConfirmDeleteModal
          itemType="Course"
          itemName={selectedCourse.title}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {showEditModal && selectedCourse && (
        <EditCourseModal
          course={selectedCourse}
          onSuccess={handleCourseUpdated}
          onCancel={cancelEdit}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InstructorCourses;
