import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Views
import HomeLogin from './views/HomeLogin';
import Login from './views/Login';
import HomeAfterLogin from './views/HomeAfterLogin';
import CoursesPage from './views/CoursesPage';
import LessonsPage from './views/Lessons';
import BlogPage from './views/BlogPage';
import Register from './views/Register';
import About from './views/AboutUs';
import Contact from './views/ContactUs';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import FeaturesPage from './views/FeaturesPage';
import SearchResults from './views/SearchResults';
import QuizzesPage from './views/QuizzesPage';
import BlogDetailPage from './views/BlogDetailPage';

// Components
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Notifications from './views/Notifications';
import ProfilePage from './views/ProfilePage';
import TestimonialsPage from './views/TestimonialsPage';


function App() {
  // Initialize animation library
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true // Animations only happen once
    });
  }, []);

  // State for refreshing course data when progress updates
  const [refreshKey, setRefreshKey] = useState(0);

  // Handler for progress updates that triggers refresh
  const handleProgressUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes (always accessible) */}
          <Route path="/" element={<HomeLogin />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />

          {/* Public routes (redirect if logged in) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Private routes (require authentication) */}
          <Route
            path="/home-after-login"
            element={
              <PrivateRoute>
                <HomeAfterLogin />
              </PrivateRoute>
            }
          />
          <Route
            path="/local-languages"
            element={
              <PrivateRoute>
                <CoursesPage 
                  refreshKey={refreshKey} 
                  onProgressUpdate={handleProgressUpdate} 
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/lessons"
            element={
              <PrivateRoute>
                <LessonsPage onProgressUpdate={handleProgressUpdate} />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/lessons/:lessonId"
            element={
              <PrivateRoute>
                <LessonsPage onProgressUpdate={handleProgressUpdate} />
              </PrivateRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <PrivateRoute>
                <BlogPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses/:id/quizzes"
            element={
              <PrivateRoute>
                <QuizzesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/blog/:id"
            element={
              <PrivateRoute>
                <BlogDetailPage />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;