import React from 'react';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import CreatePostSection from '../components/blog/CreatePostSection';
import BlogPostsSection from '../components/blog/BlogPostsSection';

const BlogPage = () => {
  return (
    <div className="blog-page">
      <NewNavbar />
      <BlogHeroSection />
      <div className="blog-container">
        <CreatePostSection />
        <BlogPostsSection />
      
      <Footer />
      </div>
    </div>
  );
};

export default BlogPage;