import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/HomeLogin.css';
import api from '../../api/api';

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      try {
        const response = await api.get('/api/news/featured');
        if (response.data.success) {
          setNewsItems(response.data.data);
        } else {
          setError('Failed to fetch news');
        }
      } catch (error) {
        console.error('Error fetching featured news:', error);
        setError('Unable to load news at this time');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedNews();
  }, []);

  const handleNewsClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  if (loading) {
    return (
      <section className="news-section">
        <h2 className="news-title">Latest News and Resources</h2>
        <p className="news-subtitle">
          See the developments that have occurred to TalkTribe in the world.
        </p>
        <div className="loading-news">Loading news...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-section">
        <h2 className="news-title">Latest News and Resources</h2>
        <p className="news-subtitle">
          See the developments that have occurred to TalkTribe in the world.
        </p>
        <div className="news-error">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) {
    return (
      <section className="news-section">
        <h2 className="news-title">Latest News and Resources</h2>
        <p className="news-subtitle">
          See the developments that have occurred to TalkTribe in the world.
        </p>
        <div className="no-news">
          <p>No news articles available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section" data-aos="fade-up">
      <h2 className="news-title" data-aos="fade-right">Latest News and Resources</h2>
      <p className="news-subtitle" data-aos="fade-left">
        See the developments that have occurred to TalkTribe in the world.
      </p>
      <div className="news-layout">
        {/* Large News Card */}
        {newsItems[0] && (
          <div className="large-news-card" data-aos="zoom-in">
            {newsItems[0].image_url && (
              <img 
                src={newsItems[0].image_url} 
                alt={newsItems[0].title} 
                className="large-news-img" 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="large-news-content">
              <span className="news-tag">{newsItems[0].tag}</span>
              <h3 className="news-headline">{newsItems[0].title}</h3>
              <p className="news-description">{newsItems[0].description}</p>
              <button 
                className="news-read-more"
                onClick={() => handleNewsClick(newsItems[0].slug)}
              >
                Read more...
              </button>
            </div>
          </div>
        )}

        {/* Small News Cards */}
        <div className="small-news-grid">
          {newsItems.slice(1, 4).map((item, index) => (
            <div key={item.id || index} className="small-news-card" data-aos="fade-up">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="small-news-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="small-news-content">
                <span className="news-tag">{item.tag}</span>
                <h3 className="news-headline">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                <button 
                  className="news-read-more"
                  onClick={() => handleNewsClick(item.slug)}
                >
                  Read more...
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;