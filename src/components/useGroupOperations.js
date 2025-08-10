import { useState } from 'react';

export const useGroupOperations = (apiBaseUrl = 'http://localhost:3001') => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    const errorMsg = error.message || defaultMessage;
    setError(errorMsg);
    return errorMsg;
  };

  // Remove member from group
  const removeMember = async (groupId, userId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, group: result };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }
    } catch (error) {
      throw new Error(handleError(error, 'Failed to remove member'));
    } finally {
      setLoading(false);
    }
  };

  // Leave group
  const leaveGroup = async (groupId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}/leave`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave group');
      }
    } catch (error) {
      throw new Error(handleError(error, 'Failed to leave group'));
    } finally {
      setLoading(false);
    }
  };

  // Get group details
  const getGroupDetails = async (groupId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiBaseUrl}/api/groups/${groupId}`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const group = await response.json();
        return { success: true, group };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch group details');
      }
    } catch (error) {
      throw new Error(handleError(error, 'Failed to fetch group details'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    removeMember,
    leaveGroup,
    getGroupDetails
  };
};

export default useGroupOperations;