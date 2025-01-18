import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the button clicks
  const handleGetStartedClick = () => {
    navigate('/register'); // Navigate to /register page
  };

  const handleLearnMoreClick = () => {
    navigate('/about'); // Navigate to /about page
  };

  return (
    <header className="bg-white text-gray-800 p-6 sm:p-12 md:p-16 mt-16">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left Content: Image */}
      <div>
        <img
          src="/images/Hero2.jpg"
          alt="Professional cleaning service"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
  
      {/* Right Content: Text */}
      <div>
      <h1 className="text-3xl sm:text-4xl text-green-700 md:text-5xl text-center font-bold mb-4">
  Welcome to Just2Kleen
</h1>

        <p className="text-base sm:text-lg md:text-xl  text-center mb-6">
          Get affordable and professional cleaning services for homes and offices.
          Whether you&apos;re a student, a working professional, or a company, we
          have solutions for all your cleaning needs.
        </p>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center">
  <button
    onClick={handleGetStartedClick}
    className="bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition w-full sm:w-auto"
  >
    Get Started
  </button>
  <button
    onClick={handleLearnMoreClick}
    className="bg-gray-200 text-green-700 px-6 py-3 font-bold rounded-lg shadow-lg hover:bg-gray-300 transition w-full sm:w-auto"
  >
    Learn More...
  </button>
</div>

      </div>
    </div>
  </header>
  
  )  
};

export default HeroSection;
