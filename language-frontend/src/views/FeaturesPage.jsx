import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "../css/features.css";
import {
  FaLanguage,
  FaBook,
  FaUsers,
  FaGlobeAfrica,
  FaHandsHelping,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaMobile,
  FaVideo,
  FaComments,
  FaCertificate,
} from "react-icons/fa";

const features = [
  {
    icon: <FaLanguage />,
    title: "Interactive Language Courses",
    shortDesc: "Learn through immersive, culturally-rich lessons",
    longDesc:
      "Our structured language courses combine modern teaching methods with traditional storytelling techniques. Each course is designed by native speakers and language experts to ensure authentic learning experiences.",
    keyPoints: [
      "100+ indigenous Cameroon languages",
      "Structured learning paths",
      "Cultural context integration",
      "Interactive Quizzes",
      "Progress tracking",
      "Offline access available",
    ],
    benefits: [
      "Learn at your own pace",
      "Preserve endangered languages",
      "Connect with cultural roots",
      "Certificates upon completion",
    ],
    image: "/blog.jpg",
    color: "#4e73df",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Native Speaker Instructors",
    shortDesc: "Learn directly from passionate native speakers",
    longDesc:
      "Connect with certified native instructors who bring cultural authenticity to every lesson. Our rigorous vetting process ensures you learn from the best language custodians.",
    keyPoints: [
      "Certified native instructors",
      "Cultural immersion techniques",
      "Flexible scheduling",
      "Specialized dialect coaching",
    ],
    benefits: [
      "Authentic pronunciation",
      "Cultural nuances explained",
      "Personalized feedback",
      "Build meaningful connections",
    ],
    image: "/blog.jpg",
    color: "#1cc88a",
  },
  {
    icon: <FaBook />,
    title: "Cultural Storytelling",
    shortDesc: "Learn through folktales, proverbs and oral traditions",
    longDesc:
      "Our unique approach teaches language through the rich oral traditions of African cultures. Learn vocabulary and grammar naturally through stories passed down generations.",
    keyPoints: [
      "Animated folktales",
      "Interactive story sessions",
      "Proverb explanations",
      "Historical context",
      "Generational knowledge",
    ],
    benefits: [
      "Learn language in cultural context",
      "Preserve oral traditions",
      "Engaging and memorable",
      "Understand cultural values",
    ],
    image: "/blog.jpg",
    color: "#6f42c1",
  },
  {
    icon: <FaUsers />,
    title: "Language Communities",
    shortDesc: "Join vibrant communities of learners and speakers",
    longDesc:
      "Connect with other language enthusiasts in our moderated communities. Practice conversation, ask questions, and participate in cultural events.",
    keyPoints: [
      "Discussion forums",
      "Language exchange partners",
      "Cultural events calendar",
      "Moderated by experts",
      "Regional dialect groups",
    ],
    benefits: [
      "Practice with peers",
      "Make lasting connections",
      "Stay motivated",
      "Discover cultural events",
    ],
    image: "/blog.jpg",
    color: "#f6c23e",
  },
  {
    icon: <FaMobile />,
    title: "Mobile Learning",
    shortDesc: "Learn anytime, anywhere with our mobile app",
    longDesc:
      "Our fully-featured mobile app puts language learning in your pocket. Designed for low-bandwidth environments with offline capabilities.",
    keyPoints: [
      "iOS and Android apps",
      "Offline lesson downloads",
      "Daily practice reminders",
      "Speech recognition",
      "Progress sync across devices",
    ],
    benefits: [
      "Learn on the go",
      "Works without constant internet",
      "Quick daily lessons",
      "Track progress anywhere",
    ],
    image: "/blog.jpg",
    color: "#36b9cc",
  },
  {
    icon: <FaCertificate />,
    title: "Certification Program",
    shortDesc: "Earn recognized certifications in indigenous languages",
    longDesc:
      "Validate your language proficiency with our certification program, recognized by cultural organizations and academic institutions across Africa.",
    keyPoints: [
      "Standardized testing",
      "Oral and written components",
      "Cultural knowledge assessment",
      "Digital badges",
      "Academic credit options",
    ],
    benefits: [
      "Formal recognition of skills",
      "Boost professional opportunities",
      "Contribute to language preservation",
      "Academic and career advancement",
    ],
    image: "/blog.jpg",
    color: "#e74a3b",
  },
];

const FeatureDetail = ({ feature }) => (
  <div className="feature-detail">
    <div className="feature-header" style={{ backgroundColor: feature.color }}>
      <div className="feature-icon">{feature.icon}</div>
      <h2>{feature.title}</h2>
      <p>{feature.shortDesc}</p>
    </div>
    <div className="feature-content">
      <div className="feature-image">
        <img src={feature.image} alt={feature.title} />
      </div>
      <div className="feature-text">
        <p className="feature-description">{feature.longDesc}</p>

        <div className="feature-points">
          <div className="key-points">
            <h3>Key Features</h3>
            <ul>
              {feature.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="benefits">
            <h3>Benefits</h3>
            <ul>
              {feature.benefits.map((benefit, i) => (
                <li key={i}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesPage = () => {
  return (
    <>
      <Navbar />
      <main className="features-page">
        <section className="features-hero">
          <h1>TalkTribe Features</h1>
          <p>Discover how we're preserving African languages and cultures</p>
        </section>

        <section className="features-overview">
          <h2>Comprehensive Language Preservation</h2>
          <p className="overview-description">
            Our platform offers innovative solutions for language learning,
            cultural preservation, and community building. Explore each feature
            in detail below.
          </p>

          <div className="features-menu">
            {features.map((feature, index) => (
              <a
                key={index}
                href={`#feature-${index}`}
                className="feature-menu-item"
                style={{ borderLeft: `4px solid ${feature.color}` }}
              >
                <div className="menu-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.shortDesc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="features-details">
          {features.map((feature, index) => (
            <div id={`feature-${index}`} key={index}>
              <FeatureDetail feature={feature} />
            </div>
          ))}
        </section>

        <section className="features-cta">
          <h2>Ready to Start Your Language Journey?</h2>
          <p>
            Join thousands of learners preserving indigenous languages with
            TalkTribe
          </p>
          <div className="cta-buttons">
            <Link
              to="/register"
              className="btn btn-primary"
              onClick={() => {
                if (!isLoggedIn) {
                  toast.info("Please register with us to get started!");
                }
              }}
            >
              Join Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FeaturesPage;
