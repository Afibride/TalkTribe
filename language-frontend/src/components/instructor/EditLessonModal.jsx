import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/api';
import '../../css/EditLessonModal.css';

const EditLessonModal = ({ lesson, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: lesson.title,
    description: lesson.description,
    video_file: null,
    notes_file: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState(lesson.video_url_full || null);
  const [notesPreview, setNotesPreview] = useState(lesson.notes_file_url_full ? { 
    type: lesson.notes_file_url_full.split('.').pop(),
    name: lesson.notes_file_url_full.split('/').pop()
  } : null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      
      // Create previews
      if (name === 'video_file') {
        const videoURL = URL.createObjectURL(files[0]);
        setVideoPreview(videoURL);
      } else if (name === 'notes_file') {
        const file = files[0];
        if (file.type === 'application/pdf') {
          setNotesPreview({ type: 'pdf', name: file.name });
        } else if (file.type.includes('word') || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          setNotesPreview({ type: 'doc', name: file.name });
        } else {
          setNotesPreview({ type: 'other', name: file.name });
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('course_id', lesson.course_id);
      formDataToSend.append('_method', 'PUT');
      
      if (formData.video_file) {
        formDataToSend.append('video_file', formData.video_file);
      }
      if (formData.notes_file) {
        formDataToSend.append('notes_file', formData.notes_file);
      }

      const response = await api.post(`/api/lessons/${lesson.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Failed to update lesson' });
      }
      toast.error('Failed to update lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (type) => {
    if (type === 'video') {
      setFormData(prev => ({ ...prev, video_file: null }));
      setVideoPreview(null);
    } else {
      setFormData(prev => ({ ...prev, notes_file: null }));
      setNotesPreview(null);
    }
  };

  return (
    <div className="edit-lesson-modal">
      <h2>Edit Lesson</h2>
      
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Lesson Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Video File (MP4, MOV, AVI - max 10MB)</label>
          <div className="file-upload">
            <input
              type="file"
              id="edit-lesson-video"
              name="video_file"
              accept="video/*"
              onChange={handleFileChange}
              className={errors.video_file ? 'error' : ''}
            />
            <label htmlFor="edit-lesson-video" className="file-upload-label">
              {formData.video_file ? 'Change Video' : 'Choose Video File'}
            </label>
            {videoPreview && (
              <div className="preview-container">
                <video controls src={videoPreview} className="preview-video" />
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={() => removeFile('video')}
                >
                  &times;
                </button>
              </div>
            )}
            {errors.video_file && <span className="error-text">{errors.video_file}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Notes File (PDF, DOCX - max 5MB)</label>
          <div className="file-upload">
            <input
              type="file"
              id="edit-lesson-notes"
              name="notes_file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              onChange={handleFileChange}
              className={errors.notes_file ? 'error' : ''}
            />
            <label htmlFor="edit-lesson-notes" className="file-upload-label">
              {formData.notes_file ? 'Change Notes' : 'Choose Notes File'}
            </label>
            {notesPreview && (
              <div className="preview-container">
                <div className="notes-preview">
                  <span className={`file-icon ${notesPreview.type}`}></span>
                  <span className="file-name">{notesPreview.name}</span>
                </div>
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={() => removeFile('notes')}
                >
                  &times;
                </button>
              </div>
            )}
            {errors.notes_file && <span className="error-text">{errors.notes_file}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLessonModal;