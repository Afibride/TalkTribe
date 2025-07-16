import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';
import '../../css/InstructorCourseLessons.css';
import CreateLessonModal from './CreateLessonModal';
import EditLessonModal from './EditLessonModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const InstructorCourseLessons = ({ courseId, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get(`/api/courses/${courseId}/lessons`);
        setLessons(response.data.lessons || []);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        toast.error('Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  const handleLessonCreated = (newLesson) => {
    setLessons(prev => [newLesson, ...prev]);
    toast.success('Lesson created successfully!');
    setShowCreateModal(false);
  };

  const handleLessonUpdated = (updatedLesson) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      )
    );
    toast.success('Lesson updated successfully!');
    setShowEditModal(false);
    setSelectedLesson(null);
  };

  const handleDeleteLesson = async () => {
    if (!selectedLesson) return;

    try {
      await api.delete(`/api/lessons/${selectedLesson.id}`);
      setLessons(prev => prev.filter(lesson => lesson.id !== selectedLesson.id));
      toast.success('Lesson deleted successfully!');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    } finally {
      setShowDeleteModal(false);
      setSelectedLesson(null);
    }
  };

  const handleEditClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowEditModal(true);
  };

  const handleDeleteClick = (lesson) => {
    setSelectedLesson(lesson);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedLesson(null);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setSelectedLesson(null);
  };

  return (
    <div className="instructor-course-lessons">
      <div className="lessons-header">
        <h2>Manage Lessons</h2>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="lessons-content">
        <div className="lessons-list-container">
          <div className="list-header">
            <h3>Course Lessons</h3>
            <button
              className="add-lesson-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Add Lesson
            </button>
          </div>

          {isLoading ? (
            <div className="loading">Loading lessons...</div>
          ) : lessons.length === 0 ? (
            <div className="no-lessons">
              <p>No lessons created yet.</p>
            </div>
          ) : (
            <ul className="lessons-list">
              {lessons.map(lesson => (
                <li key={lesson.id} className="lesson-item">
                  <div className="lesson-info">
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description || 'No description'}</p>
                    <div className="lesson-badges">
                      {lesson.video_url_full && (
                        <span className="lesson-badge video">Video</span>
                      )}
                      {lesson.notes_file_url_full && (
                        <span className="lesson-badge notes">Notes</span>
                      )}
                    </div>
                  </div>
                  <div className="lesson-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(lesson)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(lesson)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateLessonModal
          courseId={courseId}
          onSuccess={handleLessonCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selectedLesson && (
        <EditLessonModal
          lesson={selectedLesson}
          onSuccess={handleLessonUpdated}
          onCancel={cancelEdit}
        />
      )}

      {showDeleteModal && selectedLesson && (
        <ConfirmDeleteModal
          itemType="Lesson"
          itemName={selectedLesson.title}
          onConfirm={handleDeleteLesson}
          onCancel={cancelDelete}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default InstructorCourseLessons;
