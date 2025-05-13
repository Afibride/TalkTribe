import React from 'react';
import '../../css/Blog.css';

const RelatedBlogSection = () => {
  const blogs = [
    {
      title: 'The Importance of Preserving Local Languages',
      description: 'Discover why preserving local languages is crucial for cultural identity and heritage.',
      image: '/blog1.jpg', // Replace with actual image path
      views: '12,345',
    },
    {
      title: 'How to Teach Your Children Your Native Language',
      description: 'Practical tips and strategies for passing your native language to the next generation.',
      image: '/blog1.jpg', // Replace with actual image path
      views: '8,765',
    },
    {
      title: 'The Role of Local Languages in Community Building',
      description: 'Learn how local languages foster stronger community bonds and social cohesion.',
      image: '/blog1.jpg', // Replace with actual image path
      views: '15,432',
    },
    {
      title: 'Reviving Endangered Languages: A Global Effort',
      description: 'Explore global initiatives aimed at reviving endangered languages and their impact.',
      image: '/blog1.jpg', // Replace with actual image path
      views: '10,987',
    },
  ];

  return (
    <section className="related-blog-section">
      <div className="related-blog-header" data-aos="fade-in">
        <h2>Related Blogs</h2>
        <a href="/blog" className="see-all-link">See all</a>
      </div>
      <div className="related-blog-grid">
        {blogs.map((blog, index) => (
          <div key={index} className="related-blog-card" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
            <img src={blog.image} alt={blog.title} className="related-blog-image" />
            <div className="related-blog-details">
              <h3>{blog.title}</h3>
              <p>{blog.description}</p>
              <span className="blog-views">👁 {blog.views}</span>
              <a href="/blog-details" className="read-more-link">Read more</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedBlogSection;