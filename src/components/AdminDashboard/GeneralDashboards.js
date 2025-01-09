import React, { useState } from 'react';
import AdminQuoteRequests from './AdminQuoteRequests';
import ManageBids from '../BookingsProcess/ManageBids';
import AdminBids from './AdminBids';
import AdminGuestBooking from './AdminGuestBooking';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Admin Quote Requests');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Admin Quote Requests':
        return <AdminQuoteRequests />;
      case 'Manage Bids':
        return <ManageBids />;
      case 'Admin Bids':
        return <AdminBids />;
      case 'Admin Guest Booking':
        return <AdminGuestBooking />;
      default:
        return <AdminQuoteRequests />;
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Tabs */}
      <div className="flex border-b border-gray-300 text-sm font-medium">
        <button
          onClick={() => handleTabChange('Admin Quote Requests')}
          className={`flex-1 py-2 text-center ${activeTab === 'Admin Quote Requests' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-600'
          }`}
        >
          Admin Quote Requests
        </button>

        <button
          onClick={() => handleTabChange('Manage Bids')}
          className={`flex-1 py-2 text-center ${activeTab === 'Manage Bids' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-600'
          }`}
        >
          Manage Bids
        </button>

        <button
          onClick={() => handleTabChange('Admin Bids')}
          className={`flex-1 py-2 text-center ${activeTab === 'Admin Bids' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-600'
          }`}
        >
          Admin Bids
        </button>

        <button
          onClick={() => handleTabChange('Admin Guest Booking')}
          className={`flex-1 py-2 text-center ${activeTab === 'Admin Guest Booking' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-600'
          }`}
        >
          Admin Guest Booking
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-4">{renderActiveTab()}</div>
    </div>
  );
};

export default AdminDashboard;
