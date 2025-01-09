import React, { useState, useRef, useEffect } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import ProfileDashboard from "../CleanersDashboard/ProfileDashboard";
import ProfileVerification from "../ProfileVerifications/ProfileVerification";
import PersonalDetails from "../CleanersDashboard/PersonalDetails";
import ProfilePages from "../CleanersDashboard/ProfilePages";
import SubmitBid from "../QuotesDashboard/SubmitBid";
import CleanerQuoteDb from "../CleanersDashboard/CleanerQuoteDb"
import CleanerBids from "../QuotesDashboard/CleanerBids"
import BidsDashboard from "../CleanersDashboard/BidsDashboard"
import CleanerSchedules from "../CleanersDashboard/CleanerSchedules"
import CleanerBookingDetails from "../CleanersDashboard/CleanerBookingDetails"
import BookingForm from "../BookingsProcess/BookingForm"
import GuestBookingsComponent from "../BookingsProcess/GuestBookingsComponent"
import GuestQuoteRequests from "../BookingsProcess/GuestQuoteRequests"
import BidDetails   from "../BookingsProcess/BidDetails"
import GuestandClientQuoteDashboard   from "../BookingsProcess/GuestandClientQuoteDashboard"


import { HomeIcon, UserIcon, CogIcon } from "@heroicons/react/24/outline";
import { FaSignOutAlt, FaTasks  } from 'react-icons/fa';

const ProvidersLayout = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const sidebarRef = useRef(null); // Sidebar reference

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, route: "/" },
    { name: "My Profile", icon: <UserIcon className="h-6 w-6" />, route: "/profile-pages" },
    { name: "Dashboard", icon: <FaTasks  className="h-6 w-6" />, route: "/bids-dashboard" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, route: "/settings" },
    { name: "Logout", icon: <FaSignOutAlt className="h-6 w-6" />, route: "/logout" },
   
    
  ];

  const toggleSidebar = () => setIsOpen(!isOpen); // Toggle sidebar visibility

  // Close sidebar when clicking outside
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
    <div className="flex min-h-screen">
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
          <h4 className="text-lg font-bold">My Dashboard</h4>
          <button onClick={toggleSidebar} className="md:hidden">
            Close
          </button>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index} className="hover:bg-blue-700">
              <NavLink
                to={item.route}
                className="flex items-center p-2 space-x-2"
                activeClassName="bg-blue-600"
                onClick={() => setIsOpen(false)} // Close on mobile after navigation
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-48 p-6 bg-gray-100 min-h-screen">
        <Routes>
          {/* Add routes for each component */}
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/profile-verification" element={<ProfileVerification />} />
          <Route path="/profile-pages" element={<ProfilePages />} />
          <Route path="/personal-details" element={<PersonalDetails />} />
          <Route path="/submit-bid" element={<SubmitBid />} />
          <Route path="/cleaner-quotedb" element={<CleanerQuoteDb />} />
          <Route path="/cleaner-bids" element={<CleanerBids />} />
          <Route path="/bids-dashboard" element={<BidsDashboard />} /> 
          <Route path="/cleaner-schedules" element={< CleanerSchedules />} /> 
          <Route path="/bookings" element={< CleanerBookingDetails />} /> 
          <Route path="booking" element={<BookingForm />} />
          <Route path="guest-booking" element={<GuestBookingsComponent />} />
          <Route path="guest-quotes" element={<GuestQuoteRequests />} />
          <Route path="bids-details" element={<BidDetails />} />
          <Route path="/quote-bookingdashboard" element={<GuestandClientQuoteDashboard />} />

        </Routes>
      </div>
    </div>
  );
};

export default ProvidersLayout;
