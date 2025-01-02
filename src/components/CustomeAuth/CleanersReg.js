import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('service-provider');

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Table mapping based on userType
    const tableMapping = {
      'service-provider': 'cleaners_main_profiles',
      client: 'client_main_profiles',
      admin: 'admin',
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

      // Replace this block where the password is hashed
const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

if (hashedPassword !== data.password) {
  toast.error('Invalid password.');
  return;
}

      toast.success(`Welcome, ${data.full_name}!`);
    } catch (err) {
      toast.error('An error occurred during login.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Sign In</h1>
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
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
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
