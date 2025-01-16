import React, { useState } from 'react';
//import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for toast

// Import your components
import CleanerBookingDetails from '../CleanersDashboard/CleanerBookingDetails';
import CleanerSchedules from '../CleanersDashboard/CleanerSchedules';
import GuestandClientQuoteDashboard from '../BookingsProcess/GuestandClientQuoteDashboard'; // Import new component

const BidsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Guest and Client Quotes'); // Default active tab

  // Function to render content based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Guest and Client Quotes':
        return <GuestandClientQuoteDashboard />;
      case 'Cleaner Bookings':
        return <CleanerBookingDetails />;
      case 'Cleaner Schedules':
        return <CleanerSchedules />;
      default:
        return <GuestandClientQuoteDashboard />;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
   // Display toast when tab changes
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-center gap-4">
        
        <button
          onClick={() => handleTabChange('Guest and Client Quotes')}
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Guest and Client Quotes'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Guest and Client Quotes
        </button>

        <button
          onClick={() => handleTabChange('Cleaner Schedules')}
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Schedules'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Your Schedules
        </button>
        
      </nav>

      {/* Content Section */}
      <div className="mt-6">{renderActiveTab()}</div>

      {/* Toast Notifications */}
      
    </div>
  );
};

export default BidsDashboard;
