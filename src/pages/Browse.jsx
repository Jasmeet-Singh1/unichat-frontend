import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './browse.css';

const Browse = ({ role, currentUser }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState({});
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  // Search filters state
  const [filters, setFilters] = useState({
    searchTerm: '',
    searchBy: 'name', // name, email, program, course
    role: '',
    program: '',
    year: '',
    courseCode: '',
    courseName: ''
  });

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const endYear = currentYear + 1;
    const years = [];
    for (let y = startYear; y <= endYear; y++) {
      years.push(y.toString());
    }
    return years;
  };

  // Dynamic options populated from your APIs
  const [filterOptions, setFilterOptions] = useState({
    programs: [],
    years: getYearRange(),
    roles: ['Student', 'Mentor', 'Alumni'],
    courses: []
  });

  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Load filter options and initial users
  useEffect(() => {
    loadFilterOptions();
    loadAllUsers(); // Load initial users
  }, []);

  // Load courses when program changes
  useEffect(() => {
    if (selectedProgramId) {
      loadCoursesForProgram(selectedProgramId);
    } else {
      setFilterOptions(prev => ({ ...prev, courses: [] }));
    }
  }, [selectedProgramId]);

  const loadFilterOptions = async () => {
    try {
      setLoadingOptions(true);
      
      // Load programs from your existing API
      const programsResponse = await fetch('http://localhost:3001/api/programs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        console.log('Loaded programs:', programsData);
        
        setFilterOptions(prev => ({
          ...prev,
          programs: programsData.map(program => ({
            id: program._id,
            name: program.name || program.programName || program.title,
            code: program.code || program.programCode,
            description: program.description
          }))
        }));
      } else {
        console.error('Failed to load programs');
      }

    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadCoursesForProgram = async (programId) => {
    try {
      console.log('Loading courses for program:', programId);
      
      const coursesResponse = await fetch(`http://localhost:3001/api/programs/${programId}/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        console.log('Loaded courses:', coursesData);
        
        setFilterOptions(prev => ({
          ...prev,
          courses: coursesData.map(course => ({
            id: course._id,
            code: course.code || course.courseCode,
            name: course.name || course.courseName || course.title,
            description: course.description
          }))
        }));
      } else {
        console.error('Failed to load courses for program:', programId);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadAllUsers = async () => {
    console.log('📥 loadAllUsers called');
    
    // Prevent multiple simultaneous loads
    if (loading) {
      console.log('⚠️ Already loading, skipping...');
      return;
    }
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        setUsers([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:3001/api/search/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Loaded', userData.length, 'users');
        setUsers(userData);
      } else {
        console.error('❌ Failed to load users:', response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Error loading users:', error);
      setUsers([]);
    } finally {
      // ALWAYS set loading to false
      setLoading(false);
      console.log('📥 loadAllUsers completed');
    }
  };

  const searchUsers = async (searchFilters = {}) => {
    console.log('🔍 searchUsers called with filters:', searchFilters);
    
    // Prevent multiple simultaneous searches
    if (loading) {
      console.log('⚠️ Already loading, skipping search...');
      return;
    }
    
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          params.append(key, value);
        }
      });

      const url = `http://localhost:3001/api/search/users?${params.toString()}`;
      console.log('🔍 Fetching:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Search found', userData.length, 'users');
        setUsers(userData);
      } else {
        console.error('❌ Search failed:', response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error('❌ Error searching users:', error);
      setUsers([]);
    } finally {
      // ALWAYS set loading to false
      setLoading(false);
      console.log('🔍 searchUsers completed');
    }
  };

  // Initial load effect
  useEffect(() => {
    console.log('📍 Initial load effect triggered');
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setLoading(true); // Start loading
        await loadFilterOptions();
        await loadAllUsers();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        if (mounted) {
          setLoading(false); // Stop loading only if still mounted
        }
      }
    };

    loadInitialData();

    // Cleanup function
    return () => {
      mounted = false;
      console.log('🧹 Component unmounting, cleanup done');
    };
  }, []); // Empty dependency array - only run once on mount

  // Effect for loading courses
  useEffect(() => {
    console.log('📚 Program changed:', selectedProgramId);
    let mounted = true;

    const loadCourses = async () => {
      if (selectedProgramId && mounted) {
        try {
          await loadCoursesForProgram(selectedProgramId);
        } catch (error) {
          console.error('Error loading courses:', error);
        }
      } else if (mounted) {
        setFilterOptions(prev => ({ ...prev, courses: [] }));
      }
    };

    loadCourses();

    return () => {
      mounted = false;
    };
  }, [selectedProgramId]);

  // Loading timeout effect
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.error('⏰ Loading timeout - forcefully stopping');
        setLoading(false);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  // Also add this test function you can call from browser console
  window.testAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Testing authentication...');
    console.log('Token from localStorage:', token);
    
    if (!token) {
      console.error('No token found!');
      return;
    }
    
    try {
      // Test basic auth
      const response = await fetch('http://localhost:3001/api/test-auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Auth test passed:', data);
      } else {
        console.error('❌ Auth test failed:', response.status);
        const error = await response.text();
        console.error('Error:', error);
      }
      
      // Test search endpoint
      const searchResponse = await fetch('http://localhost:3001/api/search/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Search endpoint status:', searchResponse.status);
      if (!searchResponse.ok) {
        const error = await searchResponse.text();
        console.error('Search error:', error);
      }
    } catch (err) {
      console.error('Test failed:', err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));

    // Handle program selection
    if (field === 'program') {
      const selectedProgram = filterOptions.programs.find(p => p.name === value);
      setSelectedProgramId(selectedProgram ? selectedProgram.id : '');
      
      // Clear course selection when program changes
      setFilters(prev => ({
        ...prev,
        courseCode: '',
        courseName: ''
      }));
    }
  };

  const handleCourseSelection = (courseField, value) => {
    if (courseField === 'courseCode') {
      const selectedCourse = filterOptions.courses.find(c => c.id === value);
      setFilters(prev => ({
        ...prev,
        courseCode: value,
        courseName: selectedCourse ? selectedCourse.name : ''
      }));
    } else if (courseField === 'courseName') {
      const selectedCourse = filterOptions.courses.find(c => c.name === value);
      setFilters(prev => ({
        ...prev,
        courseName: value,
        courseCode: selectedCourse ? selectedCourse.id : ''
      }));
    }
  };

  const handleSearch = () => {
    const searchParams = {};
    
    // Build search parameters based on search type
    if (filters.searchTerm) {
      switch (filters.searchBy) {
        case 'name':
          searchParams.q = filters.searchTerm;
          break;
        case 'email':
          searchParams.email = filters.searchTerm;
          break;
        case 'program':
          searchParams.program = filters.searchTerm;
          break;
        case 'course':
          searchParams.course = filters.searchTerm;
          break;
      }
    }
    
    // Add other filters
    if (filters.role) searchParams.role = filters.role;
    if (filters.program) searchParams.program = filters.program;
    if (filters.year) searchParams.year = filters.year;
    if (filters.courseCode) searchParams.courseCode = filters.courseCode;
    if (filters.courseName) searchParams.courseName = filters.courseName;
    
    searchUsers(searchParams);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: '',
      searchBy: 'name',
      role: '',
      program: '',
      year: '',
      courseCode: '',
      courseName: ''
    });
    setSelectedProgramId('');
    loadAllUsers();
  };

  const sendMessage = async (targetUser) => {
    try {
      setSendingMessage(prev => ({ ...prev, [targetUser.id]: true }));
      
      // Use currentUser prop first, then fallback to localStorage
      let currentUserId = currentUser?.id;
      
      if (!currentUserId) {
        // Fallback to localStorage if currentUser prop is not available
        console.log('CurrentUser prop not available, checking localStorage...');
        
        currentUserId = localStorage.getItem('userId') || 
                       localStorage.getItem('user_id') || 
                       localStorage.getItem('id');
        
        if (!currentUserId) {
          const userString = localStorage.getItem('user') || localStorage.getItem('currentUser');
          if (userString) {
            try {
              const userFromStorage = JSON.parse(userString);
              currentUserId = userFromStorage?.id || userFromStorage?._id || userFromStorage?.userId;
              console.log('Extracted user ID from user object:', currentUserId);
            } catch (e) {
              console.log('Failed to parse user object:', e);
            }
          }
        }
      }
      
      const targetUserId = targetUser.id || targetUser._id;
      
      console.log('Current User ID:', currentUserId);
      console.log('Target User ID:', targetUserId);
      console.log('Current User Object:', currentUser);
      
      // Validate that we have valid IDs
      if (!currentUserId || currentUserId === 'null' || currentUserId === 'undefined') {
        throw new Error(`Current user ID is invalid. Please log in again. Found: ${currentUserId}`);
      }
      
      if (!targetUserId || targetUserId === 'null' || targetUserId === 'undefined') {
        throw new Error('Target user ID is invalid');
      }
      
      // Create a consistent chat ID by sorting the IDs alphabetically
      const chatId = currentUserId < targetUserId 
        ? `direct_${currentUserId}_${targetUserId}`
        : `direct_${targetUserId}_${currentUserId}`;
      
      console.log('Generated Chat ID:', chatId);
      
      const messagePayload = {
        chatId: chatId,
        text: `Hi ${targetUser.firstName || targetUser.name}! I found you through the browse page and would love to connect.`,
        type: 'text'
      };
      
      console.log('Message Payload:', messagePayload);
      
      const response = await fetch('http://localhost:3001/api/chat/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent successfully:', result);
        
        // Store info for the chat to auto-select when navigating
        sessionStorage.setItem('selectedChatId', chatId);
        sessionStorage.setItem('newChatTarget', JSON.stringify({
          id: targetUserId,
          name: `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim(),
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          email: targetUser.email
        }));
        
        // Show success and navigate
        alert(`Message sent to ${targetUser.firstName || targetUser.name}! Opening chat...`);
        navigate('/chat');
        
      } else {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        throw new Error(`Failed to send message: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setSendingMessage(prev => ({ ...prev, [targetUser.id]: false }));
    }
  };

  const viewProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/search/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const profile = await response.json();
        // You can implement a modal or navigate to a profile page
        console.log('User profile:', profile);
        alert(`Profile: ${profile.name}\nProgram: ${profile.program}\nEmail: ${profile.email}`);
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile. Please try again.');
    }
  };

  const sortUsers = (users, sortBy) => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'program':
          return (a.program || '').localeCompare(b.program || '');
        default:
          return 0;
      }
    });
  };

  const sortedUsers = sortUsers(users, sortBy);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Student': return '🎓';
      case 'Mentor': return '👨‍🏫';
      case 'Alumni': return '🎖️';
      default: return '👤';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Mentor': return 'mentor';
      case 'Alumni': return 'alumni';
      default: return '';
    }
  };

  return (
    <div className="browse-container">
      <div className="browse-wrapper">
        {/* Header */}
        <div className="browse-header">
          <h1 className="browse-title">
            {role === 'Student' ? '🔍 Discover Your Campus Community' : '🌟 Find Students to Mentor'}
          </h1>
          <p className="browse-subtitle">
            {role === 'Student' 
              ? 'Connect with mentors, alumni, and fellow students' 
              : 'Discover talented students looking for guidance'}
          </p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-header">
            <span className="search-icon">🔍</span>
            <h2 className="search-label">Advanced Search</h2>
          </div>
          
          <div className="search-form">
            {/* Search term and search by */}
            <div className="search-row">
              <div className="search-group">
                <label><span className="emoji">🔍</span> Search Term</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter search term..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
              
              <div className="search-group">
                <label><span className="emoji">📋</span> Search By</label>
                <select
                  className="search-select"
                  value={filters.searchBy}
                  onChange={(e) => handleFilterChange('searchBy', e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="program">Program</option>
                  <option value="course">Course</option>
                </select>
              </div>
            </div>

            {/* Role, Program, Year */}
            <div className="search-row">
              <div className="search-group">
                <label><span className="emoji">👤</span> Role</label>
                <select
                  className="search-select"
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <option value="">All Roles</option>
                  {filterOptions.roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="search-group">
                <label><span className="emoji">📚</span> Program</label>
                <select
                  className="search-select"
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  disabled={loadingOptions}
                >
                  <option value="">All Programs</option>
                  {filterOptions.programs.map(program => (
                    <option key={program.id} value={program.name}>
                      {program.name} {program.code ? `(${program.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="search-group">
                <label><span className="emoji">📅</span> Year</label>
                <select
                  className="search-select"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course filters */}
            <div className="search-row">
              <div className="search-group">
                <label><span className="emoji">📖</span> Course Code</label>
                <select
                  className="search-select"
                  value={filters.courseCode}
                  onChange={(e) => handleCourseSelection('courseCode', e.target.value)}
                  disabled={!selectedProgramId || filterOptions.courses.length === 0}
                >
                  <option value="">
                    {!selectedProgramId ? 'Select a program first' : 
                     filterOptions.courses.length === 0 ? 'No courses available' : 'All Course Codes'}
                  </option>
                  {filterOptions.courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.id}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="search-group">
                <label><span className="emoji">📝</span> Course Name</label>
                <select
                  className="search-select"
                  value={filters.courseName}
                  onChange={(e) => handleCourseSelection('courseName', e.target.value)}
                  disabled={!selectedProgramId || filterOptions.courses.length === 0}
                >
                  <option value="">
                    {!selectedProgramId ? 'Select a program first' : 
                     filterOptions.courses.length === 0 ? 'No courses available' : 'All Course Names'}
                  </option>
                  {filterOptions.courses.map(course => (
                    <option key={course.id} value={course.name}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected course info */}
              {filters.courseCode && filters.courseName && (
                <div className="search-group">
                  <label><span className="emoji">ℹ️</span> Selected Course</label>
                  <div className="course-info">
                    <strong>{filters.courseCode}</strong>: {filters.courseName}
                  </div>
                </div>
              )}
            </div>

            {/* Search buttons */}
            <div className="search-buttons">
              <button className="btn btn-primary" onClick={handleSearch}>
                🔍 Search Users
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                🔄 Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="results-section">
          <div className="results-header">
            <h3 className="results-title">
              👥 Search Results
              <span className="results-count">{sortedUsers.length} found</span>
            </h3>
            
            <div className="sort-controls">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="role">Role</option>
                <option value="email">Email</option>
                <option value="program">Program</option>
              </select>
            </div>
          </div>

          <div className="results-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching for users...</p>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="no-results-container">
                <div className="no-results-icon">🔍</div>
                <h3>No users found</h3>
                <p>Try adjusting your search filters or search terms.</p>
              </div>
            ) : (
              sortedUsers.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-header">
                    <div className="user-info">
                      <h4 className="user-name">
                        {getRoleIcon(user.role)} {user.firstName} {user.lastName}
                        <span className={`user-role-badge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </h4>
                      <p className="user-email">✉️ {user.email}</p>
                    </div>
                  </div>
                  
                  <div className="user-details">
                    {user.program && (
                      <div className="detail-item">
                        <span className="detail-icon">📚</span>
                        <span>Program: {user.program}</span>
                      </div>
                    )}
                    {user.year && (
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>Year: {user.year}</span>
                      </div>
                    )}
                    {user.courseCode && (
                      <div className="detail-item">
                        <span className="detail-icon">📖</span>
                        <span>Course: {user.courseCode}</span>
                      </div>
                    )}
                    {user.interests && (
                      <div className="detail-item">
                        <span className="detail-icon">💡</span>
                        <span>Interests: {user.interests}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="user-actions">
                    <button
                      className="btn-message"
                      onClick={() => sendMessage(user)}
                      disabled={sendingMessage[user.id]}
                    >
                      {sendingMessage[user.id] ? '⏳ Sending...' : '💬 Send Message'}
                    </button>
                    <button 
                      className="btn-profile"
                      onClick={() => viewProfile(user.id)}
                    >
                      👤 View Profile
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;