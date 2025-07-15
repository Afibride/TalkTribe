import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import api from '../../api/api';
import '../../css/Blog.css';

const RelatedBlogSection = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let response;
        if (currentPostId) {
          response = await api.get(`/api/blog/posts/${currentPostId}/related`);
        } else {
          try {
            response = await api.get('/api/blog/posts/popular?limit=4');
          } catch {
            response = await api.get('/api/blog/posts?limit=4');
          }
        }
        setRelatedPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPostId]);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!relatedPosts?.length) return null;

  return (
    <section className="related-blog-section">
      <div className="related-blog-header">
        <h2>{currentPostId ? 'Related Blogs' : 'Featured Blogs'}</h2>
        <Link to="/blog" className="see-all-link">See all</Link>
      </div>
      <div className="related-blog-grid">
        {relatedPosts.map((post) => (
          <div key={post.id} className="related-blog-card">
            <Link to={`/blog/${post.id}`} className="related-blog-link">
              <img 
                src={post.image_url || '/blog1.jpg'} 
                alt={post.title} 
                className="related-blog-image" 
                onError={(e) => e.target.src = '/blog1.jpg'}
              />
              <div className="related-blog-details">
                <h3>{post.title}</h3>
                <p className="related-blog-excerpt">
                  {post.content?.substring(0, 100).replace(/<\/?[^>]+(>|$)/g, "")}
                  {post.content?.length > 100 && '...'}
                </p>
                <div className="blog-stats">
                  <span><FaThumbsUp /> {post.likes_count || 0}</span>
                  <span><FaComment /> {post.comments_count || 0}</span>
                  <span><FaShare /> {post.shares_count || 0}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogSection;