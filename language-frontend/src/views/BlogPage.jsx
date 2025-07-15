import React, { useState } from 'react';
import NewNavbar from '../components/Navbar1';
import BlogNavbar from '../components/blog/BlogNavbar'; // Add this import
import Footer from '../components/Footer';
import BlogHeroSection from '../components/blog/BlogHeroSection';
import BlogPostsSection from '../components/blog/BlogPostsSection';
import RelatedBlogSection from '../components/blog/RelatedBlogSection';
import CreatePostSection from '../components/blog/CreatePostSection';

const BlogPage = () => {
  const [refreshPosts, setRefreshPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [activeTab, setActiveTab] = useState('blog-home'); // Add this state

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
        <BlogNavbar activeTab={activeTab} setActiveTab={setActiveTab} /> {/* Add this line */}
        
        {/* Conditionally render content based on activeTab */}
        {activeTab === 'blog-home' && (
          <>
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
          </>
        )}

        {activeTab === 'news' && (
          <div className="news-container">
            {/* News content goes here */}
            <h2>Latest News</h2>
            {/* You can create a NewsSection component */}
          </div>
        )}

        {activeTab.startsWith('community-') && (
          <div className="community-container">
            {/* Community posts content goes here */}
            <h2>Community Posts</h2>
            {/* You can create a CommunityPostsSection component */}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;