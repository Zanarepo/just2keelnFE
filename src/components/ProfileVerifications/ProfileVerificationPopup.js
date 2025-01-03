// ProfileVerificationPopup.js

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const ProfileVerificationPopup = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(true); // Track if the popup is dismissed
  const email = localStorage.getItem('email');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (!email) return;

      try {
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('profile_verification')
          .eq('email', email)
          .single();

        if (error) throw error;

        if (data && data.profile_verification) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    checkVerificationStatus();
  }, [email]);

  // Do not show the popup if already verified or dismissed
  if (isVerified || !isPopupVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center text-green-500">Profile Verification</h2>
        <p className="text-gray-700 mb-4 text-center">
          To fully access all features, please verify your profile.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/profile-verification"
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Verify Profile Now
          </Link>
          <button
            onClick={() => setIsPopupVisible(false)}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
           Do It Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPopup;
