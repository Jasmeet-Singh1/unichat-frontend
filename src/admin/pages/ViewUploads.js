// src/admin/pages/ViewUploads.js
import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Download, Clock, User } from 'lucide-react';
import '../styles/AdminPortal.css';

const ViewUploads = () => {
  const [documents, setDocuments] = useState([
    {
      id: 'D001',
      userName: 'Sarah Lee',
      userRole: 'Mentor',
      documentType: 'Teaching Certificate',
      fileName: 'teaching_cert_sarah_lee.pdf',
      uploadDate: '2025-01-15',
      fileSize: '2.4 MB',
      status: 'Pending'
    },
    {
      id: 'D002',
      userName: 'James Champagne',
      userRole: 'Alumni',
      documentType: 'Degree Certificate',
      fileName: 'degree_james_champagne.pdf',
      uploadDate: '2025-01-14',
      fileSize: '1.8 MB',
      status: 'Approved'
    },
    {
      id: 'D003',
      userName: 'Michael Johnson',
      userRole: 'Student',
      documentType: 'Student ID',
      fileName: 'student_id_michael.jpg',
      uploadDate: '2025-01-13',
      fileSize: '856 KB',
      status: 'Pending'
    },
    {
      id: 'D004',
      userName: 'Lisa Wang',
      userRole: 'Mentor',
      documentType: 'Professional License',
      fileName: 'prof_license_lisa_wang.pdf',
      uploadDate: '2025-01-12',
      fileSize: '3.2 MB',
      status: 'Rejected'
    },
    {
      id: 'D005',
      userName: 'Alex Rodriguez',
      userRole: 'Alumni',
      documentType: 'Work Experience Letter',
      fileName: 'work_exp_alex.pdf',
      uploadDate: '2025-01-11',
      fileSize: '1.1 MB',
      status: 'Approved'
    }
  ]);

  const handleApprove = (docId) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, status: 'Approved' } : doc
    ));
  };

  const handleReject = (docId) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, status: 'Rejected' } : doc
    ));
  };

  const handleViewDocument = (docId) => {
    alert(`Opening document viewer for ${docId}`);
  };

  const handleDownload = (docId, fileName) => {
    alert(`Downloading ${fileName}`);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Approved': 'badge-green',
      'Pending': 'badge-yellow',
      'Rejected': 'badge-red'
    };
    return classes[status] || 'badge-gray';
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'Student': 'badge-blue',
      'Mentor': 'badge-purple',
      'Alumni': 'badge-orange'
    };
    return classes[role] || 'badge-gray';
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return '🖼️';
    } else if (['pdf'].includes(extension)) {
      return '📄';
    } else if (['doc', 'docx'].includes(extension)) {
      return '📝';
    }
    return '📎';
  };

  const statusCounts = {
    total: documents.length,
    pending: documents.filter(doc => doc.status === 'Pending').length,
    approved: documents.filter(doc => doc.status === 'Approved').length,
    rejected: documents.filter(doc => doc.status === 'Rejected').length
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center gap-2">
            <FileText size={24} />
            Document Verification
          </h2>
          <p className="card-subtitle">
            Review and verify uploaded documents from users
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Total Documents</p>
              <p className="text-2xl font-bold text-primary">{statusCounts.total}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-blue)', opacity: 0.1}}>
              <FileText size={24} style={{color: 'var(--accent-blue)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Pending Review</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-warning)'}}>{statusCounts.pending}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-warning)', opacity: 0.1}}>
              <Clock size={24} style={{color: 'var(--accent-warning)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Approved</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-success)'}}>{statusCounts.approved}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-success)', opacity: 0.1}}>
              <CheckCircle size={24} style={{color: 'var(--accent-success)'}} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary mb-1">Rejected</p>
              <p className="text-2xl font-bold" style={{color: 'var(--accent-danger)'}}>{statusCounts.rejected}</p>
            </div>
            <div className="p-3 rounded-lg" style={{backgroundColor: 'var(--accent-danger)', opacity: 0.1}}>
              <XCircle size={24} style={{color: 'var(--accent-danger)'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Document Uploads</h3>
          <p className="card-subtitle">
            {statusCounts.pending} documents pending your review
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User & Document</th>
                <th>File Details</th>
                <th>Upload Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="user-avatar">
                        <User size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-primary">{doc.userName}</div>
                        <span className={`badge ${getRoleBadgeClass(doc.userRole)} mb-1`}>
                          {doc.userRole}
                        </span>
                        <div className="text-sm text-secondary">{doc.documentType}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getFileIcon(doc.fileName)}</span>
                      <div>
                        <div className="text-sm font-medium text-primary">{doc.fileName}</div>
                        <div className="text-xs text-muted">{doc.fileSize}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted" />
                      <span className="text-sm text-primary">{doc.uploadDate}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDocument(doc.id)}
                        className="btn btn-ghost btn-sm"
                        title="View document"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                        className="btn btn-ghost btn-sm"
                        title="Download document"
                      >
                        <Download size={16} />
                      </button>
                      
                      {doc.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(doc.id)}
                            className="btn btn-success btn-sm"
                            title="Approve document"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(doc.id)}
                            className="btn btn-danger btn-sm"
                            title="Reject document"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Document Management Actions</h3>
          <p className="card-subtitle">Common verification tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3">
            <Clock size={24} />
            <div className="text-center">
              <div className="font-medium">Review Pending</div>
              <div className="text-sm text-secondary">{statusCounts.pending} documents</div>
            </div>
          </button>
          <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3">
            <CheckCircle size={24} />
            <div className="text-center">
              <div className="font-medium">Bulk Approve</div>
              <div className="text-sm text-secondary">Select multiple documents</div>
            </div>
          </button>
          <button className="btn btn-ghost p-6 h-auto flex-col items-center gap-3">
            <Download size={24} />
            <div className="text-center">
              <div className="font-medium">Export Report</div>
              <div className="text-sm text-secondary">Download verification summary</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUploads;