import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const role = searchParams.get('role');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Sending the reset request to the backend
      const response = await axios.post('http://localhost:4000/reset-password', {
        token,
        role,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
      // Error handling: Check if the error response exists, else fallback message
      setMessage(
        error.response?.data?.message || 'Something went wrong. Please try again later.'
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    // Handle case where token or role are invalid
    if (!token || !role) {
      setMessage('Invalid reset link');
    }
  }, [token, role]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
      {message && <p className={`text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      {!message.includes('Invalid') && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordForm;
