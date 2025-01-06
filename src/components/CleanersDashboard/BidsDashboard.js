import React, { useState } from 'react';
import CleanerBids from '../QuotesDashboard/CleanerBids';
import CleanerQuoteDb from '../CleanersDashboard/CleanerQuoteDb';
import CleanerBookingDetails from '../CleanersDashboard/CleanerBookingDetails'; // Import new component
import CleanerSchedules from '../CleanersDashboard/CleanerSchedules'; // Import new component

const BidsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Cleaner Bids'); // Default active tab

  // Function to render content based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Cleaner Bids':
        return <CleanerBids />;
      case 'Cleaner Quote Database':
        return <CleanerQuoteDb />;
      case 'Cleaner Bookings': // New case for Cleaner Bookings
        return <CleanerBookingDetails />;
      case 'Cleaner Schedules': // New case for Cleaner Schedules
        return <CleanerSchedules />;
      default:
        return <CleanerBids />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('Cleaner Bids')}
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Bids'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Cleaner Bids
        </button>

        <button
          onClick={() => setActiveTab('Cleaner Quote Database')}
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Quote Database'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Cleaner Quote Database
        </button>

        <button
          onClick={() => setActiveTab('Cleaner Bookings')} // New tab for Cleaner Bookings
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Bookings'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Cleaner Bookings
        </button>

        <button
          onClick={() => setActiveTab('Cleaner Schedules')} // New tab for Cleaner Schedules
          className={`px-6 py-2 text-sm rounded-lg transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Schedules'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          Cleaner Schedules
        </button>
      </nav>

      {/* Content Section */}
      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
};

export default BidsDashboard;
