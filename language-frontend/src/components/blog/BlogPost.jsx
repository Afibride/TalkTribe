import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CommentsSection from "./CommentsSection";
import "../../css/Blog.css";
import '../../css/BlogDetail.css';

const BlogPost = ({ 
  post, 
  onLike, 
  onAddComment, 
  onEdit, 
  onDelete,
  showEditOptions 
}) => {
  const safePost = {
    id: post?.id || '',
    title: post?.title || '',
    content: {
      text: post?.content?.text || '',
      image: post?.content?.image || null
    },
    author: {
      name: post?.author?.name || 'Unknown Author',
      username: post?.author?.username || 'user',
      profile_pic_url: post?.author?.profile_pic_url || '/profile.png',
      role: post?.author?.role || 'User'
    },
    stats: {
      likes: post?.stats?.likes || 0,
      comments: post?.stats?.comments || 0,
      shares: post?.stats?.shares || 0
    },
    liked: post?.liked || false,
    comments: post?.comments || [],
    timestamp: post?.timestamp || 'Recently'
  };

  const [localPost, setLocalPost] = useState({
    ...safePost,
    showComments: false,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(safePost.content.text);
  const [showOptions, setShowOptions] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const CHAR_LIMIT = 200;
  const isContentLong = safePost.content.text.length > CHAR_LIMIT;

  const toggleComments = () => {
    setLocalPost((prev) => ({
      ...prev,
      showComments: !prev.showComments,
    }));
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onLike(localPost.id);
      setLocalPost((prev) => ({
        ...prev,
        liked: !prev.liked,
        stats: {
          ...prev.stats,
          likes: prev.liked
            ? prev.stats.likes - 1
            : prev.stats.likes + 1,
        },
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(!isEditing);
    setShowOptions(false);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onEdit(localPost.id, editedContent);
      setLocalPost(prev => ({
        ...prev,
        content: {
          ...prev.content,
          text: editedContent
        }
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edit:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await onDelete(localPost.id);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleCommentAdded = (newComment, parentId = null) => {
    setLocalPost(prev => {
      if (parentId) {
        const updatedComments = prev.comments.map(comment => 
          comment.id === parentId
            ? { 
                ...comment, 
                replies: [newComment, ...(comment.replies || [])],
                replies_count: (comment.replies_count || 0) + 1
              }
            : comment
        );
        return {
          ...prev,
          comments: updatedComments,
          stats: {
            ...prev.stats,
            comments: prev.stats.comments + 1
          }
        };
      } else {
        return {
          ...prev,
          comments: [newComment, ...prev.comments],
          stats: {
            ...prev.stats,
            comments: prev.stats.comments + 1
          }
        };
      }
    });
  };

  return (
    <div className="blog-post">
      <div className="post-header">
        <Link to={`/profile/${localPost.author.username}`} className="author-link">
          <img
            src={localPost.author.profile_pic_url}
            alt={localPost.author.name}
            className="author-avatar"
            onError={(e) => (e.target.src = "/profile.png")}
          />
        </Link>
        <div className="author-info">
          <Link to={`/profile/${localPost.author.username}`} className="author-link">
            <h3>{localPost.author.name}</h3>
          </Link>
          <p>
            {localPost.author.role} • {localPost.timestamp}
          </p>
        </div>
        
        {showEditOptions && (
          <div className="post-options">
            <button 
              className="options-toggle" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
            >
              <FaEllipsisH />
            </button>
            
            {showOptions && (
              <div className="options-dropdown">
                <button onClick={handleEditToggle}>
                  <FiEdit /> Edit
                </button>
                <button onClick={handleDelete}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Link to={`/blog/${localPost.id}`} className="post-content-link">
        <div className="post-content">
          {isEditing ? (
            <>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="edit-post-textarea"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="edit-actions">
                <button 
                  onClick={handleEditSave} 
                  className="save-edit-btn"
                >
                  Save
                </button>
                <button 
                  onClick={handleEditToggle} 
                  className="cancel-edit-btn"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="post-title">{localPost.title}</h2>
              <div className="post-excerpt-container">
                <p className="post-excerpt">
                  {expanded 
                    ? localPost.content.text 
                    : localPost.content.text.substring(0, CHAR_LIMIT)}
                  {isContentLong && !expanded && '... '}
                </p>
                {isContentLong && !expanded && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpanded(true);
                    }}
                    className="read-more-btn"
                  >
                    Read More
                  </button>
                )}
                {expanded && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setExpanded(false);
                    }}
                    className="read-less-btn"
                  >
                    Read Less
                  </button>
                )}
              </div>
              {localPost.content.image && (
                <div className="post-image-container">
                  <img
                    src={localPost.content.image}
                    alt="Post"
                    className="post-image"
                    onError={(e) => (e.target.src = "/blog.jpg")}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      <div className="post-stats">
        <span>{localPost.stats.likes} likes</span>
        <span>{localPost.stats.comments} comments</span>
        <span>{localPost.stats.shares} shares</span>
      </div>

      <div className="post-actions">
        <button
          className={`action-button ${localPost.liked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label={localPost.liked ? "Unlike post" : "Like post"}
        >
          <span className="desktop-text">
            {localPost.liked ? "Liked" : "Like"}
          </span>
          <FaThumbsUp className="mobile-icon" />
        </button>
        <button
          className="action-button"
          aria-label="Comment"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleComments();
          }}
        >
          <span className="desktop-text">Comment</span>
          <FaComment className="mobile-icon" />
        </button>
        <button 
          className="action-button" 
          aria-label="Share"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <span className="desktop-text">Share</span>
          <FaShare className="mobile-icon" />
        </button>
      </div>

      {localPost.showComments && (
        <CommentsSection 
          postId={localPost.id}
          initialComments={localPost.comments}
          onAddComment={async (commentText, parentId) => {
            try {
              const newComment = await onAddComment(localPost.id, commentText, parentId);
              if (newComment) {
                handleCommentAdded(newComment, parentId);
                return true;
              }
              return false;
            } catch (error) {
              console.error("Error adding comment:", error);
              return false;
            }
          }}
        />
      )}
    </div>
  );
};

export default BlogPost;