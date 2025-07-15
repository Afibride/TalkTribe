import React, { useEffect, useState } from 'react';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import '../css/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulated fresh data with more variety & liveness
        const fakeNotifications = [
          {
            id: 1,
            title: '🎉 Welcome Aboard!',
            message: 'Your account is ready. Explore our new courses today!',
            date: '2025-07-10 08:45 AM',
            read: false,
          },
          {
            id: 2,
            title: '📝 Assignment Reminder',
            message: 'Your quiz on Basic Swahili is due tomorrow.',
            date: '2025-07-09 04:20 PM',
            read: false,
          },
          {
            id: 3,
            title: '✅ Course Completed',
            message: 'Congrats! You finished Hausa Beginner Level 1.',
            date: '2025-07-08 06:30 PM',
            read: true,
          },
          {
            id: 4,
            title: '📢 New Feature Alert',
            message: 'Dark Mode is now available. Check it in Settings!',
            date: '2025-07-07 11:00 AM',
            read: true,
          },
          {
            id: 5,
            title: '👥 New Follower',
            message: 'Jane Doe started following your language journey.',
            date: '2025-07-06 09:15 AM',
            read: false,
          },
        ];

        await new Promise(resolve => setTimeout(resolve, 700));

        setNotifications(fakeNotifications);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <div className="notifications-page">
        <NewNavbar />

        <div className="notifications-container">
          <h1>Notifications</h1>

          {loading && <p className="notif-loading">Loading notifications...</p>}

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {notifications.length === 0 ? (
                <p className="notif-empty">You’re all caught up! 🎉</p>
              ) : (
                <ul className="notifications-list">
                  {notifications.map(notif => (
                    <li
                      key={notif.id}
                      className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    >
                      <div className="notif-header">
                        <h3>{notif.title}</h3>
                        {!notif.read && <span className="notif-dot"></span>}
                      </div>
                      <p>{notif.message}</p>
                      <span className="notif-date">{notif.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Notifications;
