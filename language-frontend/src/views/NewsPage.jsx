import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import '../css/NewsPage.css';
import api from '../api/api';

const NewsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        
        const newsResponse = await api.get(`/api/news/${slug}`);
        setNews(newsResponse.data.data);
        
        // Fetch related news based on the same tag
        if (newsResponse.data.data.tag) {
          try {
            const relatedResponse = await api.get(`/api/news?tag=${newsResponse.data.data.tag}&per_page=3`);
            if (relatedResponse.data.success) {

              const filteredRelated = relatedResponse.data.data.data.filter(
                item => item.slug !== slug
              );
              setRelatedNews(filteredRelated.slice(0, 3)); 
            }
          } catch (relatedError) {
            console.error('Error fetching related news:', relatedError);
            const featuredResponse = await api.get('/api/news/featured');
            if (featuredResponse.data.success) {
              const filteredFeatured = featuredResponse.data.data.filter(
                item => item.slug !== slug
              );
              setRelatedNews(filteredFeatured.slice(0, 3));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('News article not found');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [slug]);

  const handleRelatedNewsClick = (relatedSlug) => {
    navigate(`/news/${relatedSlug}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <>
        {isLoggedIn ? <NewNavbar /> : <Navbar />}
        <div className="news-page-loading">Loading news article...</div>
        <Footer />
      </>
    );
  }

  if (error || !news) {
    return (
      <>
        {isLoggedIn ? <NewNavbar /> : <Navbar />}
        <div className="news-page-error">
          <h2>Article Not Found</h2>
          <p>{error || 'The requested news article could not be found.'}</p>
          <Link to="/news" className="back-to-news">Back to News</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <main className="news-main">
      <div className="news-page">
        <div className="news-page-header">
          <Link to="/news" className="back-to-news">
            ← Back to News
          </Link>
          <span className="news-views">{news.views} views</span>
        </div>

        <article className="news-article">
          <header className="news-article-header">
            <span className="news-tag">{news.tag}</span>
            <h1 className="news-article-title">{news.title}</h1>
            <p className="news-article-description">{news.description}</p>
            <div className="news-meta">
              {news.author && <span className="news-author">By {news.author}</span>}
              <span className="news-date">
                Published on {new Date(news.published_at).toLocaleDateString()}
              </span>
            </div>
          </header>

          {news.image_url && (
            <div className="news-article-image">
              <img 
                src={news.image_url} 
                alt={news.title} 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="news-article-content">
            {news.content ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              <p>Content coming soon...</p>
            )}
          </div>
        </article>

        {/* Related News Section */}
        {relatedNews.length > 0 && (
          <div className="related-news-section">
            <h2 className="related-news-title">Related Articles</h2>
            <div className="related-news-grid">
              {relatedNews.map((relatedArticle) => (
                <div 
                  key={relatedArticle.id} 
                  className="related-news-card"
                  onClick={() => handleRelatedNewsClick(relatedArticle.slug)}
                >
                  {relatedArticle.image_url && (
                    <img 
                      src={relatedArticle.image_url} 
                      alt={relatedArticle.title}
                      className="related-news-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="related-news-content">
                    <span className="news-tag">{relatedArticle.tag}</span>
                    <h3 className="related-news-headline">{relatedArticle.title}</h3>
                    <p className="related-news-description">
                      {relatedArticle.description.length > 100 
                        ? `${relatedArticle.description.substring(0, 100)}...`
                        : relatedArticle.description
                      }
                    </p>
                    <button 
                      className="news-read-more"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRelatedNewsClick(relatedArticle.slug);
                      }}
                    >
                      Read more...
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="news-page-footer">
          <Link to="/news" className="back-to-news">
            ← Back to All News
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
};
export default NewsPage;