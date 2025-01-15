import React, { useState, useEffect } from 'react';
import BookingForm from './BookingForm';
import BookingsSection from '../ClientProfile/BookingsSection';
import RequestQuoteForm from '../QuotesDashboard/RequestQuoteForm';
import ApprovedBids from '../QuotesDashboard/ApprovedBids';
import Quotedashboard from "../CleanersDashboard/Quotedashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../supabaseClient';

const BookingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('Booking Form'); // Default active tab

  useEffect(() => {
    const fetchUserName = async () => {
      const email = localStorage.getItem('email'); // Retrieve email from localStorage
      
      if (email) {
        const { data, error } = await supabase
          .from('clients_main_profiles')
          .select('full_name')
          .eq('email', email)
          .single(); // Fetch a single record

        if (error) {
          console.error('Error fetching user data:', error);
          toast.error('Error retrieving your profile. Please try again.');
        } else if (data) {
          const fullName = data.full_name;
          const firstName = fullName.split(' ')[0]; // Extract first name
          toast.success(`Welcome to the Bookings Dashboard, ${firstName}!`);
        }
      } else {
        toast.error('No email found. Please log in again.');
      }
    };

    fetchUserName(); // Call the function when the component mounts
  }, []);

  // Function to render content based on the active tab
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Book Cleaner':
        return <BookingForm />;
      case 'Bookings Section':
        return <BookingsSection />;
      case 'Request Cleaning Quote':
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
        {['Approved Bids','Cleaners Booking Center',  'Request Cleaning Quote' ].map((tab) => (
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default BookingsDashboard;
