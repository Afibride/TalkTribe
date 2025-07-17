import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../css/ProfilePage.css';
import BlogPost from '../components/blog/BlogPost';
import CommentsSection from '../components/blog/CommentsSection';
import NewNavbar from '../components/Navbar1';
import Footer from '../components/Footer';
import CreatePostSection from '../components/blog/CreatePostSection';
import InstructorCourses from '../components/instructor/InstructorCourses';
import CreateCourseModal from '../components/instructor/CreateCourseModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    profile_pic: null,
    cover_photo: null
  });
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);

  const fetchInstructorCourses = async () => {
    try {
      const response = await api.get('/api/instructor/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      setError('Failed to load courses');
    }
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/users/${username}`);
      
      if (!response.data.user) {
        setError('User not found');
        setProfile(null);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      setProfile(response.data.user);
      setIsCurrentUser(currentUser?.username === username);
      setIsInstructor(response.data.user?.role === 'instructor');
      
      setEditForm({
        name: response.data.user.name,
        bio: response.data.user.bio || '',
        location: response.data.user.location || '',
        profile_pic: null,
        cover_photo: null
      });
      
      const postsResponse = await api.get(`/api/users/${username}/posts`);
      setPosts(postsResponse.data.map(post => ({
        ...post,
        content: post.content,
        image_url: post.image,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        liked: post.likes && post.likes.length > 0,
        comments: post.comments || []
      })));
      
      if (response.data.user?.role === 'instructor') {
        await fetchInstructorCourses();
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      if (err.response?.status === 404) {
        setError('User not found');
      }
      setPosts([]);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const getPreviewUrl = (file) => {
    return file instanceof File ? URL.createObjectURL(file) : null;
  };

  const handleEditToggle = (field = null) => {
    setEditingField(field);
    setIsEditing(field !== null);
    setError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (name === 'profile_pic' && files[0].size > 2 * 1024 * 1024) {
        setError('Profile picture must be less than 2MB');
        return;
      }
      if (name === 'cover_photo' && files[0].size > 5 * 1024 * 1024) {
        setError('Cover photo must be less than 5MB');
        return;
      }
      
      setEditForm(prev => ({ ...prev, [name]: files[0] }));
      setError(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      
      formData.append('name', editForm.name || '');
      formData.append('bio', editForm.bio || '');
      formData.append('location', editForm.location || '');
      
      if (editForm.profile_pic instanceof File) {
        formData.append('profile_pic', editForm.profile_pic);
      }
      if (editForm.cover_photo instanceof File) {
        formData.append('cover_photo', editForm.cover_photo);
      }

      const response = await api.post(`/api/users/${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      
      setProfile(response.data.user);
      setIsEditing(false);
      setEditingField(null);
      setUploadProgress(0);
      
      if (isCurrentUser) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...response.data.user
        }));
      }
      
      setError('Profile updated successfully!');
      setTimeout(() => setError(null), 3000);
      
      fetchProfile();
      
    } catch (err) {
      console.error('Update error:', err);
      let errorMessage = 'Failed to update profile';
      
      if (err.response?.data?.errors) {
        errorMessage = Object.entries(err.response.data.errors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    }
  };

  const handlePostEdit = (postId, updatedContent) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, content: updatedContent } : post
    ));
  };

  const confirmDeletePost = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handlePostDelete = async () => {
    try {
      await api.delete(`/api/blog/posts/${postToDelete}`);
      setPosts(posts.filter(post => post.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);
      setError('Post deleted successfully');
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/blog/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId ? {
          ...post,
          liked: !post.liked,
          likes_count: post.liked ? post.likes_count - 1 : post.likes_count + 1
        } : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(err.response?.data?.message || 'Failed to like post');
    }
  };

  const handleAddComment = async (postId, commentText, parentId = null) => {
    try {
      const response = await api.post(`/api/blog/posts/${postId}/comment`, {
        content: commentText,
        parent_id: parentId
      });
      
      setPosts(posts.map(post => {
        if (post.id !== postId) return post;
        
        if (parentId) {
          const updatedComments = post.comments.map(comment => 
            comment.id === parentId
              ? { 
                  ...comment, 
                  replies: [response.data, ...(comment.replies || [])],
                  replies_count: (comment.replies_count || 0) + 1
                }
              : comment
          );
          return {
            ...post,
            comments: updatedComments,
            comments_count: post.comments_count + 1
          };
        } else {
          return {
            ...post,
            comments: [response.data, ...(post.comments || [])],
            comments_count: post.comments_count + 1
          };
        }
      }));
      
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.message || 'Failed to add comment');
      return false;
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([{
      ...newPost,
      content: newPost.content,
      image_url: newPost.image,
      likes_count: 0,
      comments_count: 0,
      liked: false,
      comments: []
    }, ...posts]);
    setShowCreatePost(false);
    fetchProfile();
  };

  const handleCourseCreated = (newCourse) => {
  setCourses([newCourse, ...courses]);
  toast.success('Course created successfully!');
  setShowCreateCourseModal(false);
};

const handleCourseUpdated = (updatedCourse) => {
  setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
};

const handleCourseDeleted = (deletedId) => {
  setCourses(courses.filter(c => c.id !== deletedId));
  toast.success('Course deleted successfully!');
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <div className="posts-container">
            {isCurrentUser && (
              <button 
                className="create-post-btn"
                onClick={() => setShowCreatePost(true)}
              >
                Create New Post
              </button>
            )}
            
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet.</p>
              </div>
            ) : (
              posts.map(post => (
                <BlogPost 
                  key={post.id}
                  post={{
                    ...post,
                    content: {
                      text: post.content,
                      image: post.image_url
                    },
                    author: {
                      name: profile.name,
                      avatar: profile.profile_pic_url || '/profile.png',
                      role: profile.role || 'User'
                    },
                    stats: {
                      likes: post.likes_count || 0,
                      comments: post.comments_count || 0,
                      shares: 0
                    },
                    liked: post.liked || false,
                    comments: post.comments || [],
                    showComments: true
                  }}
                  onLike={() => handleLike(post.id)}
                  onAddComment={(commentText, parentId) => handleAddComment(post.id, commentText, parentId)}
                  onEdit={isCurrentUser ? handlePostEdit : null}
                  onDelete={isCurrentUser ? () => confirmDeletePost(post.id) : null}
                  showEditOptions={isCurrentUser}
                />
              ))
            )}
          </div>
        );
      case 'about':
        return (
          <div className="about-container">
            <div className="about-section">
              <h3>About</h3>
              <p>{profile.bio || 'No bio provided.'}</p>
            </div>
            
            <div className="about-section">
              <h3>Details</h3>
              <div className="detail-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{profile.location || 'Unknown location'}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-calendar-alt"></i>
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        );
      case 'courses':
        return (
          <InstructorCourses 
            courses={courses} 
            onCourseCreated={handleCourseCreated}
            onCourseUpdated={handleCourseUpdated}
            onCourseDeleted={handleCourseDeleted}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );
  
  if (error && !profile) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <button onClick={() => navigate('/')} className="home-btn">
        Go to Home
      </button>
    </div>
  );
  
  if (!profile) return (
    <div className="not-found-container">
      <h2>Profile not found</h2>
      <p>The user '{username}' does not exist.</p>
      <button onClick={() => navigate(-1)} className="back-btn">
        Go Back
      </button>
    </div>
  );

  return (
    <>
      <NewNavbar />
      <div className="profile-page">
        {error && !isEditing && (
          <div className={`error-message ${error.includes('successfully') ? 'success' : ''}`}>
            {error}
          </div>
        )}
        
        <div className="cover-photo-container">
          <img 
            src={profile.cover_photo_url || '/blog.jpg'} 
            alt="Cover" 
            className="cover-photo"
            onError={(e) => { e.target.src = '/blog.jpg'; }}
          />
          {isCurrentUser && (
            <button 
              className="edit-cover-btn"
              onClick={() => {
                setEditingField('cover_photo');
                setIsEditing(true);
              }}
            >
              <i className="fas fa-camera"></i> Edit Cover
            </button>
          )}
        </div>

        <div className="profile-header">
          <div className="profile-pic-container">
            <img 
              src={profile.profile_pic_url || '/profile.png'} 
              alt={profile.name} 
              className="profile-pic"
              onError={(e) => { e.target.src = '/profile.png'; }}
            />
            {isCurrentUser && (
              <button 
                className="edit-profile-pic-btn"
                onClick={() => {
                  setEditingField('profile_pic');
                  setIsEditing(true);
                }}
              >
                <i className="fas fa-camera"></i>
              </button>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-info-item">
              <h1 className="profile-name">{profile.name}</h1>
              {isCurrentUser && (
                <button 
                  className="edit-info-btn"
                  onClick={() => {
                    setEditingField('name');
                    setIsEditing(true);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
            
            <div className="profile-info-item">
              <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
              {isCurrentUser && (
                <button 
                  className="edit-info-btn"
                  onClick={() => {
                    setEditingField('bio');
                    setIsEditing(true);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
            
            <div className="profile-info-item">
              <p className="profile-location">
                <i className="fas fa-map-marker-alt"></i> {profile.location || 'Unknown location'}
              </p>
              {isCurrentUser && (
                <button 
                  className="edit-info-btn"
                  onClick={() => {
                    setEditingField('location');
                    setIsEditing(true);
                  }}
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{profile.posts_count || 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.followers_count || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.following_count || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>

          {isCurrentUser && (
            <button 
              className="edit-profile-btn" 
              onClick={() => {
                setEditingField('all');
                setIsEditing(true);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          {isInstructor && (
            <button 
              className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              My Courses
            </button>
          )}
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>

        {isInstructor && activeTab === 'courses' && isCurrentUser && (
          <button 
            className="create-course-btn"
            onClick={() => setShowCreateCourseModal(true)}
          >
            Create New Course
          </button>
        )}

        {isEditing && (
          <div className="modal-overlay">
            <div className="edit-profile-modal">
              <form onSubmit={handleEditSubmit} className="edit-profile-form">
                <button 
                  type="button" 
                  className="close-edit-form"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingField(null);
                    setError(null);
                  }}
                >
                  &times;
                </button>
                
                <h2>Edit Profile</h2>
                
                {(editingField === 'name' || editingField === 'all') && (
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      placeholder="Enter your name"
                    />
                  </div>
                )}
                
                {(editingField === 'bio' || editingField === 'all') && (
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleEditChange}
                      rows="3"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                )}
                
                {(editingField === 'location' || editingField === 'all') && (
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      placeholder="Where are you from?"
                    />
                  </div>
                )}
                
                {(editingField === 'profile_pic' || editingField === 'all') && (
                  <div className="form-group">
                    <label>Profile Picture (Max 2MB)</label>
                    <div className="custom-file-input">
                      <input
                        type="file"
                        id="profile-pic-upload"
                        name="profile_pic"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="profile-pic-upload" className="file-input-label">
                        <span className="file-input-text">
                          {editForm.profile_pic instanceof File 
                            ? editForm.profile_pic.name 
                            : 'Choose a file'}
                        </span>
                        <span className="file-input-button">Browse</span>
                      </label>
                    </div>
                    {editForm.profile_pic instanceof File && (
                      <div className="image-preview">
                        <img 
                          src={getPreviewUrl(editForm.profile_pic)} 
                          alt="Preview" 
                          className="preview-image"
                        />
                        <button 
                          type="button" 
                          onClick={() => setEditForm(prev => ({...prev, profile_pic: null}))}
                          className="remove-image-btn"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {(editingField === 'cover_photo' || editingField === 'all') && (
                  <div className="form-group">
                    <label>Cover Photo (Max 5MB)</label>
                    <div className="custom-file-input">
                      <input
                        type="file"
                        id="cover-photo-upload"
                        name="cover_photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <label htmlFor="cover-photo-upload" className="file-input-label">
                        <span className="file-input-text">
                          {editForm.cover_photo instanceof File 
                            ? editForm.cover_photo.name 
                            : 'Choose a file'}
                        </span>
                        <span className="file-input-button">Browse</span>
                      </label>
                    </div>
                    {editForm.cover_photo instanceof File && (
                      <div className="image-preview">
                        <img 
                          src={getPreviewUrl(editForm.cover_photo)} 
                          alt="Cover Preview" 
                          className="preview-image"
                        />
                        <button 
                          type="button" 
                          onClick={() => setEditForm(prev => ({...prev, cover_photo: null}))}
                          className="remove-image-btn"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="upload-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                  >
                    {uploadProgress === 100 ? 'Processing...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => {
                      setIsEditing(false);
                      setEditingField(null);
                      setError(null);
                    }}
                    disabled={uploadProgress > 0 && uploadProgress < 100}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreatePost && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                className="close-modal" 
                onClick={() => setShowCreatePost(false)}
              >
                &times;
              </button>
              <CreatePostSection 
                onSuccess={handlePostCreated}
              />
            </div>
          </div>
        )}

        {showCreateCourseModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                className="close-modal" 
                onClick={() => setShowCreateCourseModal(false)}
              >
                &times;
              </button>
              <CreateCourseModal 
                onSuccess={handleCourseCreated}
                onCancel={() => setShowCreateCourseModal(false)}
              />
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <h3>Delete Post</h3>
              <p>Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPostToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="delete-btn"
                  onClick={handlePostDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default ProfilePage;