import React, { useState } from 'react';
import '../../css/Blog.css';
import CreatePostSection from './CreatePostSection';

const BlogHeroSection = ({ onPostCreated }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover the Power of Local Languages</h1>
          <p>
            Explore the beauty of your native tongue and its cultural significance. 
            Join us in preserving the heritage of local languages through engaging blogs and resources.
          </p>
          <button 
            className="create-post-btn"
            onClick={() => setShowCreatePost(true)}
          >
            Create Post
          </button>
        </div>
        <img
          src="/blog.jpg"
          alt="Team collaborating with sticky notes"
          className="hero-image"
        />
      </section>

      {showCreatePost && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal" 
              onClick={() => setShowCreatePost(false)}
            >
              &times;
            </button>
            <CreatePostSection 
              onSuccess={() => {
                setShowCreatePost(false);
                if (onPostCreated) onPostCreated();
              }} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BlogHeroSection;