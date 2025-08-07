import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';
import api from '../api/api';
import '../css/BlogDetail.css';
import '../css/Blog.css';

import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import RelatedBlogSection from '../components/blog/RelatedBlogSection';
import CommentsSection from '../components/blog/CommentsSection';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/blog/posts/${id}`);
        setPost(response.data);
        setLiked(response.data.liked || false);
        setLikesCount(response.data.likes_count || 0);

        await api.post(`/api/blog/posts/${id}/view`);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await api.post(`/api/blog/posts/${id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likes_count);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!post) return <div className="not-found">Post not found</div>;

  return (
    <>
      <NewNavbar />

      <div className="blog-detail-container">
        <article className="blog-post-detail">
          <header className="post-header">
            <div className="author-info">
              <Link to={`/profile/${post.user?.username || 'user'}`} className="author-link">
                <img
                  src={post.user?.profile_pic_url || '/profile.png'}
                  alt={post.user?.name || 'Author'}
                  className="author-avatar"
                  onError={(e) => { e.target.src = '/profile.png'; }}
                />
              </Link>
              <div>
                <Link to={`/profile/${post.user?.username || 'user'}`} className="author-link">
                  <h3>{post.user?.name || 'Unknown Author'}</h3>
                </Link>
                <p className="post-meta">
                  {new Date(post.created_at).toLocaleDateString()} • {post.reading_time || '5 min'} read
                </p>
              </div>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-categories">
              {post.categories?.map(category => (
                <span key={category.id} className="category-tag">
                  {category.name}
                </span>
              ))}
            </div>
          </header>

          {post.video_url ? (
            <div className="post-featured-media">
              <video controls className="post-video">
                <source src={post.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : post.image_url ? (
            <div className="post-featured-media">
              <img
                src={post.image_url}
                alt={post.title}
                onError={(e) => { e.target.src = '/blog.jpg'; }}
              />
            </div>
          ) : null}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="post-footer">
            <div className="post-stats">
              <button
                className={`like-button ${liked ? 'liked' : ''}`}
                onClick={handleLike}
              >
                <FaThumbsUp /> {likesCount} Likes
              </button>
              <span><FaComment /> {post.comments_count || 0} Comments</span>
              <button className="share-button">
                <FaShare /> Share
              </button>
            </div>
          </div>

          <CommentsSection 
            postId={id} 
            initialComments={post.comments || []} 
          />
        </article>

        <aside className="blog-sidebar">
          <RelatedBlogSection currentPostId={id} />
        </aside>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetailPage;