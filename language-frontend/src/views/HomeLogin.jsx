import React, { useEffect, useRef } from 'react'; // useRef added
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import SuccessStats from '../components/home/SuccessStats';
import AboutSection from '../components/home/AboutSection';
import BlogCTA from '../components/home/BlogCTA';
import CoursesSection from '../components/home/HomeCoursesSection';
import Testimonials from '../components/home/Testimonials';
import NewsSection from '../components/home/NewsSection';
import Footer from '../components/Footer';
import '../css/HomeLogin.css';

const HomeLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasShownToast = useRef(false); // 👈 guard against double rendering

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate('/home-after-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.toastMessage && !hasShownToast.current) {
      toast.success(location.state.toastMessage);
      hasShownToast.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="homepage">
      <Header />
      <SuccessStats />
      <AboutSection />
      <BlogCTA />
      <CoursesSection />
      <Testimonials />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default HomeLogin;
