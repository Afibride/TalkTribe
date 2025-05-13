import React from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import Navbar from '../components/Navbar';
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfoSection";
import ContactForm from "../components/contact/ContactFormSection";
import ContactCTA from "../components/contact/ContactCTA";
import "../css/ContactAndAbout.css";


function Contact() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div className="contact-page">
    <Navbar />
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactCTA />
    </div>
  );
}

export default Contact;
