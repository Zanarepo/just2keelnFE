import React, { useState } from 'react';
import ClientProfile from './ClientProfile';
import BookingsDashboard from '../BookingsProcess/BookingsDashboard';
import PaymentsSection from './PaymentsSection';
import ReviewPromptSection from './ReviewPromptSection';
import ClientSchedules from '../ClientsActivities/ClientSchedules';
import ResidenceUpdatePopup from "./ResidenceUpdatePopup"
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate(); // Initialize useNavigate here

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ClientProfile />;
      case 'bookings':
        return <BookingsDashboard />;
      case 'payments':
        return <PaymentsSection />;
      case 'reviews':
        return <ReviewPromptSection />;
      case 'schedules':
        return <ClientSchedules />;
      default:
        return <ClientProfile />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white-100">
      <ResidenceUpdatePopup/>
      {/* Fixed Header */}
      <header className="bg-white shadow-md p-2 sm:p-4 mb-4 fixed top-0 left-0 w-full z-10">
        <h1 className="text-lg sm:text-xl font-semibold text-center text-green-600">Client Dashboard</h1>
        <nav className="flex justify-between mt-2 sm:mt-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
              activeTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
              activeTab === 'bookings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
              activeTab === 'payments' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
              activeTab === 'reviews' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
              activeTab === 'schedules' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Schedules
          </button>
        </nav>
      </header>

      {/* Content area */}
      <main className="bg-white shadow rounded mt-20 sm:mt-24 pt-6 pb-4">{renderContent()}</main>

      {/* Logout Button */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center">
        <button
          onClick={() => {
            // Log out logic (clear local storage, etc.)
            navigate('/sign'); // Use navigate function correctly
          }}
          className="flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;
