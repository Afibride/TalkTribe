import React from 'react';
import '../../css/HomeLogin.css';

const NewsSection = () => {
  const newsItems = [
    {
      image: "/blog1.jpg",
      title: "TalkTribe Adds $30 Million to Its Balance Sheet to Advance Local Language Learning Platform",
      description: "TalkTribe, a fast-growing platform dedicated to preserving and teaching local languages, has raised $30 million to accelerate its mission of revitalizing indigenous languages through technology.",
      tag: "NEWS",
    },
    {
      image: "/blog.jpg",
      title: "TalkTribe Inc. Closes $30 Million Series A Financing to Meet High Demand",
      description: "TalkTribe Inc., the company that created Class, announced today that it has closed...",
      tag: "PRESS RELEASE",
    },
    {
      image: "/blog.jpg",
      title: "Zoom's earliest investors are betting millions on a better Zoom for schools",
      description: "Zoom was never created to be a classroom product. Nonetheless, the pandemic...",
      tag: "NEWS",
    },
    {
      image: "/blog.jpg",
      title: "Former Blackboard CEO Raises $16M to Bring LMS Features to Zoom Classrooms",
      description: "This year, investors have reaped big financial returns from betting on Zoom...",
      tag: "NEWS",
    },
  ];

  return (
    <section className="news-section" data-aos="fade-up">
      <h2 className="news-title" data-aos="fade-right">Latest News and Resources</h2>
      <p className="news-subtitle" data-aos="fade-left">
        See the developments that have occurred to TalkTribe in the world.
      </p>
      <div className="news-layout">
        {/* Large News Card */}
        <div className="large-news-card" data-aos="zoom-in">
          <img src={newsItems[0].image} alt="news item" className="large-news-img" />
          <div className="large-news-content">
            <span className="news-tag">{newsItems[0].tag}</span>
            <h3 className="news-headline">{newsItems[0].title}</h3>
            <p className="news-description">{newsItems[0].description}</p>
            <a href="#" className="news-read-more">Read more...</a>
          </div>
        </div>

        {/* Small News Cards */}
        <div className="small-news-grid">
          {newsItems.slice(1).map((item, index) => (
            <div key={index} className="small-news-card" data-aos="fade-up">
              <img src={item.image} alt="news item" className="small-news-img" />
              <div className="small-news-content">
                <span className="news-tag">{item.tag}</span>
                <h3 className="news-headline">{item.title}</h3>
                <p className="news-description">{item.description}</p>
                <a href="#" className="news-read-more">Read more...</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
