// src/pages/SearchResults.jsx
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

  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => {
          setResults(res.data);
        })
        .catch(err => {
          setResults(null);
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const isEmpty =
    results &&
    (!results.courses?.length &&
      !results.lessons?.length &&
      !results.users?.length);

  return (
    <>
      <NewNavbar />
      <div className="search-results-page">
        <h2>Results for "{query}"</h2>
        {loading && <p>Loading...</p>}
        {!loading && results && (
          <div>
            {results.courses?.length > 0 && (
              <>
                <h3>Courses</h3>
                <ul>
                  {results.courses.map(c => (
                    <li key={c.id} className="search-result-card">
                      <Link to={`/courses/${c.id}/lessons`} className="result-title">{c.title}</Link>
                      <p className="result-description">{c.description?.slice(0, 100)}{c.description?.length > 100 ? '...' : ''}</p>
                      <div className="result-meta">
                        <span>Lessons: {c.total_lessons ?? 'N/A'}</span>
                        <span>Created: {c.created_at?.slice(0,10)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {results.lessons?.length > 0 && (
              <>
                <h3>Lessons</h3>
                <ul>
                  {results.lessons.map(l => (
                    <li key={l.id} className="search-result-card">
                      <Link to={`/lesson/${l.id}`} className="result-title">{l.title}</Link>
                      <p className="result-description">{l.description?.slice(0, 100)}{l.description?.length > 100 ? '...' : ''}</p>
                      <div className="result-meta">
                        <span>Course: {l.course_title ?? 'N/A'}</span>
                        <span>Created: {l.created_at?.slice(0,10)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {results.users?.length > 0 && (
              <>
                <h3>Users</h3>
                <ul>
                  {results.users.map(u => (
                    <li key={u.id} className="search-result-card">
                      <Link to={`/profile/${u.id}`} className="result-title">{u.name}</Link>
                      <div className="result-meta">
                        <span>Username: {u.username}</span>
                        <span>Email: {u.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {isEmpty && <p>No results found.</p>}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;
