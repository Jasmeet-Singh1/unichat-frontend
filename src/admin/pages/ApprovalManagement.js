// src/admin/pages/ApprovalManagement.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, CheckCircle, XCircle, Eye, Mail, Calendar, GraduationCap, 
  Award, FileText, Download, School, Briefcase, Clock, User, X
} from 'lucide-react';
import '../styles/AdminPortal.css';

const ApprovalManagement = () => {
  const [activeTab, setActiveTab] = useState('mentors');
  const [pendingMentors, setPendingMentors] = useState([]);
  const [pendingAlumni, setPendingAlumni] = useState([]); // Future use
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const fetchPendingMentors = useCallback(async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(`${apiUrl}/api/admin/approvals/mentors`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setPendingMentors(Array.isArray(data) ? data : []);
      console.log(`Loaded ${data.length} pending mentors`);
      
    } catch (error) {
      console.error('Error fetching pending mentors:', error);
      alert('Error loading pending mentors: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (activeTab === 'mentors') {
      fetchPendingMentors();
    }
    // Add fetchPendingAlumni() when alumni approval is implemented
  }, [activeTab, fetchPendingMentors]);

  const handleViewApplicant = async (applicant) => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      const response = await fetch(`${apiUrl}/api/admin/approvals/mentors/${applicant._id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const detailed = await response.json();
        setSelectedApplicant(detailed);
      } else {
        setSelectedApplicant(applicant);
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching details:', error);
      setSelectedApplicant(applicant);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicantId, applicantName, type = 'mentors') => {
    if (window.confirm(`Approve ${applicantName}? They will receive an email notification.`)) {
      try {
        setActionLoading(true);
        const adminToken = localStorage.getItem('adminToken');
        
        const response = await fetch(`${apiUrl}/api/admin/approvals/${type}/${applicantId}/approve`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          if (type === 'mentors') {
            setPendingMentors(prev => prev.filter(m => m._id !== applicantId));
          }
          alert(`${applicantName} has been approved and notified via email.`);
          closeModal();
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Failed to approve');
        }
      } catch (error) {
        console.error('Error approving:', error);
        alert('Error approving: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleReject = async (applicantId, applicantName, type = 'mentors') => {
    const reason = window.prompt(`Reason for rejecting ${applicantName}:`);
    
    if (reason !== null) {
      try {
        setActionLoading(true);
        const adminToken = localStorage.getItem('adminToken');
        
        const response = await fetch(`${apiUrl}/api/admin/approvals/${type}/${applicantId}/reject`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason })
        });

        if (response.ok) {
          if (type === 'mentors') {
            setPendingMentors(prev => prev.filter(m => m._id !== applicantId));
          }
          alert(`${applicantName} has been rejected and their account deleted.`);
          closeModal();
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Failed to reject');
        }
      } catch (error) {
        console.error('Error rejecting:', error);
        alert('Error rejecting: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplicant(null);
  };

  const currentData = activeTab === 'mentors' ? pendingMentors : pendingAlumni;
  const currentCount = currentData.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Users className="text-blue-600" size={28} />
              Approval Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and process pending applications
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{currentCount}</div>
            <div className="text-sm text-gray-500">Pending {activeTab}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'mentors'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <GraduationCap size={16} className="inline mr-2" />
            Mentors ({pendingMentors.length})
          </button>
          <button
            onClick={() => setActiveTab('alumni')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'alumni'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
            disabled
          >
            <Briefcase size={16} className="inline mr-2" />
            Alumni (Coming Soon)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {loading && currentData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">No pending {activeTab}</p>
            <p className="text-gray-500">All applications have been processed</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentData.map((applicant) => (
              <div key={applicant._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {applicant.firstName?.[0]}{applicant.lastName?.[0]}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {applicant.firstName} {applicant.lastName}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full">
                          {applicant.role}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {applicant.email}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {applicant.program} • Applied {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                      {applicant.courseExpertise && (
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {applicant.courseExpertise.length}
                          </div>
                          <div className="text-gray-500">Courses</div>
                        </div>
                      )}
                      {applicant.showGPA && applicant.overallGPA && (
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {applicant.overallGPA}
                          </div>
                          <div className="text-gray-500">GPA</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {applicant.proof ? applicant.proof.length : 0}
                        </div>
                        <div className="text-gray-500">Files</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewApplicant(applicant)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleApprove(applicant._id, `${applicant.firstName} ${applicant.lastName}`, activeTab)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                      disabled={actionLoading}
                      title="Approve"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(applicant._id, `${applicant.firstName} ${applicant.lastName}`, activeTab)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      disabled={actionLoading}
                      title="Reject"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {showModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedApplicant.firstName?.[0]}{selectedApplicant.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedApplicant.firstName} {selectedApplicant.lastName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedApplicant.role} Application</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Contact & Basic Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <User size={16} className="mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Email:</strong> {selectedApplicant.email}</div>
                      <div><strong>Username:</strong> {selectedApplicant.username}</div>
                      <div><strong>Program:</strong> {selectedApplicant.program}</div>
                      <div><strong>Program Type:</strong> {selectedApplicant.programType}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <School size={16} className="mr-2" />
                      Academic Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedApplicant.showGPA && selectedApplicant.overallGPA && (
                        <div><strong>GPA:</strong> {selectedApplicant.overallGPA}</div>
                      )}
                      {selectedApplicant.expectedGradDate && (
                        <div><strong>Expected Graduation:</strong> {new Date(selectedApplicant.expectedGradDate).toLocaleDateString()}</div>
                      )}
                      <div><strong>Applied:</strong> {selectedApplicant.createdAt ? new Date(selectedApplicant.createdAt).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedApplicant.bio && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Bio</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedApplicant.bio}
                    </p>
                  </div>
                )}

                {/* Course Expertise */}
                {selectedApplicant.courseExpertise && selectedApplicant.courseExpertise.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Award size={16} className="mr-2" />
                      Course Expertise
                    </h4>
                    <div className="space-y-3">
                      {selectedApplicant.courseExpertise.map((course, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">{course.course}</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
                              {course.grade}
                            </span>
                          </div>
                          {course.instructor && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                              <strong>Instructor:</strong> {course.instructor}
                            </div>
                          )}
                          {course.topicsCovered && course.topicsCovered.length > 0 && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>Topics:</strong> {course.topicsCovered.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {selectedApplicant.availability && selectedApplicant.availability.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Clock size={16} className="mr-2" />
                      Availability
                    </h4>
                    <div className="space-y-2">
                      {selectedApplicant.availability.map((timeSlot, idx) => {
                        const formatTime = (timeObj) => {
                          if (!timeObj || typeof timeObj !== 'object' || !timeObj.hour) return '';
                          const hour = timeObj.hour;
                          const minute = timeObj.minute || 0;
                          const ampm = timeObj.ampm || 'AM';
                          return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
                        };

                        const fromTime = formatTime(timeSlot.from);
                        const toTime = formatTime(timeSlot.to);
                        
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {timeSlot.day || 'Day not specified'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {fromTime && toTime ? `${fromTime} - ${toTime}` : 'Time not specified'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Supporting Documents */}
                {selectedApplicant.proof && selectedApplicant.proof.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <FileText size={16} className="mr-2" />
                      Supporting Documents ({selectedApplicant.proof.length})
                    </h4>
                    <div className="grid gap-2">
                      {selectedApplicant.proof.map((file, idx) => {
                        // Check if it's a valid file path/URL
                        const isValidFile = file && file !== 'pending-file-upload' && file.trim() !== '';
                        const fileName = isValidFile ? file.split('/').pop() || file : 'Pending Upload';
                        const fileExtension = isValidFile ? fileName.split('.').pop()?.toLowerCase() : '';
                        
                        const handleViewFile = () => {
                          if (!isValidFile) {
                            alert('File is pending upload');
                            return;
                          }
                          
                          console.log('Attempting to view file:', file); // Debug log
                          
                          // Encode the filename to handle spaces and special characters
                          const encodedFile = encodeURIComponent(file);
                          let fileUrl;
                          
                          // If it's a full URL, use it directly
                          if (file.startsWith('http')) {
                            fileUrl = file;
                          } else {
                            // Construct the URL with proper encoding
                            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                            fileUrl = `${baseUrl}/uploads/${encodedFile}`;
                          }
                          
                          console.log('Opening URL:', fileUrl); // Debug log
                          window.open(fileUrl, '_blank');
                        };

                        const handleDownloadFile = () => {
                          if (!isValidFile) {
                            alert('File is pending upload');
                            return;
                          }
                          
                          console.log('Downloading file:', file); // Debug log
                          const encodedFile = encodeURIComponent(file);
                          const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                          const downloadUrl = file.startsWith('http') ? file : `${baseUrl}/uploads/${encodedFile}`;
                          
                          // Create download link
                          const link = document.createElement('a');
                          link.href = downloadUrl;
                          link.download = fileName;
                          link.target = '_blank';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        };

                        const getFileIcon = () => {
                          if (!isValidFile) return <Clock size={16} className="text-gray-400" />;
                          
                          switch (fileExtension) {
                            case 'pdf':
                              return <FileText size={16} className="text-red-500" />;
                            case 'doc':
                            case 'docx':
                              return <FileText size={16} className="text-blue-500" />;
                            case 'jpg':
                            case 'jpeg':
                            case 'png':
                            case 'gif':
                              return <FileText size={16} className="text-green-500" />;
                            default:
                              return <FileText size={16} className="text-gray-500" />;
                          }
                        };

                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getFileIcon()}
                              <div>
                                <span className="text-sm font-medium block">{fileName}</span>
                                {!isValidFile && (
                                  <span className="text-xs text-gray-500">Awaiting file upload</span>
                                )}
                                {isValidFile && fileExtension && (
                                  <span className="text-xs text-gray-500 uppercase">{fileExtension} file</span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {isValidFile ? (
                                <>
                                  <button 
                                    onClick={handleViewFile}
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                                    title="View File"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    onClick={handleDownloadFile}
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                                    title="Download File"
                                  >
                                    <Download size={16} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs">Pending</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => handleReject(selectedApplicant._id, `${selectedApplicant.firstName} ${selectedApplicant.lastName}`, activeTab)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                <XCircle size={16} className="inline mr-2" />
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedApplicant._id, `${selectedApplicant.firstName} ${selectedApplicant.lastName}`, activeTab)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={actionLoading}
              >
                <CheckCircle size={16} className="inline mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalManagement;