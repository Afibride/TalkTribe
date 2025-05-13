import React from 'react';
import '../../css/Blog.css';

const MainBlogContent = () => {
  return (
    <section className="main-blog-content" data-aos="fade-in">
      <h1 data-aos="fade-down">Why Learning Your Local Languages is Important</h1>
      <p data-aos="fade-up">
        In a fast-paced world dominated by global languages like English, French, and Mandarin, many people are forgetting the languages of their ancestors. But did you know that learning your local language is more than just speaking a few old words? It’s a powerful way to preserve identity, heritage, and unity. Here’s why:
      </p>
      <ul>
        <li data-aos="fade-right">Your local language is the soul of your tribe. It unlocks ancestral wisdom, cultural identity, and tribal belonging.</li>
        <li data-aos="fade-right" data-aos-delay="100">Studies show multilingual people have better memory, attention, and creativity.</li>
        <li data-aos="fade-right" data-aos-delay="200">Speaking your local language helps you engage in deeper conversations, understand cultural jokes, and promote social cohesion.</li>
      </ul>
      <p data-aos="fade-left">
        Additionally, learning your local language can strengthen family bonds. It allows you to connect with older generations who may not speak global languages fluently. It also helps preserve cultural traditions, songs, and stories that are often passed down orally.
      </p>
      <p data-aos="fade-left" data-aos-delay="100">
        By embracing your local language, you contribute to its survival in a rapidly globalizing world. You become a custodian of your culture, ensuring that future generations can experience the richness of their heritage.
      </p>
    </section>
  );
};

export default MainBlogContent;