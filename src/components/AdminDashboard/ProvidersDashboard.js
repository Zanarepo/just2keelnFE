import React, { useState } from 'react';
import ManagePayments from './ManagePayments';
import ManageCleanersVerification from './ManageCleanersVerification';
import ManageReviews from './ManageReviews';
import AdminCleanersDashboard from './AdminCleanersDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProvidersDashboard = () => {
  const [activeTab, setActiveTab] = useState('Payments');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Payments':
        return <ManagePayments />;
      case 'Cleaners Verification':
        return <ManageCleanersVerification />;
      case 'Reviews':
        return <ManageReviews />;
      case 'Cleaners Dashboard':
        return <AdminCleanersDashboard />;
      default:
        return <ManagePayments />;
    }
  };






  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
  
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-center flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('Payments')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Payments'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-credit-card"></i> Payments
        </button>
  
        <button
          onClick={() => setActiveTab('Cleaners Verification')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Cleaners Verification'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-check-circle"></i> Cleaners Verification
        </button>
  
        <button
          onClick={() => setActiveTab('Reviews')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Reviews'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-star"></i> Reviews
        </button>
  
        <button
          onClick={() => setActiveTab('Cleaners Dashboard')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Cleaners Dashboard'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-tachometer-alt"></i> Cleaners Dashboard
        </button>
      </nav>
  
      {/* Content Section */}
      <div className="mt-6">{renderActiveTab()}</div>
    </div>
  );
  












};

export default ProvidersDashboard;
