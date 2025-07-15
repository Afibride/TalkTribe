import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPost from './BlogPost';
import api from '../../api/api';
import '../../css/Blog.css';

const BlogPostsSection = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/blog/posts?page=${page}`);
        const newPosts = response.data.data || response.data;
        
        setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts]);
        setHasMore(newPosts.length > 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [refresh, page]);

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/api/blog/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId ? {
          ...post,
          liked: response.data.liked,
          likes_count: response.data.likes_count
        } : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async (postId, commentText, parentId = null) => {
    try {
      const response = await api.post(`/api/blog/posts/${postId}/comment`, {
        content: commentText,
        parent_id: parentId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      setPosts(posts.map(post => 
        post.id === postId ? {
          ...post,
          comments: parentId 
            ? post.comments.map(comment => 
                comment.id === parentId
                  ? { 
                      ...comment, 
                      replies: [response.data.comment, ...(comment.replies || [])],
                      replies_count: (comment.replies_count || 0) + 1
                    }
                  : comment
              )
            : [response.data.comment, ...(post.comments || [])],
          comments_count: (post.comments_count || 0) + 1
        } : post
      ));
      
      return response.data.comment;
    } catch (err) {
      console.error('Error adding comment:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to add comment');
      return null;
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!posts.length) return <div className="no-posts">No blog posts found</div>;

  return (
    <div className="blog-posts-section">
      {posts.map(post => (
        <BlogPost 
          key={post.id}
          post={{
            ...post,
            content: {
              text: post.content,
              image: post.image_url 
            },
            author: {
              name: post.user?.name || 'Anonymous',
              username: post.user?.username || 'user',
              profile_pic_url: post.user?.profile_pic_url || '/profile.png',
              role: post.user?.role || 'Language Enthusiast'
            },
            stats: {
              likes: post.likes_count || 0,
              comments: post.comments_count || 0,
              shares: post.shares_count || 0
            },
            liked: post.liked || false,
            comments: post.comments || []
          }}
          onLike={handleLike}
          onAddComment={handleAddComment}
          showEditOptions={post.user?.id === parseInt(localStorage.getItem('userId'))}
        />
      ))}
      
      {hasMore && (
        <button 
          onClick={loadMore} 
          className="load-more-btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Show More'}
        </button>
      )}
    </div>
  );
};

export default BlogPostsSection;