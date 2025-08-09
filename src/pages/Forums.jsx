import React, { useEffect, useState } from "react";
import './forum-styles.css';

const Forums = ({ role }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({ title: '', body: '', imageUrl: '', imageFile: null });
  const [submitting, setSubmitting] = useState(false);
  const [commentTexts, setCommentTexts] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [uploadMode, setUploadMode] = useState('url'); // 'url' or 'file'

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from http://localhost:3001/api/forum...');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if available (for like status)
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:3001/api/forum', {
        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Parsed data:', data);
        setPosts(data);
      } else {
        console.error('Error response:', response.status);
        setError(`Backend error (${response.status}). Check if your backend is running.`);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Network error: ${err.message}. Is your backend running on port 3001?`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setNewPost({ ...newPost, imageFile: file, imageUrl: '' });
    }
  };

  const switchToFileUpload = () => {
    setUploadMode('file');
    setNewPost({ ...newPost, imageUrl: '', imageFile: null });
  };

  const switchToUrlUpload = () => {
    setUploadMode('url');
    setNewPost({ ...newPost, imageFile: null });
    // Reset file input
    const fileInput = document.getElementById('image-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      setError('Title and message are required');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('body', newPost.body);
      
      if (uploadMode === 'file' && newPost.imageFile) {
        formData.append('image', newPost.imageFile);
      } else if (uploadMode === 'url' && newPost.imageUrl) {
        formData.append('imageUrl', newPost.imageUrl);
      }

      const response = await fetch('http://localhost:3001/api/forum', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', body: '', imageUrl: '', imageFile: null });
        setUploadMode('url');
        // Reset file input
        const fileInput = document.getElementById('image-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = commentTexts[postId];
    if (!commentText || !commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to comment');
      return;
    }

    setSubmittingComment({ ...submittingComment, [postId]: true });

    try {
      const response = await fetch(`http://localhost:3001/api/forum/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: commentText })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, data.comment] }
            : post
        ));
        setCommentTexts({ ...commentTexts, [postId]: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add comment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment({ ...submittingComment, [postId]: false });
    }
  };

  const handleLikePost = async (postId) => {
    const token = getAuthToken();
    if (!token) {
      setError('You must be logged in to like posts');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/forum/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: data.likes, userLiked: data.userLiked }
            : post
        ));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forums-container">
      <div className="forums-content">
        {/* Header */}
        <div className="forums-header">
          <h1 className="forums-title">Community Forums</h1>
          <p className="forums-subtitle">Connect, share, and learn with your peers</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
            <button 
              onClick={() => setError('')}
              className="error-close"
            >
              ×
            </button>
          </div>
        )}

        {/* Create Post */}
        <div className="create-post-container">
          <h2 className="create-post-title">✏️ Create New Post</h2>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="form-input"
              disabled={submitting}
            />
          </div>
          
          <div className="form-group">
            <textarea
              rows="4"
              placeholder="What's on your mind? Share your thoughts, questions, or experiences..."
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              className="form-input form-textarea"
              disabled={submitting}
            />
          </div>
          
          {/* Image Upload Options */}
          <div className="image-upload-section">
            <div className="upload-tabs">
              <button 
                type="button"
                className={`upload-tab ${uploadMode === 'url' ? 'active' : ''}`}
                onClick={switchToUrlUpload}
                disabled={submitting}
              >
                🔗 Image URL
              </button>
              <button 
                type="button"
                className={`upload-tab ${uploadMode === 'file' ? 'active' : ''}`}
                onClick={switchToFileUpload}
                disabled={submitting}
              >
                📁 Upload File
              </button>
            </div>
            
            {uploadMode === 'url' ? (
              <div className="form-group">
                <input
                  type="url"
                  placeholder="Paste image URL here..."
                  value={newPost.imageUrl}
                  onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                  className="form-input"
                  disabled={submitting}
                />
              </div>
            ) : (
              <div className="form-group">
                <input
                  id="image-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="file-input"
                  disabled={submitting}
                />
                {newPost.imageFile && (
                  <div className="file-preview">
                    <span>📷 {newPost.imageFile.name}</span>
                    <button 
                      type="button"
                      onClick={() => setNewPost({ ...newPost, imageFile: null })}
                      className="remove-file"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <button
            onClick={handleCreatePost}
            disabled={submitting || !newPost.title.trim() || !newPost.body.trim()}
            className="submit-btn"
          >
            {submitting ? (
              <>
                <span className="loading-spinner"></span>
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" style={{width: '40px', height: '40px'}}></div>
            <p className="loading-text">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3 className="empty-title">No posts yet!</h3>
            <p className="empty-description">Be the first to share something with the community.</p>
          </div>
        ) : (
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                {/* Post Header */}
                <div className="post-header">
                  <div className="author-avatar">
                    {post.author.split(' ')[1]?.[0] || '?'}
                  </div>
                  <div className="author-info">
                    <h3 className="author-name">{post.author}</h3>
                    <p className="post-time">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>

                {/* Post Content */}
                {post.title && (
                  <h2 className="post-title">{post.title}</h2>
                )}
                <p className="post-content">{post.message}</p>

                {/* Post Image */}
                {post.image && (
                  <img
                    src={post.image.startsWith('/uploads') 
                      ? `http://localhost:3001${post.image}` 
                      : post.image
                    }
                    alt="Post content"
                    className="post-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`action-btn ${post.userLiked ? 'liked' : ''}`}
                  >
                    <span>{post.userLiked ? '❤️' : '🤍'}</span>
                    <span>{post.likes || 0} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>
                  
                  <button className="action-btn">
                    <span>💬</span>
                    <span>{post.comments?.length || 0} Comments</span>
                  </button>
                  
                  <button className="action-btn">
                    <span>⚠️</span>
                    <span>Report</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  {post.comments && post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-author">{comment.author}</div>
                          <div className="comment-text">{comment.text}</div>
                          <div className="comment-time">{formatTimeAgo(comment.createdAt)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add Comment */}
                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentTexts[post.id] || ''}
                      onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
                      className="comment-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={submittingComment[post.id]}
                      className="comment-submit-btn"
                    >
                      {submittingComment[post.id] ? '...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forums;