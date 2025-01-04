import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServiceSection from './ServiceSection';
import ServiceLocationYearsAvailability from './ServiceLocationYearsAvailability';
import PersonalDetails from './PersonalDetails';
import MyBio from './MyBio';
import ProfileVerificationPopup from '../ProfileVerifications/ProfileVerificationPopup';
import PublicDashboard from './PublicDashboard'; // Import PublicDashboard component

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('publicDashboard'); // Set the default tab to 'publicDashboard'
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const email = localStorage.getItem('email');

        if (!email) {
          toast.error('User email not found. Please log in again.');
          setLoading(false);
          return;
        }

        const { data: personalDetails, error: personalError } = await supabase
          .from('cleaners_main_profiles_duplicate')
          .select('full_name, email, phone_number, profile_picture_url')
          .eq('email', email)
          .single();

        const { data: serviceDetails, error: serviceError } = await supabase
          .from('cleaners_main_profiles')
          .select('specialization, availability, service_locations, years_of_experience')
          .eq('email', email)
          .single();

        if (personalError || serviceError) {
          toast.error('Error fetching profile data');
        } else {
          // Merge personal and service details into one object
          setProfileData({ ...personalDetails, ...serviceDetails });
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'publicDashboard':
        return <PublicDashboard />; // Render PublicDashboard for the public tab
      case 'personalDetails':
        return <PersonalDetails profileData={profileData} />;
      case 'serviceSection':
        return <ServiceSection profileData={profileData} />;
      case 'serviceLocation':
        return <ServiceLocationYearsAvailability profileData={profileData} />;
      case 'myBio':
        return <MyBio profileData={profileData} />;
      default:
        return <PersonalDetails profileData={profileData} />;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full">
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-20">
        <div className="py-4 text-center text-2xl font-semibold text-green-600">
          Profile Dashboard
        </div>
        <nav className="border-t border-b">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('publicDashboard')}
              className={`py-2 px-8 text-sm font-semibold ${
                activeTab === 'publicDashboard' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
              }`}
            >
              Public Dashboard
            </button>
            <button
              onClick={() => setActiveTab('personalDetails')}
              className={`py-2 px-8 text-sm font-semibold ${
                activeTab === 'personalDetails' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
              }`}
            >
              Personal Details  {/*  */} <ProfileVerificationPopup/>
            </button>
            <button
              onClick={() => setActiveTab('serviceSection')}
              className={`py-2 px-4 text-sm font-semibold ${
                activeTab === 'serviceSection' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
              }`}
            >
              Specialty
            </button>
            <button
              onClick={() => setActiveTab('serviceLocation')}
              className={`py-2 px-4 text-sm font-semibold ${
                activeTab === 'serviceLocation' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
              }`}
            >
              Service Info
            </button>
            <button
              onClick={() => setActiveTab('myBio')}
              className={`py-2 px-4 text-sm font-semibold ${
                activeTab === 'myBio' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-600'
              }`}
            >
              My Bio
            </button>
          </div>
        </nav>
      </header>

      <div className="pt-28">{renderContent()}</div>
    </div>
  );
};

export default ProfileDashboard;
