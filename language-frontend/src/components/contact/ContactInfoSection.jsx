import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import '../../css/ContactAndAbout.css';

const contactMethods = [
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    details: [
      "General Inquiries: +237 680 225 855",
      "Technical Support: +237 680 225 855"
    ],
    color: "#4e73df"
  },
  {
    icon: <FaEnvelope />,
    title: "Email",
    details: [
      "afibright07@gmail.com",
      "afibright07@gmail.com"
    ],
    color: "#1cc88a"
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Headquarters",
    details: [
      "Bamenda, North West Region",
      "Cameroon"
    ],
    color: "#f6c23e"
  },
  {
    icon: <FaClock />,
    title: "Hours",
    details: [
      "Monday-Friday: 9am-5pm WAT",
      "Saturday: 10am-2pm WAT",
      "Sunday: Closed"
    ],
    color: "#36b9cc"
  }
];

function ContactInfo() {
    return (
      <section className="contact-methods">
        <div className="method-cards">
          {contactMethods.map((method, index) => (
            <div 
              key={index} 
              className="method-card"
              style={{ borderTop: `4px solid ${method.color}` }}
            >
              <div className="method-icon" style={{ color: method.color }}>
                {method.icon}
              </div>
              <h3>{method.title}</h3>
              <ul>
                {method.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
}

export default ContactInfo;