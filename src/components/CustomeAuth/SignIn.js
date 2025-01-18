import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRoles, setUserRoles] = useState([]); // To handle multiple roles
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Query all three tables using the same email
      const cleanerQuery = supabase
        .from('cleaners_main_profiles')
        .select('id, email, password, full_name')
        .eq('email', email)
        .single();

      const clientQuery = supabase
        .from('clients_main_profiles')
        .select('id, email, password, full_name')
        .eq('email', email)
        .single();

      const adminQuery = supabase
        .from('admin_profiles')
        .select('id, email, password, full_name')
        .eq('email', email)
        .single();

      const [cleaner, client, admin] = await Promise.all([
        cleanerQuery,
        clientQuery,
        adminQuery,
      ]);

      // Check which roles exist
      const roles = [];
      if (cleaner.data) roles.push({ type: 'cleaner', data: cleaner.data });
      if (client.data) roles.push({ type: 'client', data: client.data });
      if (admin.data) roles.push({ type: 'admin', data: admin.data });

      if (roles.length === 0) {
        toast.error('User not found.');
        return;
      }

      // Verify password with the first matching role (assuming same password for all roles)
      const hashedPassword = CryptoJS.SHA256(password).toString(); // Hex encoding
      if (hashedPassword !== roles[0].data.password) {
        toast.error('Incorrect password.');
        return;
      }

      // Store email and role(s) in localStorage
      localStorage.setItem('email', email);
      localStorage.setItem('roles', JSON.stringify(roles.map((role) => role.type)));

      if (roles.length === 1) {
        // Single role - redirect to the appropriate dashboard
        const userType = roles[0].type;
        localStorage.setItem('user_type', userType);
        toast.success(`Welcome, ${roles[0].data.full_name}!`);
        navigate(`/${userType}dashboard`);
      } else {
        // Multiple roles - prompt user to select a role
        toast.info('Please select a role.');
        setUserRoles(roles); // Show a role selection UI
      }
    } catch (err) {
      toast.error('An error occurred during login.');
      console.error('SignIn Error:', err);
    }
  };

  const handleRoleSelection = (role) => {
    localStorage.setItem('user_type', role.type);
    toast.success(`Welcome, ${role.data.full_name}!`);
    navigate(`/${role.type}dashboard`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side: Image background */}
      <div className="hidden sm:block sm:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('images/Hero.jpg')" }}></div>
  
      {/* Right side: Form and Role Selection */}
      <div className="flex-1 flex justify-center items-center p-6 sm:w-1/2">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-lg font-semibold text-green-500 mb-4 text-center">Sign In</h1>
          <form onSubmit={handleSignIn} className="mt-6">
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
            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>
  
          {/* Role Selection UI */}
          {userRoles.length > 0 && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-center text-lg font-semibold mb-4">Select a Role</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {userRoles.map((role) => (
                  <button
                    key={role.type}
                    onClick={() => handleRoleSelection(role)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  >
                    {role.type.charAt(0).toUpperCase() + role.type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default SignIn;
