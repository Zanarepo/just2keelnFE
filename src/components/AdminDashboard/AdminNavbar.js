import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Top Navbar */}
      <div className="flex justify-between items-center bg-green-500 text-white sticky top-0 z-10">
        <button onClick={toggleMenu} className="lg:hidden p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold p-4">Admin Dashboard</h1>

        {/* Navbar Links */}
        <div className={`lg:flex space-x-4 ${isOpen ? 'block' : 'hidden'} p-4 lg:p-0`}>
          <Link
            to="/client-dashboard"
            className="text-lg text-white hover:text-green-300"
          >
            Clients Dashboard
          </Link>
          <Link
            to="/providers-dashboard"
            className="text-lg text-white hover:text-green-300"
          >
            Cleaners Dashboard
          </Link>
          <Link
            to="/admins"
            className="text-lg text-white hover:text-green-300"
          >
            Admins Dashboard
          </Link>
          <Link
            to="/settings"
            className="text-lg text-white hover:text-green-300"
          >
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
