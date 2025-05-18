import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/LoggedinHeader';
import SuccessStats from '../components/home/SuccessStats';
import AboutSection from '../components/home/AboutSection';
import BlogCTA from '../components/home/BlogCTA';
import CoursesSection from '../components/home/HomeCoursesSection';
import Testimonials from '../components/home/Testimonials';
import NewsSection from '../components/home/NewsSection';
import Footer from '../components/Footer';
import { toast } from "react-toastify";
import '../css/HomeLogin.css';

const HomeAfterLogin = () => {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getStoredUser = () => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage", err);
      return null;
    }
  };

  useEffect(() => {
    const passedUser = location.state?.user;
    const localUser = getStoredUser();

    if (passedUser) {
      setUser(passedUser);
      localStorage.setItem("user", JSON.stringify(passedUser)); // save for future
    } else if (localUser) {
      setUser(localUser);
    }

    const isNewUser = location.state?.isNewUser;

    // Set welcome message based on whether user is new or not
    if (isNewUser === true) {
      setWelcomeMessage("🎉 Welcome to TalkTribe!");
    } else if (isNewUser === false) {
      setWelcomeMessage(`👋 Welcome back, ${localUser?.name || passedUser?.name || "User"}!`);
    }

    // Auto-hide banner after 5 seconds
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);

    setIsLoading(false);
    return () => clearTimeout(timer);
  }, [location.state]);

  if (isLoading || !user || Object.keys(user).length === 0) {
    return <div className="homepage">Loading...</div>;
  }

  return (
    <div className="homepage">
      <Header welcomeMessage={welcomeMessage} showBanner={showBanner} />
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

export default HomeAfterLogin;
