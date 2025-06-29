import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      localStorage.setItem("user", JSON.stringify(passedUser)); // Save for future
    } else if (localUser) {
      setUser(localUser);
    } else {
      navigate("/login"); // Redirect to login if no user is found
    }

    const isNewUser = location.state?.isNewUser;

    if (isNewUser === true) {
      setWelcomeMessage("🎉 Welcome to TalkTribe!");
    } else if (isNewUser === false) {
      setWelcomeMessage(`👋 Welcome back, ${localUser?.name || passedUser?.name || "User"}!`);
    }

    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 5000);

    setIsLoading(false);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  if (isLoading || !user || Object.keys(user).length === 0) {
    return <div className="loading-centered">Loading...</div>;
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
