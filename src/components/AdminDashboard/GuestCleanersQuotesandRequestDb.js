

import React, { useState } from 'react';
import AdminGuestBooking from './AdminGuestBooking';
import ManageBids from '../BookingsProcess/ManageBids';
import AdminQuoteRequests from './AdminQuoteRequests';

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState('AdminGuestBooking');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'AdminGuestBooking':
        return <AdminGuestBooking />;
      case 'ManageBids':
        return <ManageBids />;
      case 'AdminQuoteRequests':
        return <AdminQuoteRequests />;
      default:
        return <AdminGuestBooking />;
    }
  };

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4 justify-around">
        <button
          className={`px-4 py-2 ${
            activeTab === 'AdminGuestBooking' ? 'border-b-2 border-green-500 font-semibold text-green-600' : ''
          }`}
          onClick={() => setActiveTab('AdminGuestBooking')}
        >
          Guest Booking
        </button>

        <button
          className={`px-4 py-2 ${
            activeTab === 'ManageBids' ? 'border-b-2 border-green-500 font-semibold text-green-600' : ''
          }`}
          onClick={() => setActiveTab('ManageBids')}
        >
          Manage Bids
        </button>

        <button
          className={`px-4 py-2 ${
            activeTab === 'AdminQuoteRequests' ? 'border-b-2 border-green-500 font-semibold text-green-600' : ''
          }`}
          onClick={() => setActiveTab('AdminQuoteRequests')}
        >
          Quote Requests
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default AdminTabs;
