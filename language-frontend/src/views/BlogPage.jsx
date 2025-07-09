import React, { useState } from 'react';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import BlogPostsSection from '../components/blog/BlogPostsSection';
import RelatedBlogSection from '../components/blog/RelatedBlogSection';
import CreatePostSection from '../components/blog/CreatePostSection';

const BlogPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = () => {
    setRefreshPosts(prev => !prev);
    setShowCreatePost(false);
  };

  const handlePostSelect = (postId) => {
    setSelectedPost(postId);
  };

  return (
    <>
      <div className="blog-page">
        <NewNavbar />
        <BlogHeroSection 
          onCreatePostClick={() => setShowCreatePost(true)}
        />
        
        {showCreatePost && (
          <CreatePostSection 
            onSuccess={handlePostCreated}
            onCancel={() => setShowCreatePost(false)}
          />
        )}

        <div className="blog-container">
          <div className="blog-main-content">
            <BlogPostsSection 
              refresh={refreshPosts}
              onPostSelect={handlePostSelect}
            />
          </div>
          
          <div className="blog-sidebar">
            <RelatedBlogSection 
              currentPostId={selectedPost} 
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;