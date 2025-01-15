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
 
    lga_of_residence: '',
    state_of_residence: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode

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
          .select('full_name, email, phone_number, address, lga_of_residence, state_of_residence')
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
          password: profileData.password,
          lga_of_residence: profileData.lga_of_residence,
          state_of_residence: profileData.state_of_residence
        })
        .eq('email', profileData.email);

      if (error) {
        toast.error('Error updating profile');
      } else {
        toast.success('Profile updated successfully');
        setIsEditing(false); // Exit edit mode on success
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    
    <div className="min-h-screen w-full flex justify-center items-center py-8 bg-gray-100" >
    
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Client Profile</h2>
        <div className="space-y-6">
          {/* Full Name Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="full_name">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profileData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable when not editing
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          
          </div>

          {/* Phone Number Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={profileData.phone_number}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable when not editing
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Address Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable when not editing
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* LGA of Residence Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="lga_of_residence">
              LGA of Residence
            </label>
            <input
              type="text"
              id="lga_of_residence"
              name="lga_of_residence"
              value={profileData.lga_of_residence}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable when not editing
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* State of Residence Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="state_of_residence">
              State of Residence
            </label>
            <input
              type="text"
              id="state_of_residence"
              name="state_of_residence"
              value={profileData.state_of_residence}
              onChange={handleInputChange}
              disabled={!isEditing} // Disable when not editing
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password Card */}
          

          {/* Edit/Update Button */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-blue-600 hover:underline"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <button
              type="submit"
              onClick={handleUpdateProfile}
              className={`w-full px-4 py-3 text-white font-semibold rounded-lg ${
                updating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              disabled={updating || !isEditing}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        
        </div>
       
      </div>
    
    </div>
    
  );
  
};

export default ClientProfile;
