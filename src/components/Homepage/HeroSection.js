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
    <header className="bg-green-700 text-white p-6 sm:p-12 md:p-16 mt-16">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between">
      {/* Left Content: Text + CTA */}
      <div className="text-center md:text-left mb-8 md:mb-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Welcome to Just2Kleen
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6">
          Affordable, reliable, and professional cleaning services right at your
          fingertips. Whether you&apos;re a busy professional, a student, or a
          corporate organization, we&apos;ve got tailored cleaning solutions for
          you.
        </p>

        {/* Buttons Section */}
       {/* Buttons Section */}
{/* Buttons Section */}
<div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center items-center">
  <button
    onClick={handleGetStartedClick} // Trigger navigation to register page
    className="bg-white text-green-700 px-6 py-3 rounded-lg shadow-lg hover:bg-green-100 transition w-full sm:w-auto"
  >
    Get Started
  </button>
  <button
    onClick={handleLearnMoreClick} // Trigger navigation to about page
    className="bg-gray-100 text-green-700 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition w-full sm:w-auto"
  >
    Learn More
  </button>
</div>



      </div>

      {/* Right Content: Placeholder for image or graphic 
      <div className="w-full md:w-1/2">
        <img
          src="images/cleaning-banner.png"
          alt="Cleaning Services Banner"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      



        
        </div>*/}

        {/* Right Content: Illustration */}
        <div className="mb-8 md:mb-0">
          <img
            src="/images/logo.png"
            alt="Cleaning service illustration"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
