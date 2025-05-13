import React, { useState } from 'react';
import '../../css/HomeLogin.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Tah Junior',
      image: '/user.jpg',
      text: 'Thank you so much for your help. It’s exactly what I’ve been looking for. You won’t regret it. It really saves me time and effort. TalkTribe is exactly what our kids who didn’t have the opportunity to learn about their culture and language need.',
      rating: 5,
      reviews: '12 reviews at Yelp',
    },
    {
      name: 'Jane Doe',
      image: '/user.jpg',
      text: 'TalkTribe has been a game-changer for me. I’ve learned so much about my culture and language in such a short time.',
      rating: 4,
      reviews: '8 reviews at Yelp',
    },
    {
      name: 'John Smith',
      image: '/user.jpg',
      text: 'The platform is amazing! The courses are interactive, and the instructors are very knowledgeable.',
      rating: 5,
      reviews: '15 reviews at Yelp',
    },
    {
      name: 'Emily Johnson',
      image: '/user.jpg',
      text: 'I love how TalkTribe connects me with my roots. The lessons are fun and engaging!',
      rating: 5,
      reviews: '10 reviews at Yelp',
    },
  ];

  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonial-layout">
        <div className="testimonial-header">
          <h2 className="testimonial-title">What They Say?</h2>
          <p className="testimonial-subtitle">
            TalkTribe has got more than 100k positive ratings from our users around the world. Some of the students were greatly helped by the Skilline.
          </p>
          <p className="testimonial-subtitle">Are you too? Please give your assessment.</p>
          <div className="assessment-form">
            <input
              type="text"
              placeholder="Write your assessment..."
              className="assessment-input"
            />
            <button className="submit-btn">Submit</button>
          </div>
        </div>

        <div className="testimonial-cards">
          {(showAll ? testimonials : testimonials.slice(0, 1)).map((testimonial, index) => (
            <div key={index} className="testimonial-card" data-aos="zoom-in">
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
              <p className="testimonial-text">“{testimonial.text}”</p>
              <strong className="testimonial-name">{testimonial.name}</strong>
              <p className="testimonial-rating">
                {Array(testimonial.rating)
                  .fill('⭐')
                  .join(' ')}{' '}
                {testimonial.reviews}
              </p>
            </div>
          ))}
        </div>
      </div>
      <button className="show-more-btn" onClick={toggleShowAll}>
        {showAll ? 'Show Less' : 'Show More'}
      </button>
    </section>
  );
};

export default TestimonialsSection;