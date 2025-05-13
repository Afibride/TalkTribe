import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/ContactAndAbout.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="about-page">
      <div className="about-hero" data-aos="fade-in">
        <h1>About TalkTribe</h1>
        <p>Your Language. Your Heritage. Your Voice.</p>
      </div>

      <div className="about-content">
      <section data-aos="fade-up">
  <div className="about-section">
    <img src="/logo.png" alt="Diverse group of people representing cultures" className="about-img" />
    <div className="about-text">
      <h2>Who We Are</h2>
      <p>
        TalkTribe is more than just a language learning platform — it’s a movement to preserve
        and promote local languages and cultures. We connect language learners with passionate
        native instructors and cultural experts to offer a truly immersive learning experience.
      </p>
    </div>
  </div>
</section>


<section data-aos="fade-up" data-aos-delay="100">
  <div className="about-section">
    <img src="/blog1.jpg" alt="Icons showing courses, culture, and events" className="about-img" />
    <div className="about-text">
      <h2>What We Offer</h2>
      <ul>
        <li><strong>Interactive Courses:</strong> Learn through storytelling, music, proverbs, and everyday conversation.</li>
        <li><strong>Live Cultural Sessions:</strong> Participate in real-time discussions with elders, historians, and language activists.</li>
        <li><strong>Vibrant Blog:</strong> Discover hidden traditions, sacred rituals, language evolution, and inspiring community stories.</li>
        <li><strong>Community Events:</strong> Celebrate festivals, take language challenges, and engage with learners worldwide.</li>
      </ul>
    </div>
  </div>
</section>


        <section data-aos="fade-up" data-aos-delay="200">
          <img src="/blog1.jpg" alt="Illustration of a tree with language roots" className="about-img" />
          <h2>Why It Matters</h2>
          <p>
            Every language holds a universe of wisdom and identity. With many indigenous
            languages at risk of extinction, TalkTribe is committed to revitalizing these
            treasures. When you learn your local language, you’re not just gaining words— 
            you’re reclaiming stories, values, and a sense of belonging.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="300">
          <img src="/blog.jpg" alt="Mission flag and cultural group united" className="about-img" />
          <h2>Our Mission</h2>
          <p>
            To create a world where everyone can embrace their roots and proudly express
            their heritage in their mother tongue. We aim to spark cultural pride, build
            inclusive communities, and ensure that no language is left behind.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="400">
          <img src="/blog1.jpg" alt="Vision of a connected world" className="about-img" />
          <h2>Our Vision</h2>
          <p>
            A global platform that becomes the go-to hub for local language learning,
            storytelling, and cultural exchange—bridging generations and inspiring
            reconnection with our shared human roots.
          </p>
        </section>
      </div>

      <div className="about-cta" data-aos="fade-up">
        <h2>Ready to Discover Your Language?</h2>
        <p>Join thousands of learners on TalkTribe and speak your truth—one word at a time.</p>
        <button className="cta-btn">Start Learning</button>
      </div>
    </div>
  );
};

export default About;
