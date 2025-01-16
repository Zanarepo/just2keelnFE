import React, { useState } from 'react';
//import { toast, ToastContainer } from 'react-toastify';  // Correctly importing toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Importing the CSS for react-toastify

import BidDetails from './BidDetails';
import GuestQuoteRequests from './GuestQuoteRequests';
import CleanerBids from '../QuotesDashboard/CleanerClientsBids';
import GuestBookingsComponent from './GuestBookingsComponent';
import CleanerBookingDetails from '../CleanersDashboard/CleanerBookingDetails';

const GuestandClientQuotesDashboard = () => {
  const [activeTab, setActiveTab] = useState('GuestQuoteRequests');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  // Triggering the toast notification when the tab changes
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'BidDetails':
        return <BidDetails />;
      case 'GuestQuoteRequests':
        return <GuestQuoteRequests />;
      case 'CleanerBids':
        return <CleanerBids />;
      case 'GuestBookingsComponent':
        return <GuestBookingsComponent />;
      case 'ClientsBookings':
        return <CleanerBookingDetails />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex border-b border-gray-300 text-sm font-medium">
        {/* Guest Quote Requests Tab */}
        <button
          onClick={() => handleTabChange('GuestQuoteRequests')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'GuestQuoteRequests' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Guest Bookings & RFQ
        </button>

        {/* Clients Bids Tab */}
        <button
          onClick={() => handleTabChange('CleanerBids')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'CleanerBids' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Clients RFQs & Bids
        </button>

        {/* Clients Bookings Tab */}
        <button
          onClick={() => handleTabChange('ClientsBookings')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'ClientsBookings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Clients Bookings
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>

      {/* Toast Notifications */}
              
    </div>
  );
};

export default GuestandClientQuotesDashboard;
