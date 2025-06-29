import React, { useState } from 'react';
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane } from 'react-icons/fa';
import '../../css/Blog.css';

const BlogPost = ({ post, onLike, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <div className="blog-post">
      <div className="post-header">
        <img src={post.author.avatar} alt={post.author.name} className="author-avatar" />
        <div className="author-info">
          <h3>{post.author.name}</h3>
          <p>{post.author.role} • {post.timestamp}</p>
        </div>
      </div>
      
      <div className="post-content">
        <p>{post.content.text}</p>
        {post.content.image && (
          <img src={post.content.image} alt="Post" className="post-image" />
        )}
      </div>
      
      <div className="post-stats">
        <span>{post.stats.likes} likes</span>
        <span>{post.stats.comments} comments</span>
        <span>{post.stats.shares} shares</span>
      </div>
      
      <div className="post-actions">
        <button 
          className={`action-button ${post.liked ? 'liked' : ''}`}
          onClick={() => onLike(post.id)}
        >
          <span className="desktop-text">{post.liked ? 'Liked' : 'Like'}</span>
          <FaThumbsUp className="mobile-icon" />
        </button>
        <button className="action-button">
          <span className="desktop-text">Comment</span>
          <FaComment className="mobile-icon" />
        </button>
        <button className="action-button">
          <span className="desktop-text">Share</span>
          <FaShare className="mobile-icon" />
        </button>
      </div>
      
      <div className="comments-section">
        {post.comments.map(comment => (
          <div key={comment.id} className="comment">
            <img src="/profile.png" alt={comment.author} className="comment-avatar" />
            <div className="comment-content">
              <h4>{comment.author}</h4>
              <p>{comment.text}</p>
              <span className="comment-time">{comment.time}</span>
            </div>
          </div>
        ))}
        
        <form onSubmit={handleCommentSubmit} className="add-comment">
          <img src="/profile.png" alt="User" className="comment-avatar" />
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="send-button">
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogPost;