import React, { useState } from 'react';
import PublicDashboard from './PublicDashboard';
import PersonalDetails from './PersonalDetails';
import MyBio from './MyBio';
import ServiceSection from './ServiceSection';
import ServiceLocationYearsAvailability from './ServiceLocationYearsAvailability';
import ProfileVerificationPopup from '../ProfileVerifications/ProfileVerificationPopup';

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('Public Dashboard');  // Initialize active tab state

  // Function to render content based on active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Personal Details':
        return <PersonalDetails />;
      case 'My Bio':
        return <MyBio />;
      case 'Service Section':
        return <ServiceSection />;
      case 'Service Location, Years & Availability':
        return <ServiceLocationYearsAvailability />;
      default:
        return <PublicDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md p-4 flex flex-wrap justify-between gap-2 md:flex-nowrap md:justify-between">
        {/* Row 1 */}
        <div className="flex w-full gap-2 md:w-auto md:flex-row">
          <button
            onClick={() => setActiveTab('Public Dashboard')}
            className={`w-1/3 sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg text-center transition-all duration-300 border-2 ${
              activeTab === 'Public Dashboard'
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
            }`}
          >
            <i className="fas fa-home text-xs sm:text-base"></i> Public Dashboard 
            <ProfileVerificationPopup/> </button>
                
          <button
            onClick={() => setActiveTab('Personal Details')}
            className={`w-1/3 sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg text-center transition-all duration-300 border-2 ${
              activeTab === 'Personal Details'
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
            }`}
          >
            <i className="fas fa-user text-xs sm:text-base"></i> Personal Details
          </button>

          <button
            onClick={() => setActiveTab('My Bio')}
            className={`w-1/3 sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg text-center transition-all duration-300 border-2 ${
              activeTab === 'My Bio'
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
            }`}
          >
            <i className="fas fa-file-alt text-xs sm:text-base"></i> My Bio
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex w-full gap-2 mt-2 md:w-auto md:flex-row">
          <button
            onClick={() => setActiveTab('Service Section')}
            className={`w-1/3 sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg text-center transition-all duration-300 border-2 ${
              activeTab === 'Service Section'
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
            }`}
          >
            <i className="fas fa-cogs text-xs sm:text-base"></i> Specialty
          </button>

          <button
            onClick={() => setActiveTab('Service Location, Years & Availability')}
            className={`w-1/3 sm:w-auto px-4 py-2 text-xs sm:text-sm rounded-lg text-center transition-all duration-300 border-2 ${
              activeTab === 'Service Location, Years & Availability'
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
            }`}
          >
            <i className="fas fa-map-marker-alt text-xs sm:text-base"></i> Services
          </button>
        </div>
      </nav>

      {/* Content Section */}
      <div className="mt-6">
        {renderActiveTab()} {/* Renders the active tab content */}
      </div>
    </div>
  );
};

export default ProfileDashboard;
