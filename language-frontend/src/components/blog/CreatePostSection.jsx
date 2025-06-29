import React, { useState } from 'react';
import BlogPost from './BlogPost';
import '../../css/Blog.css';

const BlogPostsSection = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Dr. Nfor Johnson",
        avatar: "/profile.png",
        role: "Language Instructor"
      },
      content: {
        text: "Today I want to share some insights about preserving the Lamnso' language. Did you know there are over 200 proverbs that capture our cultural wisdom?",
        image: "/blog1.jpg"
      },
      stats: {
        likes: 42,
        comments: 8,
        shares: 5
      },
      comments: [
        {
          id: 1,
          author: "Sarah M.",
          text: "This is fascinating! My grandmother used to tell me some of these proverbs.",
          time: "2 hours ago"
        }
      ],
      liked: false,
      timestamp: "3 hours ago"
    },
    // More sample posts...
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          stats: {
            ...post.stats,
            likes: post.liked ? post.stats.likes - 1 : post.stats.likes + 1
          }
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId, commentText) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: post.comments.length + 1,
          author: "Current User",
          text: commentText,
          time: "Just now"
        };
        
        return {
          ...post,
          comments: [...post.comments, newComment],
          stats: {
            ...post.stats,
            comments: post.stats.comments + 1
          }
        };
      }
      return post;
    }));
  };

  return (
    <div className="blog-posts-section">
      {posts.map(post => (
        <BlogPost 
          key={post.id}
          post={post}
          onLike={handleLike}
          onAddComment={handleAddComment}
        />
      ))}
    </div>
  );
};

export default BlogPostsSection;