// Import necessary modules and libraries
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientProfile = () => {
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          toast.error('User email not found. Please log in again.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('clients_main_profiles')
          .select('full_name, email, phone_number, address')
          .eq('email', email)
          .single();

        if (error) {
          toast.error('Error fetching profile data');
        } else {
          setProfileData(data);
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const { error } = await supabase
        .from('clients_main_profiles')
        .update({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number,
          address: profileData.address,
          password: profileData.password // Assuming password update is allowed
        })
        .eq('email', profileData.email);

      if (error) {
        toast.error('Error updating profile');
      } else {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full flex justify-center items-start pt-8"> {/* Adjusted pt-8 for space from the top */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-green-500">Client Profile</h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="full_name">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profileData.full_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={profileData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
  
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
              updating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            } focus:outline-none focus:ring-2 focus:ring-green-500`}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default ClientProfile;
