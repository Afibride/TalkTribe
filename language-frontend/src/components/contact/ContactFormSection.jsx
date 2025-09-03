import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/ContactAndAbout.css';
import api from "../../api/api";

function ContactForm() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  
    const [submitStatus, setSubmitStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const response = await api.post('/api/contact', formData);
        
        if (response.data.success) {
          setSubmitStatus("success");
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
          });
          
          // Show success toast
          toast.success('Message sent successfully! Check your email for confirmation.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          setSubmitStatus("error");
          // Show error toast
          toast.error('Failed to send message. Please try again.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus("error");
        
        // Show error toast
        toast.error('An error occurred. Please try again later.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    };

    return (
      <div className="form-container">
        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        
        <div className="form-header">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and our team will get back to you within 24 hours</p>
        </div>
        
        {submitStatus === "success" && (
          <div className="alert alert-success">
            <strong>Thank you!</strong> Your message has been sent successfully. 
            You should receive a confirmation email shortly.
          </div>
        )}
        
        {submitStatus === "error" && (
          <div className="alert alert-error">
            <strong>Sorry!</strong> There was an error sending your message. 
            Please try again later.
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message *</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
          
          <p className="form-note">
            By submitting this form, you agree to receive an automated confirmation email.
          </p>
        </form>
      </div>
    );
}

export default ContactForm;