import React from "react";
import '../../css/ContactAndAbout.css';

function ContactForm() {
    return (
      <section className="contact-form-section" data-aos="fade-up">
        <h2>Send Us a Message</h2>
        <p>Have questions, feedback, or ideas? We'd love to hear from you!</p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="Subject" />
          <textarea rows="5" placeholder="Your Message" required />
          <button className="send-btn" type="submit">Send Message</button>
        </form>
      </section>
    );
  }
  
  export default ContactForm;