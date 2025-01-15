import React, { useState } from 'react';
import AdminQuoteRequests from './AdminQuoteRequests';
import ManageBids from '../BookingsProcess/ManageBids';
//import AdminBids from './ClientsQuotesandBookings';
import ClientsQuotesandRequestDb from '../AdminDashboard/ClientsQuotesandRequestDb'
import AdminGuestBooking from './AdminGuestBooking';
import GuestCleanersQuotesandRequestDb from '../AdminDashboard/GuestCleanersQuotesandRequestDb'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Admin Quote Requests');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Admin Quote Requests':
        return <GuestCleanersQuotesandRequestDb />;
      case 'Manage Bids':
        return <ManageBids />;
      case 'Admin Bids':
        return <ClientsQuotesandRequestDb />;
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
            ? 'border-b-2 border-green-500 text-green-600' 
            : 'text-gray-600'
          }`}
        >
          Guest Quotes & Bookings
        </button>

       

        <button
          onClick={() => handleTabChange('Admin Bids')}
          className={`flex-1 py-2 text-center ${activeTab === 'Admin Bids' 
            ? 'border-b-2 border-green-500 text-green-600' 
            : 'text-gray-600'
          }`}
        >
          Clients Quotes & Bookings
        </button>

      </div>

      {/* Content Section */}
      <div className="mt-4">{renderActiveTab()}</div>
    </div>
  );
};

export default AdminDashboard;
