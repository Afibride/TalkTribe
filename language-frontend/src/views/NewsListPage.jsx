import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import BlogNavbar from '../components/blog/BlogNavbar';
import Footer from '../components/Footer';
import '../css/NewsListPage.css';
import api from '../api/api';

const NewsListPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    const fetchNews = async () => {
      try {
        const params = {
          page: currentPage,
          per_page: 12,
          search: searchTerm,
          tag: selectedTag
        };

        const response = await api.get('/api/news', { params });
        setNews(response.data.data.data);
        setTotalPages(response.data.data.last_page);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await api.get('/news/tags');
        setTags(response.data.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchNews();
    fetchTags();
  }, [currentPage, searchTerm, selectedTag]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagFilter = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };

  return (
    <>
      {isLoggedIn ? (
        <>
          <NewNavbar />
          <BlogNavbar activeTab="news" setActiveTab={() => {}} />
        </>
      ) : (
        <Navbar />
      )}
      <main className="news-list-main">
      <div className="news-list-page">
        <div className="news-list-header">
          <h1>News & Resources</h1>
          <p>Stay updated with the latest developments at TalkTribe</p>
        </div>

        <div className="news-filters">
          <form onSubmit={handleSearch} className="news-search">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="news-tags">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-news">Loading news...</div>
        ) : (
          <>
            <div className="news-grid">
              {news.map((item) => (
                <div key={item.id} className="news-grid-item">
                  <Link to={`/news/${item.slug}`} className="news-item-link">
                    <img 
                      src={item.image_url || "/culture1.jpg"} 
                      alt={item.title}
                      className="news-grid-image"
                      onError={(e) => {
                        e.target.src = '/culture1.jpg'; 
                      }}
                    />
                    <div className="news-grid-content">
                      <span className="news-tag">{item.tag}</span>
                      <h3 className="news-grid-title">{item.title}</h3>
                      <p className="news-grid-description">{item.description}</p>
                      <div className="news-grid-meta">
                        <span className="news-date">
                          {new Date(item.published_at).toLocaleDateString()}
                        </span>
                        <span className="news-views">{item.views} views</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="news-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
        </main>
      <Footer />
    </>
  );
};

export default NewsListPage;