import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './profile-styles.css'; // Import the separate CSS file

const Profile = ({ role, currentUser }) => {
  const [profileData, setProfileData] = useState({
    id: '',
    _id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    role: '',
    program: '',
    graduationYear: '',
    interests: '',
    bio: '',
    profilePicture: null,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
    },
    skills: [],
    courses: [],
    achievements: [],
    coursesEnrolled: [],
    studentClubs: [],
    expectedGradDate: null,
    programType: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [programs, setPrograms] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [studentClubs, setStudentClubs] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');

  // Editing states
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingClub, setEditingClub] = useState(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddClub, setShowAddClub] = useState(false);

  // New course/club forms
  const [newCourse, setNewCourse] = useState({
    course: '',
    courseName: '',
    semester: '',
    year: '',
    instructor: '',
  });

  const [newClub, setNewClub] = useState({
    club: '',
    designation: 'Member',
  });

  useEffect(() => {
    loadProfileData();
    loadPrograms();
    loadStudentClubs();
  }, []);

  // Load courses when program changes
  useEffect(() => {
    if (selectedProgramId) {
      loadCoursesForProgram(selectedProgramId);
    }
  }, [selectedProgramId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      console.log('🔍 Loading profile data...');
      console.log('🔍 Token exists:', !!token);
      console.log('🔍 Current user prop:', currentUser);

      if (!token) {
        console.error('Missing authentication token');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/userProfile/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔍 Response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('🔍 Complete loaded profile data:', userData);

        setProfileData({
          id: userData.id || userData._id || '',
          _id: userData._id || userData.id || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || '',
          role: userData.role || '',
          program: userData.program || '',
          programType: userData.programType || '',
          graduationYear: userData.graduationYear || userData.year || '',
          interests: userData.interests || '',
          bio: userData.bio || userData.description || '',
          profilePicture: userData.profilePicture || null,
          socialLinks: userData.socialLinks || {
            linkedin: '',
            github: '',
            twitter: '',
          },
          skills: userData.skills || [],
          courses: userData.courses || [],
          achievements: userData.achievements || [],
          coursesEnrolled: userData.coursesEnrolled || [],
          studentClubs: userData.studentClubs || [],
          expectedGradDate: userData.expectedGradDate || null,
        });

        // Find and set the program ID for loading courses
        if (userData.program) {
          const matchingProgram = programs.find((p) => p.name === userData.program);
          if (matchingProgram) {
            setSelectedProgramId(matchingProgram._id);
          }
        }

        console.log('🔍 Set profile data with academic fields:', {
          coursesEnrolled: userData.coursesEnrolled,
          studentClubs: userData.studentClubs,
          expectedGradDate: userData.expectedGradDate,
          role: userData.role,
          username: userData.username,
        });
      } else {
        console.error('Failed to load profile:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/programs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const programsData = await response.json();
        setPrograms(programsData);
        console.log('📚 Loaded programs:', programsData);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadCoursesForProgram = async (programId) => {
    try {
      console.log('📖 Loading courses for program:', programId);
      const response = await fetch(`http://localhost:3001/api/programs/${programId}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const coursesData = await response.json();
        setAvailableCourses(coursesData);
        console.log('📖 Loaded courses:', coursesData);
      } else {
        console.error('Failed to load courses for program');
        setAvailableCourses([]);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setAvailableCourses([]);
    }
  };

  const loadStudentClubs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getClubs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const clubsData = await response.json();
        setStudentClubs(clubsData);
        console.log('🏛️ Loaded clubs:', clubsData);
      }
    } catch (error) {
      console.error('Error loading clubs:', error);
    }
  };

  const handleProgramChange = async (programName) => {
    // Find the program object
    const selectedProgram = programs.find((p) => p.name === programName);

    if (selectedProgram) {
      setSelectedProgramId(selectedProgram._id);

      // Auto-fill program details
      try {
        const response = await fetch(`http://localhost:3001/api/programs/${selectedProgram._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const programDetails = await response.json();
          console.log('📋 Program details:', programDetails);

          setProfileData((prev) => ({
            ...prev,
            program: programName,
            programType: programDetails.programType || programDetails.type || '',
          }));
        }
      } catch (error) {
        console.error('Error loading program details:', error);
      }
    } else {
      setSelectedProgramId('');
      setAvailableCourses([]);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setProfileData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Course management functions
  const addCourse = () => {
    if (newCourse.course.trim()) {
      setProfileData((prev) => ({
        ...prev,
        coursesEnrolled: [...prev.coursesEnrolled, { ...newCourse }],
      }));
      setNewCourse({
        course: '',
        courseName: '',
        semester: '',
        year: '',
        instructor: '',
      });
      setShowAddCourse(false);
    }
  };

  const editCourse = (index, updatedCourse) => {
    setProfileData((prev) => ({
      ...prev,
      coursesEnrolled: prev.coursesEnrolled.map((course, i) => (i === index ? updatedCourse : course)),
    }));
    setEditingCourse(null);
  };

  const removeCourse = (index) => {
    setProfileData((prev) => ({
      ...prev,
      coursesEnrolled: prev.coursesEnrolled.filter((_, i) => i !== index),
    }));
  };

  // Club management functions
  const addClub = () => {
    if (newClub.club.trim()) {
      setProfileData((prev) => ({
        ...prev,
        studentClubs: [...prev.studentClubs, { ...newClub }],
      }));
      setNewClub({
        club: '',
        designation: 'Member',
      });
      setShowAddClub(false);
    }
  };

  const editClub = (index, updatedClub) => {
    setProfileData((prev) => ({
      ...prev,
      studentClubs: prev.studentClubs.map((club, i) => (i === index ? updatedClub : club)),
    }));
    setEditingClub(null);
  };

  const removeClub = (index) => {
    setProfileData((prev) => ({
      ...prev,
      studentClubs: prev.studentClubs.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage('');

      const token = localStorage.getItem('token');
      const userId = profileData.id || profileData._id || localStorage.getItem('userId') || currentUser?.id;

      console.log('🔍 Saving profile...');
      console.log('🔍 User ID:', userId);
      console.log('🔍 Profile data to save:', profileData);

      if (!userId) {
        setMessage('❌ Error: Unable to determine user ID. Please refresh and try again.');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/userProfile/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      console.log('🔍 Save response status:', response.status);

      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('🔍 Save error data:', errorData);
        setMessage(`❌ Error: ${errorData.message || 'Failed to update profile'}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('❌ Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 6; i++) {
      years.push(i);
    }
    return years;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Student':
        return '🎓';
      case 'Mentor':
        return '👨‍🏫';
      case 'Alumni':
        return '🎖️';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '48px' }}>⏳</div>
        <h3>Loading your profile...</h3>
      </div>
    );
  }

  const toText = (v) => {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    if (Array.isArray(v)) return v.map(toText).join(', ');
    if (typeof v === 'object') return toText(v.label ?? v.value ?? v.name ?? v.title ?? v.text ?? v.club);
    return String(v);
  };

  const normalizeClub = (c) => ({
    club: toText(c?.club ?? c), // accept string or object
    designation: toText(c?.designation ?? c?.role ?? ''),
    _id: c?._id,
  });

  console.log('clubsinProfile', studentClubs);

  return (
    <motion.div
      className='profile-container'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='profile-header'>
        <h1 className='profile-title'>👤 Your Profile</h1>
        <p className='profile-subtitle'>Customize your profile to connect better with your university community</p>
        {profileData.role && (
          <div className='profile-role-badge'>
            {getRoleIcon(profileData.role)} {profileData.role}
          </div>
        )}
      </div>

      <div className='profile-tabs'>
        {[
          { id: 'basic', label: '📝 Basic Info' },
          { id: 'academic', label: '🎓 Academic' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='profile-content'>
        {activeTab === 'basic' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 30 }}>📝 Basic Information</h3>
            <div className='form-grid'>
              <div className='form-group'>
                <label className='form-label'>👤 First Name *</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder='Enter your first name'
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>👤 Last Name *</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder='Enter your last name'
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>🏷️ Username</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder='Enter your username'
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>🎭 Role</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.role}
                  readOnly
                  title='Role cannot be changed'
                />
              </div>

              <div className='form-group form-group-full'>
                <label className='form-label'>✉️ University Email *</label>
                <input
                  type='email'
                  className='form-input'
                  value={profileData.email}
                  readOnly
                  title='Email cannot be changed'
                />
              </div>

              <div className='form-group form-group-full'>
                <label className='form-label'>📄 Bio</label>
                <textarea
                  className='form-textarea'
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself, your goals, and what you're passionate about..."
                />
              </div>

              <div className='form-group form-group-full'>
                <label className='form-label'>🔧 Skills</label>
                <SkillInput
                  skills={profileData.skills}
                  onAdd={(skill) => handleArrayAdd('skills', skill)}
                  onRemove={(index) => handleArrayRemove('skills', index)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div>
            <h3 style={{ marginTop: 0, marginBottom: 30 }}>🎓 Academic Information</h3>
            <div className='form-grid'>
              <div className='form-group'>
                <label className='form-label'>📚 Program *</label>
                <select
                  className='form-select'
                  value={profileData.program}
                  onChange={(e) => handleProgramChange(e.target.value)}
                >
                  <option value=''>Select your program</option>
                  {programs.map((program) => (
                    <option key={program._id} value={program.name}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label className='form-label'>🏫 Program Type</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.programType}
                  readOnly
                  title='Auto-filled based on selected program'
                  placeholder='Will be auto-filled when program is selected'
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>📅 Graduation Year</label>
                <select
                  className='form-select'
                  value={profileData.graduationYear}
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                >
                  <option value=''>Select graduation year</option>
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className='form-group'>
                <label className='form-label'>📊 Expected Graduation Date</label>
                <input
                  type='date'
                  className='form-input'
                  value={profileData.expectedGradDate ? profileData.expectedGradDate.split('T')[0] : ''}
                  onChange={(e) => handleInputChange('expectedGradDate', e.target.value)}
                />
              </div>

              <div className='form-group form-group-full'>
                <label className='form-label'>💡 Interests & Hobbies</label>
                <input
                  type='text'
                  className='form-input'
                  value={profileData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                  placeholder='e.g., Data Science, UI/UX, Mentorship, Basketball, Photography'
                />
              </div>

              {/* COURSES ENROLLED SECTION */}
              <div className='form-group form-group-full'>
                <div className='section-header'>
                  <h4 className='section-title'>📚 Courses Enrolled</h4>
                  <button
                    className='btn btn-add'
                    onClick={() => setShowAddCourse(true)}
                    title={!selectedProgramId ? 'Please select a program first' : 'Add a new course'}
                  >
                    + Add Course
                  </button>
                </div>

                {showAddCourse && (
                  <CourseForm
                    course={newCourse}
                    onChange={setNewCourse}
                    onSave={addCourse}
                    onCancel={() => setShowAddCourse(false)}
                    title='Add New Course'
                    availableCourses={availableCourses}
                  />
                )}

                <div className='list-stack'>
                  {profileData.coursesEnrolled?.length ? (
                    profileData.coursesEnrolled.map((course, index) => {
                      if (editingCourse === index) {
                        return (
                          <CourseForm
                            key={index}
                            course={course}
                            onChange={(updated) => editCourse(index, updated)}
                            onSave={() => setEditingCourse(null)}
                            onCancel={() => setEditingCourse(null)}
                            title='Edit Course'
                            availableCourses={availableCourses}
                          />
                        );
                      }

                      const asObj = (c) => (typeof c === 'object' && c) || {};
                      const cObj = asObj(course);
                      const code =
                        typeof course === 'string'
                          ? course
                          : cObj.course || cObj.courseCode || cObj.code || 'Unknown';
                      const name = cObj.courseName || '';
                      const sem = cObj.semester || '';
                      const year = cObj.year || '';
                      const inst = cObj.instructor || '';

                      return (
                        <div key={index} className='list-card'>
                          <div className='card-main'>
                            <strong className='card-title'>{String(code)}</strong>
                            {name && <div className='card-sub'>{String(name)}</div>}
                            {(sem || year || inst) && (
                              <div className='card-meta'>
                                {sem} {year}
                                {inst && ` • Instructor: ${inst}`}
                              </div>
                            )}
                          </div>
                          <div className='card-actions'>
                            <button className='remove-btn' onClick={() => removeCourse(index)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='empty-state'>
                      {selectedProgramId
                        ? 'No courses yet. Click "Add Course" to add your first.'
                        : 'Please select a program first to add courses.'}
                    </div>
                  )}
                </div>
              </div>

              {/* STUDENT CLUBS SECTION */}
              {profileData.role === 'Student' && (
                <div className='form-group form-group-full'>
                  <div className='section-header'>
                    <h4 className='section-title'>🏛️ Student Clubs & Organizations</h4>
                    <button className='btn btn-add' onClick={() => setShowAddClub(true)}>
                      + Add Club
                    </button>
                  </div>

                  {showAddClub && (
                    <ClubForm
                      club={newClub}
                      onChange={setNewClub}
                      onSave={addClub}
                      onCancel={() => setShowAddClub(false)}
                      title='Add New Club'
                      availableClubs={studentClubs}
                    />
                  )}

                  <div className='list-stack'>
                    {profileData.studentClubs?.length ? (
                      profileData.studentClubs.map((club, index) => {
                        console.log('club', club);
                        if (editingClub === index) {
                          return (
                            <ClubForm
                              key={index}
                              club={club}
                              onChange={(updated) => editClub(index, updated)}
                              onSave={() => setEditingClub(null)}
                              onCancel={() => setEditingClub(null)}
                              title='Edit Club'
                              availableClubs={studentClubs}
                            />
                          );
                        }

                        const asObj = (c) => (typeof c === 'object' && c) || {};
                        const cObj = asObj(club);
                        const name = club.club._id;
                        const role = cObj.designation || cObj.role || '';

                        return (
                          <div key={index} className='list-card list-card--club'>
                            <div className='card-main'>
                              <strong className='card-title'>{name}</strong>
                              {role && <div className='card-meta'>Role: {String(role)}</div>}
                            </div>
                            <div className='card-actions'>
                              <button className='remove-btn' onClick={() => removeClub(index)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='empty-state'>Not part of any clubs yet. Click “Add Club”.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className='save-section'>
          <button className='save-btn' onClick={saveProfile} disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>

          {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
        </div>
      </div>
    </motion.div>
  );
};

// Course Form Component with Dropdown Support
const CourseForm = ({ course, onChange, onSave, onCancel, title, availableCourses = [] }) => {
  const handleChange = (field, value) => {
    if (field === 'course') {
      // Find the selected course and auto-fill course name
      const selectedCourse = availableCourses.find((c) => c._id === value);
      onChange({
        ...course,
        course: value,
        courseName: selectedCourse ? selectedCourse.name : '',
      });
    } else {
      onChange({ ...course, [field]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (course.course.trim()) {
      onSave();
    }
  };

  return (
    <div className='course-form'>
      <h4>{title}</h4>
      <form onSubmit={handleSubmit}>
        <div className='course-form-grid'>
          <div className='form-group'>
            <label className='form-label'>Course *</label>
            <select
              className='form-select'
              value={course.course}
              onChange={(e) => handleChange('course', e.target.value)}
              required
            >
              <option value=''>Select a course</option>
              {availableCourses.map((courseOption) => (
                <option key={courseOption._id} value={courseOption._id}>
                  {courseOption._id} - {courseOption.name}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label className='form-label'>Course Name</label>
            <input
              type='text'
              className='form-input'
              value={course.courseName}
              readOnly
              placeholder='Auto-filled from course selection'
              title='Auto-filled when course is selected'
            />
          </div>
          <div className='form-group'>
            <label className='form-label'>Semester</label>
            <select
              className='form-select'
              value={course.semester}
              onChange={(e) => handleChange('semester', e.target.value)}
            >
              <option value=''>Select semester</option>
              <option value='Fall'>Fall</option>
              <option value='Spring'>Spring</option>
              <option value='Summer'>Summer</option>
            </select>
          </div>
          <div className='form-group'>
            <label className='form-label'>Year</label>
            <input
              type='number'
              className='form-input'
              value={course.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder='2024'
              min='2020'
              max='2030'
            />
          </div>
          <div className='form-group course-form-full'>
            <label className='form-label'>Instructor</label>
            <input
              type='text'
              className='form-input'
              value={course.instructor}
              onChange={(e) => handleChange('instructor', e.target.value)}
              placeholder='Professor Name'
            />
          </div>
        </div>
        <div className='form-actions'>
          <button type='button' className='cancel-btn' onClick={onCancel}>
            Cancel
          </button>
          <button type='submit' className='add-btn'>
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
};

// Club Form Component with Dropdown Support
const ClubForm = ({ club, onChange, onSave, onCancel, title, availableClubs = [] }) => {
  const handleChange = (field, value) => {
    onChange({ ...club, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (club.club.trim()) {
      onSave();
    }
  };

  return (
    <div className='club-form'>
      <h4>{title}</h4>
      <form onSubmit={handleSubmit}>
        <div className='course-form-grid'>
          <div className='form-group'>
            <label className='form-label'>Club Name *</label>
            <select
              className='form-select'
              value={club.club}
              onChange={(e) => handleChange('club', e.target.value)}
              required
            >
              <option value=''>Select a club</option>
              {availableClubs.map((clubOption) => (
                <option key={clubOption._id} value={clubOption.name || clubOption.clubName}>
                  {clubOption._id}
                </option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label className='form-label'>Your Role</label>
            <select
              className='form-select'
              value={club.designation}
              onChange={(e) => handleChange('designation', e.target.value)}
            >
              <option value='Member'>Member</option>
              <option value='Executive'>Executive</option>
              <option value='President'>President</option>
              <option value='Vice President'>Vice President</option>
              <option value='Secretary'>Secretary</option>
              <option value='Treasurer'>Treasurer</option>
              <option value='Event Coordinator'>Event Coordinator</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>
        <div className='form-actions'>
          <button type='button' className='cancel-btn' onClick={onCancel}>
            Cancel
          </button>
          <button type='submit' className='add-btn'>
            Save Club
          </button>
        </div>
      </form>
    </div>
  );
};

// Skills input component
const SkillInput = ({ skills, onAdd, onRemove }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = () => {
    if (newSkill.trim()) {
      onAdd(newSkill);
      setNewSkill('');
    }
  };

  return (
    <>
      <div className='array-input'>
        <input
          type='text'
          className='form-input'
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder='Add a skill (e.g., JavaScript, Python, Design)'
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button type='button' className='add-btn' onClick={handleAdd}>
          Add
        </button>
      </div>
      <div className='tag-list'>
        {skills.map((skill, index) => (
          <div key={index} className='tag'>
            {skill}
            <button type='button' className='tag-remove' onClick={() => onRemove(index)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profile;
