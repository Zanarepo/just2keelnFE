import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CleanerReviews from '../BookingsProcess/CleanerReviews';

const ProfileDashboard = () => {
  // State to store profile data
  const [profile, setProfile] = useState(null);

  // Fetch user email from localStorage
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      // Fetch profile data from Supabase
      const fetchProfileData = async () => {
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('id, full_name, specialization, bio, profile_picture_url, service_locations, years_of_experience, availability, states_of_residence')
          .eq('email', email)
          .single();

        if (error) {
          toast.error('Error fetching profile data');
        } else {
          setProfile(data);
        }
      };

      fetchProfileData();
    } else {
      toast.error('Email not found in local storage');
    }
  }, [email]);

  if (!profile) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg">
        <div className="flex items-center space-x-6 px-6 py-8">
          {/* Profile Picture */}
          <img
            src={profile.profile_picture_url || 'https://via.placeholder.com/150'}
            alt={profile.full_name}
            className="w-36 h-36 rounded-full object-cover border-4 border-green-600 shadow-lg"
          />
          <div className="flex flex-col">
            <h2 className="text-4xl font-semibold text-green-600">{profile.full_name}</h2>
            <p className="text-xl text-gray-700 mt-2">{profile.state_of_residence}</p>
  
            {/* Bio directly below the name */}
            <p className="mt-4 text-lg text-gray-600">
              {profile.bio || 'No bio provided. Tell us more about yourself!'}
            </p>
          </div>
        </div>
  
        <div className="px-6">
          {/* Specialization Section as Tiles */}
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Specializations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.specialization ? (
              profile.specialization.split(',').map((spec, index) => (
                <div
                  key={index}
                  className="border border-gray-300 p-6 rounded-lg shadow-md text-center hover:bg-green-100 cursor-pointer transition-all"
                >
                  <p className="text-lg font-semibold text-gray-700">{spec.trim()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No specialization provided.</p>
            )}
          </div>
        </div>
  
        <div className="mt-8 px-6">
          {/* Availability & Service Location */}
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Service Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-600">Availability</h4>
              <p className="text-gray-600">{profile.availability || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-600">Service Locations</h4>
              <p className="text-gray-600">{profile.service_locations || 'Not specified'}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white">
  {/* Cleaner Reviews Section */}
  <hr className="border-t border-gray-300 mb-4 w-full" />
  <div className="flex justify-center items-center">
    <h3 className="text-2xl font-semibold text-gray-700 px-6">Client Reviews & Ratings</h3>
  </div>




          <div className="px-6">
            <CleanerReviews cleanerId={profile.id} />
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ProfileDashboard;
