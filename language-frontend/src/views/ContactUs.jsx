import React, { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from '../components/Navbar';
import NewNavbar from '../components/Navbar1';
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfoSection";
import ContactForm from "../components/contact/ContactFormSection";
import ContactCTA from "../components/contact/ContactCTA";
import "../css/ContactAndAbout.css";
import Footer from "../components/Footer";

function Contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="contact-page">
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactCTA />
      <Footer />
    </div>
  );
}

export default Contact;