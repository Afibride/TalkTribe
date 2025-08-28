import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import '../../css/CreateCourseModal.css';

const CreateCourseModal = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    level: 'beginner',
    duration: '',
    image: null,
    previewImage: null
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          categories: 'Failed to load categories'
        }));
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size and type
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image must be less than 2MB'
        }));
        return;
      }
      if (!file.type.match('image.*')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select an image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
        imageError: null
      }));
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
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('level', formData.level);
      formDataToSend.append('duration', formData.duration);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await api.post('/api/courses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess(response.data.course);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.message || 'Failed to create course' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-course-modal">
      <div className="modal-header">
        <h2>Create New Course</h2>

      </div>
      
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title[0]}</span>}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description[0]}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            {isLoadingCategories ? (
              <div className="loading-text">Loading categories...</div>
            ) : (
              <>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className={errors.category_id ? 'error' : ''}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <span className="error-message">{errors.category_id[0]}</span>}
              </>
            )}
          </div>

          <div className="form-group">
            <label>Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={errors.level ? 'error' : ''}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.level && <span className="error-message">{errors.level[0]}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (e.g., "4 weeks")</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={errors.duration ? 'error' : ''}
            />
            {errors.duration && <span className="error-message">{errors.duration[0]}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Course Image</label>
          <div className="file-upload">
            <input
              type="file"
              id="course-image"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="course-image" className="file-upload-label">
              {formData.image ? 'Change Image' : 'Choose Image'}
            </label>
            {errors.image && <span className="error-message">{errors.image}</span>}
            {formData.previewImage && (
              <div className="image-preview">
                <img src={formData.previewImage} alt="Course preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    image: null,
                    previewImage: null
                  }))}
                >
                  &times;
                </button>
              </div>
            )}
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
            disabled={isSubmitting || isLoadingCategories}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Creating...
              </>
            ) : (
              'Create Course'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseModal;