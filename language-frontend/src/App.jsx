import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

import HomeLogin from './views/HomeLogin';
import Login from './views/Login';
import HomeAfterLogin from './views/HomeAfterLogin';
import CoursesPage from './views/CoursesPage';
import CoursePage from './views/CoursePage';
import BlogPage from './views/BlogPage';
import Register from './views/Register';
import About from './views/AboutUs';
import Contact from './views/ContactUs';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute'; // ✅ Import it

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomeLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ Public routes (redirect if logged in) */}
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

        {/* 🔐 Private routes */}
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
              <CoursesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/coursepage"
          element={
            <PrivateRoute>
              <CoursePage />
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
      </Routes>
    </Router>
    
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
