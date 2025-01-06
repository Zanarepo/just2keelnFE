import React, { useState, useRef, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import ProvidersDashboard from "../AdminDashboard/ProvidersDashboard";
import ClientServicesDashboard from "../ClientsActivities/ClientServicesDashboard";
import AdminWelcomePage from "../AdminDashboard/AdminWelcomePage";

import { HomeIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";
import { FaSignOutAlt } from 'react-icons/fa';  // Updated for logout icon

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false); // Track sidebar state
  const sidebarRef = useRef(null); // Reference to the sidebar

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, route: "/" },
    { name: "Squads DB", icon: <UserIcon className="h-6 w-6" />, route: "/providers-dashboard" },
    { name: "Client Dashboard", icon: <UserIcon className="h-6 w-6" />, route: "/client-dashboard" },
    { name: "Admin", icon: <UserIcon className="h-6 w-6" />, route: "/admin" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt className="h-6 w-6" />, route: "/logout" },  // Updated logout icon
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle sidebar visibility

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);






  return (
    <div className="flex min-h-screen overflow-x-hidden">
    {/* Mobile Toggle Button */}
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
    >
      {isOpen ? "Close" : "Menu"}
    </button>
  
    {/* Sidebar */}
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
        isOpen ? "translate-x-0 z-40" : "-translate-x-full z-30"
      } transition-transform md:translate-x-0 md:w-48 w-48 overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-2">
        <h4 className="text-lg font-bold">Admin Dashboard</h4>
        <button onClick={toggleSidebar} className="md:hidden">
          Close
        </button>
      </div>
  
      <ul className="space-y-2">
        {menuItems.map((item, index) => (
          <li key={index} className="hover:bg-blue-700">
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                `flex items-center p-2 space-x-2 ${
                  isActive ? "bg-blue-600" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  
    {/* Main Content */}
    <div className="flex-1 md:ml-48 p-6 bg-gray-100 min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/providers-dashboard" element={<ProvidersDashboard />} />
        <Route path="/client-dashboard" element={<ClientServicesDashboard />} />
        <Route path="/admindashboard" element={<AdminWelcomePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  </div>
  
  );



  
};

export default AdminLayout;
