import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewNavbar from "../components/Navbar1";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "../css/ContactAndAbout.css";
import {
  FaLanguage,
  FaBook,
  FaUsers,
  FaGlobeAfrica,
  FaHandsHelping,
  FaCalendarAlt,
  FaDonate,
  FaHandHoldingHeart,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const team = [
  {
    name: "Afi Adrine-Bride",
    role: "Founder & CEO",
    bio: "Passionate about preserving indigenous languages and cultures through technology.",
    image: "/profile.png",
  },
  {
    name: "Afi Bright",
    role: "Head of Language Education",
    bio: "Linguistics expert with 10+ years experience in language preservation.",
    image: "/profile.png",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Founded",
    description:
      "TalkTribe was established to preserve local languages and cultures",
    icon: <FaLanguage />,
  },
  {
    year: "2025",
    title: "Platform Launch",
    description:
      "Initial language learning platform released to early adopters",
    icon: <FaBook />,
  },
  {
    year: "2025",
    title: "Community Growth",
    description: "Reached 10,000 active learners across 50+ languages",
    icon: <FaUsers />,
  },
];

const About = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {isLoggedIn ? <NewNavbar /> : <Navbar />}
      <main className="about-page">
        <section className="about-hero" data-aos="fade-in">
          <h1>About TalkTribe</h1>
          <p>Your Language. Your Heritage. Your Voice.</p>
        </section>

        <section className="about-mission" data-aos="fade-up">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p className="mission-statement">
              To create a world where everyone can embrace their roots and
              proudly express their heritage in their mother tongue. We aim to
              spark cultural pride, build inclusive communities, and ensure that
              no language is left behind.
            </p>

            <div className="mission-values">
              <div className="value-card">
                <h3>Preservation</h3>
                <p>Protecting endangered languages from extinction</p>
              </div>
              <div className="value-card">
                <h3>Community</h3>
                <p>Connecting learners with native speakers</p>
              </div>
              <div className="value-card">
                <h3>Accessibility</h3>
                <p>Making language learning available to all</p>
              </div>
              <div className="value-card">
                <h3>Cultural Pride</h3>
                <p>Celebrating the richness of diverse cultures</p>
              </div>
            </div>
          </div>
          <div className="mission-image">
            <img src="/blog1.jpg" alt="Cultural diversity" />
          </div>
        </section>

        <section className="about-story" data-aos="fade-up">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-icon">{milestone.icon}</div>
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-offer" data-aos="fade-up">
          <h2>What We Offer</h2>
          <div className="offer-grid">
            <div className="offer-card">
              <FaLanguage className="offer-icon" />
              <h3>Interactive Courses</h3>
              <p>
                Learn through storytelling, music, proverbs, and everyday
                conversation
              </p>
            </div>
            <div className="offer-card">
              <FaGlobeAfrica className="offer-icon" />
              <h3>Cultural Sessions</h3>
              <p>Real-time discussions with elders and language activists</p>
            </div>
            <div className="offer-card">
              <FaBook className="offer-icon" />
              <h3>Educational Blog</h3>
              <p>
                Discover traditions, rituals, and inspiring community stories
              </p>
            </div>
            <div className="offer-card">
              <FaCalendarAlt className="offer-icon" />
              <h3>Community Events</h3>
              <p>Celebrate festivals and engage with learners worldwide</p>
            </div>
          </div>
        </section>

        <section className="about-team" data-aos="fade-up">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            A passionate group of linguists, educators, and technology
            enthusiasts
          </p>

          <div className="team-grid">
            {team.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-donation" data-aos="fade-up">
          <div className="donation-content">
            <div className="donation-text">
              <FaHandHoldingHeart className="donation-icon" />
              <h2>Support Our Mission</h2>
              <p>
                Your donation helps us preserve endangered languages and provide
                free resources to indigenous communities worldwide.
              </p>
              <ul className="donation-impact">
                <li>Fund language documentation projects</li>
                <li>Develop free learning materials</li>
                <li>Support community language programs</li>
                <li>Create digital archives of native speakers</li>
              </ul>
            </div>
            <div className="donation-cta">
              <Link to="/donate" className="btn btn-donate">
                <FaDonate /> Make a Donation
              </Link>
              <p className="donation-note">
                All donations are tax-deductible and directly support language
                preservation efforts.
              </p>
            </div>
          </div>
        </section>

        <section className="about-cta" data-aos="fade-up">
          <h2>Join Our Language Movement</h2>
          <p>
            Whether you're a learner or a language advocate, we'd love to
            connect with you
          </p>
          <div className="cta-buttons">
            <Link
              to={isLoggedIn ? "/local-languages" : "/register"}
              onClick={() => {
                if (!isLoggedIn) {
                  toast.info("Please register with us to get started!");
                }
              }}
              className="btn btn-primary"
            >
              {isLoggedIn ? "Explore Languages" : "Get Started"}
            </Link>

            <Link to={isLoggedIn ? "/blog" : "/contact"} className="btn btn-outline">
              {isLoggedIn ? "Explore Blog" : "Contact Us"}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;