import React, { useState } from "react";
import '../../css/ContactAndAbout.css';

function ContactForm() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  
    const [submitStatus, setSubmitStatus] = useState(null);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setTimeout(() => setSubmitStatus(null), 5000);
    };

    return (
      <div className="form-container">
        <div className="form-header">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and our team will get back to you within 24 hours</p>
        </div>
        
        {submitStatus === "success" && (
          <div className="alert alert-success">
            Thank you! Your message has been sent successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn-submit">
            Send Message
          </button>
        </form>
      </div>
    );
}

export default ContactForm;