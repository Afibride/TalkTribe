import React from 'react';
import NewNavbar from '../components/Navbar1';
import HeroSection from '../components/blog/BlogHeroSection';
import MainBlogContent from '../components/blog/MainBlogContent';
import RelatedBlogSection from '../components/blog/RelatedBlogSection';
import Footer from '../components/Footer';

const BlogPage = () => {
  return (
    <div>
      <NewNavbar />
      <HeroSection />
      <MainBlogContent />
      <RelatedBlogSection />
      <Footer/>
    </div>
  );
};

export default BlogPage;