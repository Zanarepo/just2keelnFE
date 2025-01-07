import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserPlus } from "react-icons/fa"; // Importing icons

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-green-700 p-4 fixed top-0 left-0 w-full z-50 shadow-lg transition-shadow duration-300" ref={navbarRef} role="navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <img
            src="/images/logo.png"
            alt="Cleaning Services Logo" // Descriptive alt text
            className="h-14 w-auto"
            aria-label="Cleaning Services Logo" // ARIA label for logo
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="sm:hidden text-white focus:outline-none"
          aria-label="Toggle menu" // ARIA label for button
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
            aria-hidden="true" // Screen readers will ignore the icon itself
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Navbar Links (Desktop view) */}
        <div className="hidden sm:flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 text-lg">
          <Link to="/" className="text-white hover:text-gray-300 transition duration-300 flex flex-col items-center" aria-label="Go to home page">
            <FaHome className="mb-1" /> {/* Reduced margin */}
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition duration-300 flex flex-col items-center" aria-label="Learn more about us">
            <FaInfoCircle className="mb-1" /> {/* Reduced margin */}
            About
          </Link>
          <Link to="/sign" className="text-white hover:text-gray-300 transition duration-300 flex flex-col items-center" aria-label="Sign in to your account">
            <FaSignInAlt className="mb-1" /> {/* Reduced margin */}
            Login
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300 transition duration-300 flex flex-col items-center" aria-label="Create a new account">
            <FaUserPlus className="mb-1" /> {/* Reduced margin */}
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Dropdown with white background and green text) */}
      <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"} mt-4 space-y-4 bg-white text-green-700 rounded-lg shadow-lg`} role="menu">
        <Link to="/" onClick={handleLinkClick} className="block px-4 py-2 text-lg font-semibold hover:bg-green-100 transition duration-300 flex items-center" aria-label="Go to home page">
          <FaHome className="mr-2" /> Home
        </Link>
        <Link to="/about" onClick={handleLinkClick} className="block px-4 py-2 text-lg font-semibold hover:bg-green-100 transition duration-300 flex items-center" aria-label="Learn more about us">
          <FaInfoCircle className="mr-2" /> About
        </Link>
        <Link to="/sign" onClick={handleLinkClick} className="block px-4 py-2 text-lg font-semibold hover:bg-green-100 transition duration-300 flex items-center" aria-label="Sign in to your account">
          <FaSignInAlt className="mr-2" /> Login
        </Link>
        <Link to="/register" onClick={handleLinkClick} className="block px-4 py-2 text-lg font-semibold hover:bg-green-100 transition duration-300 flex items-center" aria-label="Create a new account">
          <FaUserPlus className="mr-2" /> Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
