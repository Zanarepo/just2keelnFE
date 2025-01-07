import React from 'react';

const PricingSection = () => {
  const packages = [
    {
      name: 'Basic',
      services: ['One-time cleaning', 'Basic cleaning tools'],
      price: '$50 per service'
    },
    {
      name: 'Standard',
      services: ['Recurring cleaning', 'Basic + Deep cleaning', 'Priority booking'],
      price: '$200 per month'
    },
    {
      name: 'Premium',
      services: ['Deep cleaning', 'Event cleanup', 'Standby replacements', 'Personalized schedule'],
      price: '$350 per month'
    }
  ];

  return (
    <section className="pricing-section py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          Affordable Pricing, Tailored to Your Needs
        </h2>
        <div className="pricing-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="pricing-card bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
            >
              <h3 className="package-name text-2xl font-semibold text-gray-700 mb-4">{pkg.name}</h3>
              <ul className="services-list text-left text-gray-600 mb-4">
                {pkg.services.map((service, idx) => (
                  <li key={idx} className="service-item text-lg mb-2 flex items-center">
                    <span className="mr-2">✔</span>{service}
                  </li>
                ))}
              </ul>
              <p className="package-price text-xl font-semibold text-green-600">{pkg.price}</p>
              <button className="cta-btn bg-green-600 text-white mt-4 px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
