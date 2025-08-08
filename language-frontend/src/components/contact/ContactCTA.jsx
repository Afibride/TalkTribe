import React from "react";
import { Link } from "react-router-dom";
import '../../css/ContactAndAbout.css';

function ContactCTA() {
    return (
      <section className="about-cta">
        <h2>Join Our Language Movement</h2>
        <p>Whether you're a learner or a language advocate, we'd love to connect with you</p>
        <div className="cta-buttons">
          <Link to="/local-languages" className="btn btn-primary">
            Explore Languages
          </Link>
          <Link to="#" className="btn btn-outline">
            Get Help
          </Link>
        </div>
      </section>
    );
}

export default ContactCTA;