import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import '../../css/ContactAndAbout.css';

function ContactInfo() {
    return (
      <section className="contact-info-section" data-aos="fade-up">
        <div className="contact-box">
          <FaEnvelope className="contact-icon" />
          <h3>Email Us</h3>
          <p>support@talktribe.africa</p>
          <p>We reply within 24 hours.</p>
        </div>
        <div className="contact-box">
          <FaPhoneAlt className="contact-icon" />
          <h3>Call Us</h3>
          <p>+237 680 225 855</p>
          <p>Mon - Fri: 9am - 5pm</p>
        </div>
        <div className="contact-box">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Our Address</h3>
          <p>Bamenda, Cameroon</p>
          <p>We love visitors! Schedule a visit.</p>
        </div>
      </section>
    );
  }
  
  export default ContactInfo;