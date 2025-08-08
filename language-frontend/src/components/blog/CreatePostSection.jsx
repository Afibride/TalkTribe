import React, { useState } from 'react';
import api from '../../api/api';
import '../../css/Blog.css';
import { FaImage, FaVideo, FaPaperPlane } from 'react-icons/fa';

const CreatePostSection = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('title', title || 'New Post');
      if (image) {
        formData.append('image', image);
      }
      if (video) {
        formData.append('video', video);
      }
      
      const response = await api.post('/api/blog/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setContent('');
      setTitle('');
      setImage(null);
      setVideo(null);
      
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="create-post-section">
      <div className="create-post-container">
        <div className="post-header">
          <h3>Create a Post</h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="post-title-input"
            disabled={isSubmitting}
          />
          
          <textarea
            placeholder="Share your thoughts about local languages..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          
          {image && (
            <div className="media-preview">
              <img src={URL.createObjectURL(image)} alt="Preview" />
              <button 
                type="button" 
                onClick={() => setImage(null)}
                className="remove-media-btn"
              >
                ×
              </button>
            </div>
          )}
          
          {video && (
            <div className="media-preview">
              <video controls>
                <source src={URL.createObjectURL(video)} type={video.type} />
                Your browser does not support the video tag.
              </video>
              <button 
                type="button" 
                onClick={() => setVideo(null)}
                className="remove-media-btn"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="create-post-actions">
            <label className="file-upload-btn image-upload">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setVideo(null);
                }}
                disabled={isSubmitting}
              />
              <FaImage className="action-icon" />
              <span className="action-text">Image</span>
            </label>
            
            <label className="file-upload-btn video-upload">
              <input 
                type="file" 
                accept="video/*" 
                onChange={(e) => {
                  setVideo(e.target.files[0]);
                  setImage(null);
                }}
                disabled={isSubmitting}
              />
              <FaVideo className="action-icon" />
              <span className="action-text">Video</span>
            </label>
            
            <button 
              type="submit" 
              disabled={!content.trim() || isSubmitting}
              className="post-button"
            >
              <FaPaperPlane className="action-icon" />
              <span className="action-text">Post</span>
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </section>
  );
};

export default CreatePostSection;