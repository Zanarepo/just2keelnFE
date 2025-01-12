import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('service-provider');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    const tableMapping = {
      'service-provider': 'cleaners_main_profiles',
      client: 'clients_main_profiles',
      admin: 'admin_profiles',
    };

    const tableName = tableMapping[userType];

    try {
      // Fetch user details from the appropriate table
      const { data, error } = await supabase
        .from(tableName)
        .select('id, email, password, full_name')
        .eq('email', email)
        .single();

      if (error || !data) {
        toast.error('User not found or incorrect email.');
        return;
      }

      // Hash the entered password using the same algorithm as during registration
      const hashedPassword = CryptoJS.SHA256(password).toString(); // Hex encoding



      // Compare the hashed password with the stored password
      if (hashedPassword !== data.password) {
        toast.error('Incorrect password.');
        return;
      }

      // Store email and user type in localStorage
      localStorage.setItem('email', email);
      localStorage.setItem(`${userType}_email`, email); // Store specific user type email
      localStorage.setItem('user_type', userType);

      // Display success message
      toast.success(`Welcome, ${data.full_name}!`);

      // Redirect to appropriate dashboard
      if (userType === 'client') {
        navigate('/clientdashboard');
      } else if (userType === 'admin') {
        navigate('/admindashboard');
      } else {
        navigate('/profile-pages');
      }
    } catch (err) {
      toast.error('An error occurred during login.');
      console.error('SignIn Error:', err);
    }
  };











  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-lg font-semibold text-green-500 mb-4 text-center">Sign In</h1>
        <form onSubmit={handleSignIn} className="mt-6">
          <div className="mb-4">
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
              User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="service-provider">Service Provider</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-600"
          >
            Sign In
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
