import React, { useEffect, useState } from "react";
import './forum-styles.css';
const Forums = ({ role }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPost, setNewPost] = useState({ title: '', body: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchPosts = async () => {
    try {
      console.log('Fetching posts from http://localhost:3001/api/forum...');
      const response = await fetch('http://localhost:3001/api/forum', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response URL:', response.url);
      console.log('Response headers:', response.headers.get('content-type'));
      
      const text = await response.text();
      console.log('Raw response (first 200 chars):', text.substring(0, 200));
      
      if (response.ok) {
        if (!text.trim()) {
          console.log('Empty response received');
          setPosts([]);
          return;
        }
        
        try {
          const data = JSON.parse(text);
          console.log('Parsed data:', data);
          setPosts(data);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          setError(`Server returned HTML instead of JSON. Response starts with: ${text.substring(0, 50)}...`);
        }
      } else {
        console.error('Error response:', text);
        setError(`Backend error (${response.status}): ${text.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError(`Network error: ${err.message}. Is your backend running on port 3001?`);
    } finally {
      setLoading(false);
    }
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
      const response = await fetch('http://localhost:3001/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', body: '', image: '' });
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
          
          <div className="form-group">
            <input
              type="url"
              placeholder="Optional image URL"
              value={newPost.image}
              onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
              className="form-input"
              disabled={submitting}
            />
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
                    src={post.image}
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
                    <span>Comment</span>
                  </button>
                  
                  <button className="action-btn">
                    <span>⚠️</span>
                    <span>Report</span>
                  </button>
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