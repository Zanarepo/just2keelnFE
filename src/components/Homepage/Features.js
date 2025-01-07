import React from 'react';
import { FaSearch, FaQuoteRight, FaCalendarAlt, FaMapMarkerAlt, FaUserCheck } from 'react-icons/fa';
import { GiBroom, GiMoneyStack  } from 'react-icons/gi';
import { FaHandshake } from 'react-icons/fa';

const FeaturesSection = () => {
  const clientFeatures = [
    { icon: <FaSearch className="text-green-700 text-4xl" />, title: 'Easy Search', description: 'Find vetted local professionals effortlessly.' },
    { icon: <FaQuoteRight className="text-green-700 text-4xl" />, title: 'Quote Request & Comparison', description: 'Request and compare multiple quotes on your dashboard.' },
    { icon: <FaCalendarAlt className="text-green-700 text-4xl" />, title: 'Subscription Services', description: 'Manage recurring cleaning schedules with ease.' },
    { icon: <FaMapMarkerAlt className="text-green-700 text-4xl" />, title: 'Real-time Matching', description: 'Get matched with nearby cleaners instantly.' },
    { icon: <FaUserCheck className="text-green-700 text-4xl" />, title: 'Standby Replacements', description: 'Never miss a service with standby replacements.' }
  ];

  const cleanerFeatures = [
    { icon: <GiBroom className="text-green-700 text-4xl" />, title: 'Instant Access to Clients', description: 'Easily connect with clients in your area.' },
    { icon: <FaHandshake  className="text-green-700 text-4xl" />, title: 'Bid & Manage Jobs', description: 'Bid for jobs and manage multiple bookings seamlessly.' },
    { icon: <FaCalendarAlt className="text-green-700 text-4xl" />, title: 'Recurring Services Tools', description: 'Efficiently manage recurring services and track schedules.' },
    { icon: <GiMoneyStack className="text-green-700 text-4xl" />, title: 'Increase Earnings', description: 'Build your reputation and increase your income with verified services.' }
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Key Features</h2>

        {/* Client Features */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">For Clients</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {clientFeatures.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center">
                {feature.icon}
                <h4 className="text-xl font-bold mt-4">{feature.title}</h4>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cleaner Features */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">For Cleaners</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cleanerFeatures.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-center">
                {feature.icon}
                <h4 className="text-xl font-bold mt-4">{feature.title}</h4>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
