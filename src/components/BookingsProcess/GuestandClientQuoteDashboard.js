import React, { useState } from 'react';
import BidDetails from './BidDetails';
import GuestQuoteRequests from './GuestQuoteRequests';
import CleanerBids from '../QuotesDashboard/CleanerClientsBids';
import GuestBookingsComponent from './GuestBookingsComponent';
import CleanerBookingDetails from '../CleanersDashboard/CleanerBookingDetails';

const GuestandClientQuotesDashboard = () => {
  const [activeTab, setActiveTab] = useState('GuestQuoteRequests');

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
          onClick={() => setActiveTab('GuestQuoteRequests')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'GuestQuoteRequests' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Guest Bookings & RFQ
        </button>

        {/* Clients Bids Tab */}
        <button
          onClick={() => setActiveTab('CleanerBids')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'CleanerBids' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Clients RFQs & Bids
        </button>

        {/* Clients Bookings Tab */}
        <button
          onClick={() => setActiveTab('ClientsBookings')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'ClientsBookings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'
          }`}
        >
          Clients Bookings
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default GuestandClientQuotesDashboard;
