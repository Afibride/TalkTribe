import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaReply, FaTimes, FaComment, FaCaretDown, FaCaretUp } from 'react-icons/fa';
import api from '../../api/api';
import '../../css/BlogDetail.css';

const CommentsSection = ({ postId, initialComments, onAddComment }) => {
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    if (showComments) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await onAddComment(commentText, replyingTo);
      if (success) {
        setCommentText('');
        setReplyingTo(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      setReplyingTo(null);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const totalComments = comments.reduce(
    (acc, comment) => acc + 1 + (comment.replies_count || 0),
    0
  );

  return (
    <div className="comments-section">
      <button className="comments-toggle-btn" onClick={toggleComments}>
        <FaComment /> Comments ({totalComments})
      </button>

      {showComments && (
        <div className="comments-modal">
          <div className="comments-header">
            <h3>Comments</h3>
            <button className="close-comments" onClick={toggleComments}>
              <FaTimes />
            </button>
          </div>

          <div className="comments-list-container">
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-main">
                    <div className="comment-header">
                      <Link to={`/profile/${comment.user?.username || 'user'}`}>
                        <img
                          src={comment.user?.profile_pic_url || '/profile.png'}
                          alt={comment.user?.name}
                          className="comment-avatar"
                          onError={(e) => { e.target.src = '/profile.png'; }}
                        />
                      </Link>
                      <div className="comment-info">
                        <Link to={`/profile/${comment.user?.username || 'user'}`}>
                          <h4>{comment.user?.name || 'Anonymous'}</h4>
                        </Link>
                        <p className="comment-time">
                          {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                    <div className="comment-actions">
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className={`reply-btn ${replyingTo === comment.id ? 'active' : ''}`}
                      >
                        <FaReply /> Reply
                      </button>
                      {comment.replies_count > 0 && (
                        <button 
                          onClick={() => toggleReplies(comment.id)}
                          className="toggle-replies-btn"
                        >
                          {expandedReplies[comment.id] ? (
                            <>
                              <FaCaretUp /> Hide replies ({comment.replies_count})
                            </>
                          ) : (
                            <>
                              <FaCaretDown /> Show replies ({comment.replies_count})
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {(expandedReplies[comment.id] || comment.replies?.length > 0) && (
                    <div className="replies-container">
                      {comment.replies?.map(reply => (
                        <div key={reply.id} className="reply-card nested-reply">
                          <div className="comment-header">
                            <Link to={`/profile/${reply.user?.username || 'user'}`}>
                              <img
                                src={reply.user?.profile_pic_url || '/profile.png'}
                                alt={reply.user?.name}
                                className="comment-avatar"
                                onError={(e) => { e.target.src = '/profile.png'; }}
                              />
                            </Link>
                            <div className="comment-info">
                              <Link to={`/profile/${reply.user?.username || 'user'}`}>
                                <h4>{reply.user?.name || 'Anonymous'}</h4>
                              </Link>
                              <p className="comment-time">
                                {new Date(reply.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="comment-content">{reply.content}</div>
                          <button
                            onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                            className={`reply-btn ${replyingTo === reply.id ? 'active' : ''}`}
                          >
                            <FaReply /> Reply
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="comment-input-container">
            {replyingTo && (
              <div className="replying-indicator">
                <span>Replying to {comments.find(c => c.id === replyingTo)?.user?.name || 'user'}</span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="cancel-reply"
                >
                  <FaTimes />
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="comment-form">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={replyingTo ? "Write your reply..." : "Write a comment..."}
                disabled={isSubmitting}
                autoFocus
              />
              <button type="submit" disabled={!commentText.trim() || isSubmitting}>
                <FaPaperPlane />
              </button>
            </form>
            {error && <div className="comment-error">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;