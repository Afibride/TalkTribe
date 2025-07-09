import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import api from '../../api/api';
import '../../css/BlogDetail.css'

const CommentsSection = ({ postId, initialComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post(`/api/blog/posts/${postId}/comment`, {
        content: commentText
      });
      
      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          disabled={isSubmitting}
        />
        <button type="submit" disabled={!commentText.trim() || isSubmitting}>
          <FaPaperPlane /> {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      
      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <img 
                src={comment.user?.avatar || '/profile.png'} 
                alt={comment.user?.name} 
                className="comment-avatar"
                onError={(e) => { e.target.src = '/profile.png'; }}
              />
              <div>
                <h4>{comment.user?.name || 'Anonymous'}</h4>
                <p className="comment-time">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;