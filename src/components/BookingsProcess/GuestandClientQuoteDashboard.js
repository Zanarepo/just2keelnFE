import React, { useState } from 'react';
import BidDetails from './BidDetails';
import GuestQuoteRequests from './GuestQuoteRequests';
import CleanerBids from '../QuotesDashboard/CleanerBids';
import GuestBookingsComponent from './GuestBookingsComponent';
import CleanerQuoteDb from '../CleanersDashboard/CleanerQuoteDb'; // Import CleanerQuoteDb

const GuestandClientQuotesDashboard = () => {
  const [activeTab, setActiveTab] = useState('BidDetails');

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
      case 'CleanerQuoteDb': // New case for CleanerQuoteDb
        return <CleanerQuoteDb />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-300 text-sm font-medium">
        <button
          onClick={() => setActiveTab('BidDetails')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'BidDetails' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Bid Details
        </button>
        <button
          onClick={() => setActiveTab('GuestQuoteRequests')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'GuestQuoteRequests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Guest Quotes
        </button>
        <button
          onClick={() => setActiveTab('CleanerBids')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'CleanerBids' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Cleaner Bids
        </button>
        <button
          onClick={() => setActiveTab('GuestBookingsComponent')}
          className={`flex-1 py-2 text-center ${
            activeTab === 'GuestBookingsComponent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Guest Bookings
        </button>
        <button
          onClick={() => setActiveTab('CleanerQuoteDb')} // New tab for CleanerQuoteDb
          className={`flex-1 py-2 text-center ${
            activeTab === 'CleanerQuoteDb' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
        >
          Cleaner Quote DB
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default GuestandClientQuotesDashboard;
