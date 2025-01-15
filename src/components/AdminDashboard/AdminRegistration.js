import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';

const AdminRegistration = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminType, setAdminType] = useState('admin'); // Default admin type
  const [loading, setLoading] = useState(false);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if email already exists
      const { data: existingAdmin, error: fetchError } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingAdmin) {
        toast.error('Email already exists. Please use a different email.');
        setLoading(false);
        return;
      }

      if (fetchError && fetchError.code !== 'PGRST116') {
        toast.error('An error occurred while checking email. Please try again.');
        setLoading(false);
        return;
      }

      // Hash the password before storing it
   const hashedPassword = CryptoJS.SHA256(password).toString();
    
      // Insert new admin into the database
      const { error: insertError } = await supabase.from('admin_profiles').insert([
        {
          full_name: fullName,
          email: email,
          password: hashedPassword, // Store hashed password
          role: adminType,
        },
      ]);

      if (insertError) {
        toast.error('Registration failed. Please try again.');
      } else {
        toast.success('Admin registered successfully!');
        setFullName('');
        setEmail('');
        setPassword('');
        setAdminType('admin');
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-lg rounded p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-green-500">Admin Registration</h2>
        
        <form onSubmit={handleRegistration} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter password"
            />
          </div>

          {/* Admin Type Selection */}
          <div>
            <label htmlFor="adminType" className="block text-sm font-medium text-gray-700">Admin Type</label>
            <select
              id="adminType"
              value={adminType}
              onChange={(e) => setAdminType(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white font-semibold rounded ${
                loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
              } focus:outline-none`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;
