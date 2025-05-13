import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS
import HomeLogin from './views/HomeLogin'; // Import HomeLogin page
import Login from './views/Login'; // Import Login page
import HomeAfterLogin from './views/HomeAfterLogin'; // Import HomeAfterLogin page
import CoursesPage from './views/CoursesPage'; // Import CoursesPage
import CoursePage from './views/CoursePage'; // Import CoursePage
import BlogPage from './views/BlogPage'; // Import BlogPage
import Register from './views/Register';
import About from './views/AboutUs'; // Import AboutUs page
import Contact from './views/ContactUs'; // Import ContactUs page

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLogin />} /> {/* Home page */}
        <Route path="/login" element={<Login />} /> {/* Login page */}
        <Route path="/home-after-login" element={<HomeAfterLogin />} /> {/* Home after login */}
        <Route path="/local-languages" element={<CoursesPage />} /> {/* Map CoursesPage */}
        <Route path="/coursepage" element={<CoursePage />} /> {/* Added CoursePage route */}
        <Route path="/blog" element={<BlogPage/>} /> {/* Placeholder for Blog page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/about" element={<About/>} /> {/* Placeholder for About page */}
        <Route path="/contact" element={<Contact/>} /> {/* Placeholder for Contact page */}
      </Routes>
    </Router>
  );
}

export default App;
