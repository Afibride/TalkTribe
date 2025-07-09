import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaComment, FaShare, FaPaperPlane } from "react-icons/fa";
import "../../css/Blog.css";

const BlogPost = ({ post, onLike, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [localPost, setLocalPost] = useState({
    ...post,
    comments: post.comments || [],
    showComments: false,
  });
  const [isCommenting, setIsCommenting] = useState(false);

  const toggleComments = () => {
    setLocalPost((prev) => ({
      ...prev,
      showComments: !prev.showComments,
    }));
  };

const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsCommenting(true);
    try {
        const success = await onAddComment(localPost.id, commentText);
        if (success) {
            setCommentText("");
            setLocalPost(prev => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    comments: (prev.stats.comments || 0) + 1
                }
            }));
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    } finally {
        setIsCommenting(false);
    }
};

  const handleLike = async () => {
    try {
      await onLike(localPost.id);
      setLocalPost((prev) => ({
        ...prev,
        liked: !prev.liked,
        stats: {
          ...prev.stats,
          likes: prev.liked
            ? (prev.stats.likes || 0) - 1
            : (prev.stats.likes || 0) + 1,
        },
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const getImageUrl = () => {
    if (localPost.content?.image) {
      return localPost.content.image;
    }
    return "/blog.jpg";
  };

  return (
    <div className="blog-post">
      <div className="post-header">
        <img
          src={localPost.author?.avatar || "/profile.png"}
          alt={localPost.author?.name || "Author"}
          className="author-avatar"
          onError={(e) => (e.target.src = "/profile.png")}
        />
        <div className="author-info">
          <h3>{localPost.author?.name || "Unknown Author"}</h3>
          <p>
            {localPost.author?.role || "User"} •{" "}
            {localPost.timestamp || "Recently"}
          </p>
        </div>
      </div>

      <div className="post-content">
        <Link to={`/blog/${localPost.id}`} className="post-title-link">
          <h2 className="post-title">{localPost.title}</h2>
        </Link>
        <p className="post-excerpt">
          {localPost.content?.text?.substring(0, 200)}...
          <Link to={`/blog/${localPost.id}`} className="read-more">
            read more
          </Link>
        </p>
        {localPost.content?.image && (
          <Link to={`/blog/${localPost.id}`} className="post-image-link">
            <div className="post-image-container">
              <img
                src={getImageUrl()}
                alt="Post"
                className="post-image"
                onError={(e) => (e.target.src = "/blog.jpg")}
              />
            </div>
          </Link>
        )}
      </div>

      <div className="post-stats">
        <span>{localPost.stats?.likes || 0} likes</span>
        <span>{localPost.stats?.comments || 0} comments</span>
        <span>{localPost.stats?.shares || 0} shares</span>
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
          onClick={toggleComments}
        >
          <span className="desktop-text">Comment</span>
          <FaComment className="mobile-icon" />
        </button>
        <button className="action-button" aria-label="Share">
          <span className="desktop-text">Share</span>
          <FaShare className="mobile-icon" />
        </button>
      </div>

      {localPost.showComments && (
        <div className="comments-section">
          {(localPost.comments || []).map((comment) => (
            <div key={comment.id} className="comment">
              <img
                src={comment.user?.avatar || "/profile.png"}
                alt={comment.user?.name || "Commenter"}
                className="comment-avatar"
                onError={(e) => (e.target.src = "/profile.png")}
              />
              <div className="comment-content">
                <h4>{comment.user?.name || "Anonymous"}</h4>
                <p>{comment.content || ""}</p>
                <span className="comment-time">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
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
              disabled={isCommenting}
              aria-label="Comment input"
            />
            <button
              type="submit"
              className="send-button"
              disabled={!commentText.trim() || isCommenting}
              aria-label="Submit comment"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
