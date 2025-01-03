import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Assuming you have a supabase client setup
import { toast } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const MyBio = () => {
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the user's current bio from the database
  useEffect(() => {
    const fetchBio = async () => {
      try {
        const { data, error } = await supabase
          .from('cleaners_main_profiles') // Fetch from cleaners_main_profiles table
          .select('bio')
          .eq('email', localStorage.getItem('email')); // Fetch based on logged-in user's email

        if (error) throw error;

        const currentBio = data[0]?.bio || '';
        setBio(currentBio);
      } catch (error) {
        toast.error('Error fetching bio');
      }
    };

    fetchBio();
  }, []);

  // Handle the bio update
  const handleUpdateBio = async () => {
    if (bio.trim() === '') {
      toast.error('Bio cannot be empty');
      return;
    }
  
    const email = localStorage.getItem('email');

    if (!email) {
      toast.error('User email not found. Please log in again.');
      return;
    }
  
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .update({ bio: bio.trim() }) // Only update bio
        .eq('email', email);
  
      if (error) throw error;
  
      if (data.length === 0) {
        toast.error('No matching profile found for the given email.');
      } else {
        setIsEditing(false);
        toast.success('Bio updated successfully');
      }
    } catch (error) {
      toast.error('Error updating bio');
    } finally {
      setIsLoading(false);
    }
  };









  
  return (
    <div className="min-h-screen bg-white flex justify-center items-start mt-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold text-green-500 mb-4 text-center">My Bio</h2>
  
        {/* Display bio or edit mode */}
        <div className="mb-4">
          {!isEditing ? (
            <p className="text-gray-700 text-sm text-center">{bio || 'Write your bio to introduce yourself!'}</p>
          ) : (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 border rounded-lg text-center"
              rows="5"
              placeholder="Write a short bio about yourself"
            />
          )}
        </div>
  
        <div className="flex justify-center">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Edit Bio
            </button>
          ) : (
            <button
              onClick={handleUpdateBio}
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Bio'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default MyBio;
