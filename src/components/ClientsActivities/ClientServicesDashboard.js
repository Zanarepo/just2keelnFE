import React, { useState } from 'react';
import ClientCleanerMatch from './ClientCleanerMatch';
import ClientList from './ClientList';
import ClientSubscriptions from './ClientSubscriptions';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientServices = () => {
  const [activeTab, setActiveTab] = useState('Cleaner Match');

  const renderContent = () => {
    switch (activeTab) {
      case 'Cleaner Match':
        return <ClientCleanerMatch />;
      case 'Client List':
        return <ClientList />;
      case 'Subscriptions':
        return <ClientSubscriptions />;
      default:
        return <ClientCleanerMatch />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-center flex-wrap gap-4">
        <button
          onClick={() => setActiveTab('Cleaner Match')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Cleaner Match'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-handshake"></i> Cleaner Match
        </button>

        <button
          onClick={() => setActiveTab('Client List')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Client List'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-users"></i> Client List
        </button>

        <button
          onClick={() => setActiveTab('Subscriptions')}
          className={`w-full sm:w-auto px-5 py-3 rounded-lg text-center text-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 border-2 ${
            activeTab === 'Subscriptions'
              ? 'bg-green-500 text-white border-green-600'
              : 'bg-transparent text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'
          }`}
        >
          <i className="fas fa-receipt"></i> Subscriptions
        </button>
      </nav>

      {/* Content Section */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
};

export default ClientServices;
