import React from 'react';
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
