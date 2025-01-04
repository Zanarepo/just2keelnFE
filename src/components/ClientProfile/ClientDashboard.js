import React, { useState } from 'react';
import ClientProfile from './ClientProfile';
import BookingsSection from './BookingsSection';
import PaymentsSection from './PaymentsSection';
import ReviewPromptSection from './ReviewPromptSection';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ClientProfile />;
      case 'bookings':
        return <BookingsSection />;
      case 'payments':
        return <PaymentsSection />;
      case 'reviews':
        return <ReviewPromptSection />;
      default:
        return <ClientProfile />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-2 sm:p-4">
      {/* Fixed Header */}
      <header className="bg-white shadow-md p-2 sm:p-4 mb-4 fixed top-0 left-0 w-full z-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-green-600">Client Dashboard</h1>
        <nav className="flex justify-around mt-2 sm:mt-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-2 sm:px-4 font-semibold ${
              activeTab === 'profile' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-2 px-2 sm:px-4 font-semibold ${
              activeTab === 'bookings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-2 sm:px-4 font-semibold ${
              activeTab === 'payments' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-2 sm:px-4 font-semibold ${
              activeTab === 'reviews' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
            }`}
          >
            Reviews
          </button>
        </nav>
      </header>
  
      {/* Content area */}
      <main className="bg-white p-4 sm:p-6 shadow rounded mt-20">{renderContent()}</main> {/* Added margin-top */}
    </div>
  );
};

export default ClientDashboard;
