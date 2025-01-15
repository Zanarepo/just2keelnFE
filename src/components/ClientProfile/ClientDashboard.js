import React, { useState, useEffect } from 'react';
import ClientProfile from './ClientProfile';
import BookingsDashboard from '../BookingsProcess/BookingsDashboard';
import PaymentsSection from './PaymentsSection';
//import ReviewPromptSection from './ReviewPromptSection';
import ResidenceUpdatePopup from "./ResidenceUpdatePopup";
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchAndStoreUserEmail = async () => {
      const email = localStorage.getItem('email');

      if (!email) {
        try {
          // Assuming Supabase authentication is being used
          const { data: user, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to retrieve user. Please log in.');
          } else if (user) {
            const userEmail = user.email;
            localStorage.setItem('email', userEmail); // Store email in local storage
            
            const { data, error: profileError } = await supabase
              .from('clients_main_profiles')
              .select('full_name')
              .eq('email', userEmail)
              .single();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              toast.error('Error retrieving your profile. Please try again.');
            } else if (data) {
              const fullName = data.full_name;
              const firstName = fullName.split(' ')[0];
              toast.success(`Welcome to the Client Dashboard, ${firstName}!`);
            }
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          toast.error('An unexpected error occurred. Please try again.');
        }
      }
    };

    fetchAndStoreUserEmail();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ClientProfile />;
      case 'bookings':
        return <BookingsDashboard />;
      case 'Schedules & Payments':
        return <PaymentsSection />;
      
     
      default:
        return <ClientProfile />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white-100">
      <ResidenceUpdatePopup />
      {/* Fixed Header */}
      <header className="bg-white shadow-md p-2 sm:p-4 mb-4 fixed top-0 left-0 w-full z-10">
        <h1 className="text-lg sm:text-xl font-semibold text-center text-green-600">Client Dashboard</h1>
        <nav className="flex justify-between mt-2 sm:mt-4">
          {['profile', 'bookings', 'Schedules & Payments' ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-2 sm:px-4 font-semibold text-sm sm:text-base ${
                activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Content area */}
      <main className="bg-white shadow rounded mt-20 sm:mt-24 pt-6 pb-4">{renderContent()}</main>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ClientDashboard;
