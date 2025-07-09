import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/api';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import '../css/SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      api.get(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => {
          setResults(res.data);
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to fetch search results');
          setResults(null);
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const isEmpty = results && 
    (!results.courses?.length &&
     !results.lessons?.length &&
     !results.users?.length &&
     !results.blog_posts?.length);

  return (
    <>
      <NewNavbar />
      <div className="search-results-page">
        <h2>Search Results for "{query}"</h2>
        
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && results && (
          <div className="results-container">
            {/* Blog Posts Results */}
            {results.blog_posts?.length > 0 && (
              <section className="results-section">
                <h3>Blog Posts</h3>
                <div className="results-grid">
                  {results.blog_posts.map(post => (
                    <div key={post.id} className="search-result-card blog-result">
                      <Link to={`/blog/${post.id}`} className="result-title">
                        {post.title}
                      </Link>
                      {post.image_url && (
                        <div className="blog-image-container">
                          <img 
                            src={post.image_url} 
                            alt={post.title}
                            className="blog-result-image"
                            onError={(e) => {
                              e.target.src = '/blog-placeholder.jpg';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      )}
                      <p className="result-excerpt">{post.excerpt}</p>
                      <div className="result-meta">
                        <span>By: {post.user?.name || 'Unknown author'}</span>
                        <span>❤️ {post.likes_count || 0} likes</span>
                        <span>💬 {post.comments_count || 0} comments</span>
                      </div>
                      {post.categories?.length > 0 && (
                        <div className="blog-categories">
                          {post.categories.map(category => (
                            <span key={category.id} className="category-tag">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Courses Results */}
            {results.courses?.length > 0 && (
              <section className="results-section">
                <h3>Courses</h3>
                <ul className="results-list">
                  {results.courses.map(course => (
                    <li key={course.id} className="search-result-card">
                      <Link to={`/courses/${course.id}/lessons`} className="result-title">
                        {course.title}
                      </Link>
                      <p className="result-description">
                        {course.description?.slice(0, 100)}
                        {course.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="result-meta">
                        <span>Lessons: {course.total_lessons ?? 'N/A'}</span>
                        <span>Created: {new Date(course.created_at).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Lessons Results */}
            {results.lessons?.length > 0 && (
              <section className="results-section">
                <h3>Lessons</h3>
                <ul className="results-list">
                  {results.lessons.map(lesson => (
                    <li key={lesson.id} className="search-result-card">
                      <Link to={`/lesson/${lesson.id}`} className="result-title">
                        {lesson.title}
                      </Link>
                      <p className="result-description">
                        {lesson.description?.slice(0, 100)}
                        {lesson.description?.length > 100 ? '...' : ''}
                      </p>
                      <div className="result-meta">
                        <span>Course: {lesson.course_title ?? 'N/A'}</span>
                        <span>Created: {new Date(lesson.created_at).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Users Results */}
            {results.users?.length > 0 && (
              <section className="results-section">
                <h3>Users</h3>
                <div className="user-results-grid">
                  {results.users.map(user => (
                    <div key={user.id} className="search-result-card user-result">
                      <Link to={`/profile/${user.id}`} className="user-profile-link">
                        <img 
                          src={user.avatar || '/profile-placeholder.png'} 
                          alt={user.name}
                          className="user-avatar"
                          onError={(e) => {
                            e.target.src = '/profile-placeholder.png';
                            e.target.onerror = null;
                          }}
                        />
                        <div className="user-info">
                          <h4 className="result-title">{user.name}</h4>
                          <p className="username">@{user.username}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isEmpty && (
              <div className="no-results">
                <p>No results found for "{query}"</p>
                <p>Try different keywords or check your spelling.</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;