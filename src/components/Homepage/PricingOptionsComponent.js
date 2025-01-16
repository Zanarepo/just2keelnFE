import React from 'react';
import { FaCheckCircle, FaCalendarAlt, FaDollarSign, FaUserTie } from 'react-icons/fa';

const PricingOptionsComponent = () => {
 
  return (
    <div className="px-4 py-8 bg-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
        Tailored Subscription Plans for Your Cleaning Needs
      </h2>
      <p className="text-base sm:text-xl text-center text-gray-700 mb-6">
        At <span className="font-semibold text-green-700">Just2Kleen</span>, we’ve got you covered with a range of carefully curated monthly subscription plans designed to suit your unique cleaning needs. Follow the steps below to find the perfect plan for you!
      </p>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1: Choose a Plan */}
        <div className="w-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="text-green-700 text-3xl mb-3">
            <FaDollarSign />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Choose a Plan</h3>
          <p className="text-sm text-gray-600 text-center">
            Select the subscription plan that best fits your needs. Whether it’s weekly, bi-weekly, or monthly, we offer flexible options!
          </p>
        </div>
  
        {/* Step 2: Pre-Subscribe */}
        <div className="w-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="text-green-700 text-3xl mb-3">
            <FaCheckCircle />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Pre-Subscribe</h3>
          <p className="text-sm text-gray-600 text-center">
            Simply pre-subscribe and provide us with your details. We’ll reach out promptly to finalize your subscription.
          </p>
        </div>
  
        {/* Step 3: Schedule */}
        <div className="w-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="text-green-700 text-3xl mb-3">
            <FaCalendarAlt />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Schedule Your Cleaning</h3>
          <p className="text-sm text-gray-600 text-center">
            Once your subscription is confirmed, choose your preferred cleaning dates and we’ll match you with the right cleaner.
          </p>
        </div>
  
        {/* Step 4: Get Matched with a Cleaner */}
        <div className="w-full p-6 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col items-center justify-between">
          <div className="text-green-700 text-3xl mb-3">
            <FaUserTie />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">Get Matched with a Cleaner</h3>
          <p className="text-sm text-gray-600 text-center">
            Based on your preferences, we’ll match you with a professional cleaner who can best meet your needs.
          </p>
        </div>
      </div>
  
      <div className="mt-6 text-center">
        <p className="text-sm sm:text-lg text-gray-700">
          Pre-subscription is available for a limited time, ensuring the perfect match for your cleaning requirements. Don’t miss this opportunity to secure a tailored cleaning plan that works perfectly for you!
        </p>
      </div>
  
      {/* Horizontal Divider Line */}
      <div className="border-t-2 border-gray-300 mt-6"></div>
    </div>
  );
  
};

export default PricingOptionsComponent;
