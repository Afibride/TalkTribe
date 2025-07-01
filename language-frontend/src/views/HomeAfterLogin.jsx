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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndInitialize = async () => {
      try {
        // Check for user in both location state and localStorage
        const savedUser = localStorage.getItem("user");
        const localUser = savedUser ? JSON.parse(savedUser) : null;
        const passedUser = location.state?.user;

        if (!localUser && !passedUser) {
          // If no user found, redirect to login
          toast.warn("Please login to continue");
          navigate("/login", { replace: true });
          return;
        }

        // Use passed user if available, otherwise fall back to local user
        const currentUser = passedUser || localUser;
        setUser(currentUser);

        // Set welcome message based on whether user is new
        const isNewUser = location.state?.isNewUser;
        if (isNewUser === true) {
          setWelcomeMessage(`🎉 Welcome to TalkTribe, ${currentUser?.name || "User"}!`);
        } else if (isNewUser === false) {
          setWelcomeMessage(`👋 Welcome back, ${currentUser?.name || "User"}!`);
        } else {
          // Default welcome if isNewUser isn't specified
          setWelcomeMessage(`👋 Welcome, ${currentUser?.name || "User"}!`);
        }

        // Auto-hide welcome banner after 5 seconds
        const timer = setTimeout(() => {
          setShowBanner(false);
        }, 5000);

        setIsLoading(false);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Initialization error:", err);
        toast.error("Failed to load user data");
        navigate("/login", { replace: true });
      }
    };

    checkAuthAndInitialize();
  }, [location.state, navigate]);

  // Show loading screen while checking auth and initializing
  if (isLoading || !user) {
    return (
      <div className="loading-centered">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Header welcomeMessage={welcomeMessage} showBanner={showBanner} user={user} />
      <SuccessStats />
      <AboutSection />
      <BlogCTA />
      <CoursesSection user={user} />
      <Testimonials />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default HomeAfterLogin;