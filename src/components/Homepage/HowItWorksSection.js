import React from 'react';
import { FaUserPlus, FaClipboardList, FaSmile } from 'react-icons/fa';
import { GiBroom, GiReceiveMoney, GiCalendar } from 'react-icons/gi';

const HowItWorksSection = () => {
  const clientSteps = [
    { icon: <FaUserPlus className="text-green-700 text-4xl" />, title: 'Sign Up & Browse', description: 'Register and explore local professionals.' },
    { icon: <FaClipboardList className="text-green-700 text-4xl" />, title: 'Request Quotes', description: 'Compare offers and choose the best provider.' },
    { icon: <GiCalendar className="text-green-700 text-4xl" />, title: 'Book & Manage', description: 'Schedule and manage services through your dashboard.' },
    { icon: <FaSmile className="text-green-700 text-4xl" />, title: 'Relax & Enjoy', description: 'Let the pros handle your chores while you relax.' }
  ];

  const cleanerSteps = [
    { icon: <FaUserPlus className="text-green-700 text-4xl" />, title: 'Sign Up & Get Verified', description: 'Register and complete verification to start offering services.' },
    { icon: <GiBroom className="text-green-700 text-4xl" />, title: 'Bid for Jobs', description: 'Receive and respond to job requests from nearby clients.' },
    { icon: <GiCalendar className="text-green-700 text-4xl" />, title: 'Manage Bookings', description: 'Track recurring services and manage appointments.' },
    { icon: <GiReceiveMoney className="text-green-700 text-4xl" />, title: 'Earn & Build Reputation', description: 'Deliver great services and grow your business.' }
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">How It Works</h2>

        {/* Client Steps */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">For Clients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {clientSteps.map((step, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col items-center text-center">
                {step.icon}
                <h4 className="text-xl font-bold mt-4">{step.title}</h4>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cleaner Steps */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">For Cleaners</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {cleanerSteps.map((step, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col items-center text-center">
                {step.icon}
                <h4 className="text-xl font-bold mt-4">{step.title}</h4>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
