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
  const [activeTab, setActiveTab] = useState('all');

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

  // Count results for each category
  const resultCounts = {
    all: (results?.blog_posts?.length || 0) + 
         (results?.courses?.length || 0) + 
         (results?.lessons?.length || 0) + 
         (results?.users?.length || 0),
    posts: results?.blog_posts?.length || 0,
    courses: results?.courses?.length || 0,
    lessons: results?.lessons?.length || 0,
    users: results?.users?.length || 0
  };

  return (
    <>
      <NewNavbar />
      <div className="search-results-page">
        <div className="search-results-header">
          <h2>Search Results for "{query}"</h2>
          {!isEmpty && !loading && !error && (
            <div className="results-count">
              {resultCounts.all} {resultCounts.all === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>
        
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        {!loading && !error && results && (
          <div className="results-container">
            {/* Results Tabs */}
            <div className="results-tabs">
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({resultCounts.all})
              </button>
              {resultCounts.posts > 0 && (
                <button
                  className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('posts')}
                >
                  Posts ({resultCounts.posts})
                </button>
              )}
              {resultCounts.courses > 0 && (
                <button
                  className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  Courses ({resultCounts.courses})
                </button>
              )}
              {resultCounts.lessons > 0 && (
                <button
                  className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
                  onClick={() => setActiveTab('lessons')}
                >
                  Lessons ({resultCounts.lessons})
                </button>
              )}
              {resultCounts.users > 0 && (
                <button
                  className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  Users ({resultCounts.users})
                </button>
              )}
            </div>

            {/* Blog Posts Results */}
            {(activeTab === 'all' || activeTab === 'posts') && results.blog_posts?.length > 0 && (
              <section className="results-section">
                <h3>Blog Posts</h3>
                <div className="results-grid">
                  {results.blog_posts.map(post => (
                    <div key={post.id} className="search-result-card blog-result">
                      <Link to={`/blog/${post.id}`} className="result-title">
                        {post.title}
                      </Link>
                      <div className="blog-content-wrapper">
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
                        <div className="blog-text-content">
                          <p className="result-excerpt">
                            {post.excerpt || post.content?.substring(0, 150)}
                            {post.content?.length > 150 && '...'}
                          </p>
                          <div className="result-meta">
                            <span className="author">
                              <img 
                                src={post.user?.profile_pic_url || '/profile-placeholder.png'} 
                                alt={post.user?.name}
                                className="author-avatar"
                              />
                              {post.user?.name || 'Unknown author'}
                            </span>
                            <div className="engagement-metrics">
                              <span>
                                <i className="fas fa-heart"></i> {post.likes_count || 0}
                              </span>
                              <span>
                                <i className="fas fa-comment"></i> {post.comments_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
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
            {(activeTab === 'all' || activeTab === 'courses') && results.courses?.length > 0 && (
              <section className="results-section">
                <h3>Courses</h3>
                <div className="results-grid">
                  {results.courses.map(course => (
                    <div key={course.id} className="search-result-card course-result">
                      <div className="course-content-wrapper">
                        {course.image_url && (
                          <div className="course-image-container">
                            <img 
                              src={course.image_url} 
                              alt={course.title}
                              className="course-result-image"
                              onError={(e) => {
                                e.target.src = '/course-placeholder.jpg';
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                        )}
                        <div className="course-text-content">
                          <Link to={`/courses/${course.id}/lessons`} className="result-title">
                            {course.title}
                          </Link>
                          <p className="result-description">
                            {course.description?.slice(0, 150)}
                            {course.description?.length > 150 && '...'}
                          </p>
                          <div className="result-meta">
                            <span>
                              <i className="fas fa-book"></i> {course.total_lessons || 0} lessons
                            </span>
                            <span>
                              <i className="fas fa-user"></i> {course.enrolled_count || 0} learners
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="course-level">
                        <span className={`level-tag ${course.level?.toLowerCase()}`}>
                          {course.level || 'All levels'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lessons Results */}
            {(activeTab === 'all' || activeTab === 'lessons') && results.lessons?.length > 0 && (
              <section className="results-section">
                <h3>Lessons</h3>
                <div className="results-list">
                  {results.lessons.map(lesson => (
                    <div key={lesson.id} className="search-result-card lesson-result">
                      <Link 
                        to={`/courses/${lesson.course_id}/lesson/${lesson.id}`} 
                        className="result-title"
                      >
                        {lesson.title}
                      </Link>
                      <p className="result-description">
                        {lesson.description?.slice(0, 150)}
                        {lesson.description?.length > 150 && '...'}
                      </p>
                      <div className="result-meta">
                        <span>
                          <i className="fas fa-book"></i> Part of: 
                          <Link to={`/courses/${lesson.course_id}/lessons`}>
                            {lesson.course_title || 'Unknown course'}
                          </Link>
                        </span>
                        <span>
                          <i className="fas fa-clock"></i> {lesson.duration || 'N/A'} min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Users Results */}
            {(activeTab === 'all' || activeTab === 'users') && results.users?.length > 0 && (
              <section className="results-section">
                <h3>Users</h3>
                <div className="user-results-grid">
                  {results.users.map(user => (
                    <div key={user.id} className="search-result-card user-result">
                      <Link to={`/profile/${user.username}`} className="user-profile-link">
                        <img 
                          src={user.profile_pic_url || '/profile-placeholder.png'} 
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
                          {user.bio && (
                            <p className="user-bio">
                              {user.bio.slice(0, 100)}
                              {user.bio.length > 100 && '...'}
                            </p>
                          )}
                        </div>
                      </Link>
                      <div className="user-stats">
                        <span>
                          <i className="fas fa-book"></i> {user.courses_count || 0}
                        </span>
                        <span>
                          <i className="fas fa-pencil-alt"></i> {user.posts_count || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {isEmpty && (
              <div className="no-results">
                <div className="no-results-icon">
                  <i className="fas fa-search"></i>
                </div>
                <h3>No results found for "{query}"</h3>
                <p>Try different keywords or check your spelling.</p>
                <div className="search-tips">
                  <h4>Search Tips:</h4>
                  <ul>
                    <li>Try more general keywords</li>
                    <li>Check your spelling</li>
                    <li>Use fewer words</li>
                  </ul>
                </div>
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