import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';

const ViewUploads = () => {
  const [documents, setDocuments] = useState([
    {
      id: 'D001',
      userName: 'Sarah Lee',
      userRole: 'Mentor',
      documentType: 'View ID',
      uploadDate: '2025-01-15',
      status: 'Pending'
    },
    {
      id: 'D002',
      userName: 'James Champagne',
      userRole: 'Alumni',
      documentType: 'View Certificate',
      uploadDate: '2025-01-14',
      status: 'Approved'
    },
    {
      id: 'D003',
      userName: 'Michael Johnson',
      userRole: 'Student',
      documentType: 'Student ID',
      uploadDate: '2025-01-13',
      status: 'Pending'
    },
    {
      id: 'D004',
      userName: 'Lisa Wang',
      userRole: 'Mentor',
      documentType: 'Certification',
      uploadDate: '2025-01-12',
      status: 'Rejected'
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Student':
        return 'bg-blue-100 text-blue-800';
      case 'Mentor':
        return 'bg-purple-100 text-purple-800';
      case 'Alumni':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusCounts = {
    pending: documents.filter(doc => doc.status === 'Pending').length,
    approved: documents.filter(doc => doc.status === 'Approved').length,
    rejected: documents.filter(doc => doc.status === 'Rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold theme-text-header mb-2">📄 Uploaded Documents</h2>
        <p className="theme-text-subtitle">Here are recent document uploads for verification.</p>
      </div>

      {/* Document Verification Section */}
      <div className="theme-bg-dropdown rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold theme-text-header mb-4">Document Verification</h3>
        <p className="text-sm theme-text-subtitle mb-6">Total documents: {documents.length}</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="theme-bg-footer">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium theme-text-subtitle uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="theme-bg-dropdown divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="theme-bg-dropdown-hover transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium theme-text-header">{doc.userName}</div>
                      <div className="text-sm theme-text-subtitle">Uploaded: {doc.uploadDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(doc.userRole)}`}>
                      {doc.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 theme-text-primary mr-2" />
                      <span className="text-sm theme-text-primary cursor-pointer hover:underline">
                        {doc.documentType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {doc.status === 'Pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(doc.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(doc.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white theme-bg-report-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    ) : doc.status === 'Approved' ? (
                      <span className="text-green-600 font-medium">✓ Approved</span>
                    ) : (
                      <span className="text-red-600 font-medium">✗ Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{statusCounts.pending}</div>
          <div className="text-sm font-medium theme-text-subtitle">Pending</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{statusCounts.approved}</div>
          <div className="text-sm font-medium theme-text-subtitle">Approved</div>
        </div>
        <div className="theme-bg-dropdown rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{statusCounts.rejected}</div>
          <div className="text-sm font-medium theme-text-subtitle">Rejected</div>
        </div>
      </div>
    </div>
  );
};

export default ViewUploads;

