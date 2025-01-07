import React from "react";

const HeaderSection = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Just2Kleen: We&apos;re the Best in Cleaning Services
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl mb-6">
          Discover exceptional cleaning services that ensure your home or office sparkles with freshness. 
          From one-time deep cleaning to regular maintenance, we offer tailored solutions to meet all your needs.
        </p>

        {/* Call to Action */}
        <div>
          <a
            href="#services"
            className="bg-green-800 hover:bg-green-900 text-white py-3 px-6 rounded-md text-lg font-semibold transition duration-300"
          >
            Explore Our Services
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
