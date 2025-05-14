import React from 'react';
import '../../css/Courses.css';

const StudentsViewing = () => {
  const courses = [
    { title: 'Lamnso Language and Culture', duration: '3 months', price: 'XAF5000', image: '/blog.jpg' },
    { title: 'Oku Language Basics', duration: '2 months', price: 'XAF4000', image: '/blog.jpg' },
    { title: 'Bamileke Dialect Mastery', duration: '4 months', price: 'XAF6000', image: '/blog.jpg' },
    { title: 'Fulani Language Essentials', duration: '3 months', price: 'XAF4500', image: '/blog.jpg' },
  ];

  return (
    <section className="students-viewing">
      <div className="students-viewing-header">
        <h2>Students are Viewing</h2>
        <a href="/see-all" className="view-all">See All</a>
      </div>
      <div className="students-viewing-courses">
        {courses.map((course, index) => (
          <div key={index} className="students-viewing-card" data-aos="fade-up">
            <img src={course.image} alt={course.title} className="students-viewing-image" />
            <div className="students-viewing-details">
              <h3 className="students-viewing-title">{course.title}</h3>
              <p className="students-viewing-info">{course.duration} | {course.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentsViewing;