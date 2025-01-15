

import React, { useState } from 'react';
import ApprovedRFQs from './ApprovedRFQs';
import ClientsCleanersBookings from './ClientsCleanersBookings';
import ClientsQuotesandBookings from './ClientsQuotesandBookings';

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('ApprovedRFQs');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ApprovedRFQs':
        return <ApprovedRFQs />;
      case 'ClientsCleanersBookings':
        return <ClientsCleanersBookings />;
      case 'ClientsQuotesandBookings':
        return <ClientsQuotesandBookings />;
      default:
        return <ApprovedRFQs />;
    }
  };

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4 justify-between">
      <button
          className={`px-4 py-2 ${
            activeTab === 'ClientsQuotesandBookings' ? 'border-b-2 border-green-500 text-green-600' : ''
          }`}
          onClick={() => setActiveTab('ClientsQuotesandBookings')}
        >
         RFQs 
        </button>

        <button
          className={`px-4 py-2 ${
            activeTab === 'ApprovedRFQs' ? 'border-b-2 border-green-500 text-green-600' : ''
          }`}
          onClick={() => setActiveTab('ApprovedRFQs')}
        >
          Approved RFQs
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'ClientsCleanersBookings' ? 'border-b-2 border-green-500 text-green-600' : ''
          }`}
          onClick={() => setActiveTab('ClientsCleanersBookings')}
        >
          Clients Cleaners Bookings
        </button>
        
      </div>

      {/* Tab Content */}
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default DashboardTabs;
