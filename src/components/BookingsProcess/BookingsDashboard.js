import React, { useState } from 'react';
import BookingForm from './BookingForm';
import BookingsSection from '../ClientProfile/BookingsSection';
import RequestQuoteForm from '../QuotesDashboard/RequestQuoteForm';
import ApprovedBids from '../QuotesDashboard/ApprovedBids';
import Quotedashboard from "../CleanersDashboard/Quotedashboard";

const BookingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Booking Form'); // Default active tab

  // Function to render content based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Booking Form':
        return <BookingForm />;
      case 'Bookings Section':
        return <BookingsSection />;
      case 'Request Quote':
        return <RequestQuoteForm />;
      case 'Quote Dashboard':
        return <Quotedashboard />;
      case 'Approved Bids':
        return <ApprovedBids />;
      default:
        return <BookingForm />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Simplified Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md flex justify-around border-b">
        {['Booking Form', 'Bookings Section', 'Request Quote', 'Quote Dashboard', 'Approved Bids'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
              activeTab === tab
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-green-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content Section */}
      <div className="mt-2">{renderActiveTab()}</div>
    </div>
  );
};

export default BookingsDashboard;
