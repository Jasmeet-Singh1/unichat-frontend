import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './profile-modal.css';

const UserProfileModal = ({ isOpen, onClose, userId, currentUser, onSendMessage }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // lock page
    return () => {
      document.body.style.overflow = prev;
    }; // unlock on close
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserProfile();
    }
  }, [isOpen, userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:3001/api/userProfile/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Loaded complete profile data:', userData);
        setProfile(userData);
      } else {
        throw new Error('Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (profile && onSendMessage) {
      onSendMessage(profile);
      onClose();
    }
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

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Mentor':
        return 'mentor-badge';
      case 'Alumni':
        return 'alumni-badge';
      default:
        return 'student-badge';
    }
  };

  const getDefaultAvatar = (role, firstName) => {
    const initial = firstName ? firstName.charAt(0).toUpperCase() : '?';
    const roleIcon = getRoleIcon(role);
    return (
      <div className='avatar-content'>
        <div className='avatar-initial'>{initial}</div>
        <div className='avatar-role-icon'>{roleIcon}</div>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAvailability = (availability) => {
    if (!availability || availability.length === 0) return 'Not specified';

    return availability
      .map((slot) => {
        const fromTime = `${slot.from.hour}:${slot.from.minute.toString().padStart(2, '0')} ${slot.from.ampm}`;
        const toTime = `${slot.to.hour}:${slot.to.minute.toString().padStart(2, '0')} ${slot.to.ampm}`;
        return `${slot.day}: ${fromTime} - ${toTime}`;
      })
      .join(', ');
  };

  const formatJobDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className='modal-overlay'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className='profile-modal enhanced'
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {loading ? (
            <div className='loading-content'>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <h3>Loading profile...</h3>
              <p>Please wait while we fetch the user information</p>
            </div>
          ) : error ? (
            <div className='error-content'>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
              <h3>Error Loading Profile</h3>
              <p>{error}</p>
              <button className='retry-btn' onClick={loadUserProfile}>
                Try Again
              </button>
            </div>
          ) : profile ? (
            <>
              {/* Enhanced Header */}
              <div className='modal-header enhanced-header'>
                <button className='close-btn' onClick={onClose}>
                  ×
                </button>

                <div className='profile-avatar enhanced-avatar'>
                  {getDefaultAvatar(profile.role, profile.firstName)}
                </div>

                <div className='profile-header-info'>
                  <h2 className='profile-name'>
                    {profile.firstName} {profile.lastName}
                  </h2>

                  <span className={`profile-role ${getRoleBadgeClass(profile.role)}`}>{profile.role}</span>

                  <div className='profile-meta'>
                    <p className='profile-username'>@{profile.username || 'Not set'}</p>
                    {profile.program && <p className='profile-program'>{profile.program}</p>}
                    {profile.programType && <p className='profile-program-type'>{profile.programType}</p>}
                  </div>
                </div>
              </div>

              <div className='modal-content enhanced-content'>
                {/* Basic Information Section */}
                <div className='info-section'>
                  <h3 className='section-title'>👤 Basic Information</h3>
                  <div className='info-cards'>
                    <div className='info-card'>
                      <div className='info-label'>Full Name</div>
                      <div className='info-value'>
                        {profile.firstName} {profile.lastName}
                      </div>
                    </div>
                    <div className='info-card'>
                      <div className='info-label'>Username</div>
                      <div className='info-value'>@{profile.username || 'Not set'}</div>
                    </div>
                    <div className='info-card'>
                      <div className='info-label'>Role</div>
                      <div className='info-value'>{profile.role}</div>
                    </div>
                    {profile.email && (
                      <div className='info-card'>
                        <div className='info-label'>Email</div>
                        <div className='info-value'>{profile.email}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div className='info-section'>
                  <h3 className='section-title'>🎓 Academic Information</h3>
                  <div className='info-cards'>
                    {profile.program && (
                      <div className='info-card'>
                        <div className='info-label'>Program</div>
                        <div className='info-value'>{profile.program}</div>
                      </div>
                    )}
                    {profile.programType && (
                      <div className='info-card'>
                        <div className='info-label'>Program Type</div>
                        <div className='info-value'>{profile.programType}</div>
                      </div>
                    )}
                    {profile.graduationYear && (
                      <div className='info-card'>
                        <div className='info-label'>
                          {profile.role === 'Alumni' ? 'Graduated' : 'Expected Graduation'}
                        </div>
                        <div className='info-value'>{profile.graduationYear}</div>
                      </div>
                    )}
                    {profile.expectedGradDate && (
                      <div className='info-card'>
                        <div className='info-label'>Expected Graduation Date</div>
                        <div className='info-value'>{formatDate(profile.expectedGradDate)}</div>
                      </div>
                    )}
                    {profile.gradDate && (
                      <div className='info-card'>
                        <div className='info-label'>Graduation Date</div>
                        <div className='info-value'>{formatDate(profile.gradDate)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Courses Enrolled */}
                {profile.coursesEnrolled && profile.coursesEnrolled.length > 0 && (
                  <div className='info-section'>
                    <h3 className='section-title'>📚 Enrolled Courses</h3>
                    <div className='courses-list'>
                      {profile.coursesEnrolled.map((course, index) => (
                        <div key={index} className='course-item'>
                          <div className='course-header'>
                            <span className='course-name'>{course.course}</span>
                            {course.semester && course.year && (
                              <span className='course-term'>
                                {course.semester} {course.year}
                              </span>
                            )}
                          </div>
                          {course.courseName && <div className='course-description'>{course.courseName}</div>}
                          {course.instructor && (
                            <div className='course-instructor'>Instructor: {course.instructor}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Role-Specific Information */}
                {profile.role === 'Student' && profile.studentClubs && profile.studentClubs.length > 0 && (
                  <div className='info-section'>
                    <h3 className='section-title'>🏛️ Student Clubs & Organizations</h3>
                    <div className='clubs-list'>
                      {profile.studentClubs.map((club, index) => (
                        <div key={index} className='club-item'>
                          <span className='club-name'>{club.club}</span>
                          <span className='club-role'>{club.designation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.role === 'Mentor' && (
                  <div className='info-section'>
                    <h3 className='section-title'>👨‍🏫 Mentorship Information</h3>

                    {profile.courseExpertise && profile.courseExpertise.length > 0 && (
                      <div className='subsection'>
                        <h4 className='subsection-title'>Course Expertise</h4>
                        <div className='expertise-grid'>
                          {profile.courseExpertise?.map((ex, i) => (
                            <div key={i} className='expertise-card'>
                              <div className='expertise-header'>
                                <span className='course-code'>{ex.course}</span>
                                {ex.grade && <span className='grade-badge'>{ex.grade}</span>}
                              </div>
                              {ex.courseName && <div className='expertise-name'>{ex.courseName}</div>}
                              {ex.topicsCovered?.length > 0 && (
                                <div className='topics-covered'>
                                  <strong>Topics:</strong> {ex.topicsCovered.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='info-cards'>
                      {profile.availability?.length > 0 && (
                        <div className='availability-card'>
                          <div className='availability-header'>
                            <span className='availability-title'>Availability</span>
                            <span className='availability-icon'>🕒</span>
                          </div>

                          <ul className='availability-list'>
                            {profile.availability.map((a, i) => (
                              <li key={i} className='availability-slot'>
                                <span className='day'>{a.day}</span>
                                <span className='time'>
                                  {a.from} – {a.to}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {profile.overallGPA && (
                        <div className='info-card'>
                          <div className='info-label'>Overall GPA</div>
                          <div className='info-value'>{profile.overallGPA}</div>
                        </div>
                      )}
                      {profile.experience && (
                        <div className='info-card full-width'>
                          <div className='info-label'>Experience</div>
                          <div className='info-value'>{profile.experience}</div>
                        </div>
                      )}
                      {profile.expertiseDescription && (
                        <div className='info-card full-width'>
                          <div className='info-label'>Expertise Description</div>
                          <div className='info-value'>{profile.expertiseDescription}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {profile.role === 'Alumni' && profile.currentJob && (
                  <div className='info-section'>
                    <h3 className='section-title'>🎖️ Alumni Information</h3>
                    <div className='info-cards'>
                      {profile.currentJob.companyName && (
                        <div className='info-card'>
                          <div className='info-label'>Current Company</div>
                          <div className='info-value'>{profile.currentJob.companyName}</div>
                        </div>
                      )}
                      {profile.currentJob.jobTitle && (
                        <div className='info-card'>
                          <div className='info-label'>Job Title</div>
                          <div className='info-value'>{profile.currentJob.jobTitle}</div>
                        </div>
                      )}
                      {profile.currentJob.startDate && (
                        <div className='info-card'>
                          <div className='info-label'>Started</div>
                          <div className='info-value'>
                            {formatJobDate(profile.currentJob.startDate)}
                            {profile.currentJob.isPresent && ' - Present'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bio Section */}
                {profile.bio && (
                  <div className='info-section'>
                    <h3 className='section-title'>📝 About</h3>
                    <div className='bio-section'>
                      <p className='bio-text'>{profile.bio}</p>
                    </div>
                  </div>
                )}

                {/* Interests */}
                {profile.interests && (
                  <div className='info-section'>
                    <h3 className='section-title'>💡 Interests</h3>
                    <div className='interests-text'>{profile.interests}</div>
                  </div>
                )}

                {/* Skills Section */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className='info-section'>
                    <h3 className='section-title'>🔧 Skills</h3>
                    <div className='skills-list'>
                      {profile.skills.map((skill, index) => (
                        <span key={index} className='skill-tag'>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {profile.socialLinks && Object.values(profile.socialLinks).some((link) => link) && (
                  <div className='info-section'>
                    <h3 className='section-title'>🌐 Connect</h3>
                    <div className='social-links'>
                      {profile.socialLinks.linkedin && (
                        <a
                          href={profile.socialLinks.linkedin}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='social-link'
                        >
                          💼 LinkedIn
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a
                          href={profile.socialLinks.github}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='social-link'
                        >
                          💻 GitHub
                        </a>
                      )}
                      {profile.socialLinks.twitter && (
                        <a
                          href={profile.socialLinks.twitter}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='social-link'
                        >
                          🐦 Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Account Information */}
                {profile.createdAt && (
                  <div className='info-section'>
                    <h3 className='section-title'>📅 Account Information</h3>
                    <div className='info-cards'>
                      <div className='info-card'>
                        <div className='info-label'>Member Since</div>
                        <div className='info-value'>{formatDate(profile.createdAt)}</div>
                      </div>
                      {profile.updatedAt && (
                        <div className='info-card'>
                          <div className='info-label'>Last Updated</div>
                          <div className='info-value'>{formatDate(profile.updatedAt)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className='modal-actions'>
                <button className='action-btn btn-message' onClick={handleSendMessage}>
                  💬 Send Message
                </button>
                <button className='action-btn btn-secondary' onClick={onClose}>
                  ✕ Close
                </button>
              </div>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserProfileModal;
