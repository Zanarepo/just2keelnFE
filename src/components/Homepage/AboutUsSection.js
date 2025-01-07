import React from 'react';

const AboutUsSection = () => {
  return (
    <section className="about-us-section bg-light py-12">
      <div className="container mx-auto px-4 text-center md:text-left">

        {/* About Us Header */}
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          About Just2Kleen
        </h2>

        {/* About Us Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="about-us-card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-lg text-gray-600">
              Our mission is simple: To make cleaning services accessible, reliable, and transparent for everyone. 
              Whether you are a busy professional, a student, or a business owner, Just2Kleen is here to meet your cleaning needs.
            </p>
          </div>
          <div className="about-us-card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What We Offer</h3>
            <p className="text-lg text-gray-600">
              Just2Kleen offers tailored cleaning solutions that are affordable, convenient, and efficient. We connect clients 
              with professional service providers to ensure high-quality services at competitive prices.
            </p>
          </div>
          <div className="about-us-card bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
            <p className="text-lg text-gray-600">
              We prioritize community building, transparency, and service excellence. Cleaners manage their schedules, and clients 
              easily book and pay for services with confidence, ensuring a seamless experience.
            </p>
          </div>
        </div>
        
      </div>

      {/* Meet Our Team Section */}
      <div className="about-us-team bg-gray-100 py-12 mt-8">
        <h3 className="text-3xl font-bold text-center text-green-700 mb-8">Meet Our Team</h3>
        <div className="team-members grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
            <img src="images/Zana.jpg" alt="Jane Doe" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
            <h4 className="team-member-name text-xl font-bold mb-2">Prince Zana</h4>
            <p className="team-member-role text-md text-gray-600">Heade- Product & Strategy</p>
          </div>
          <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
            <img src="team-member-2.jpg" alt="John Smith" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
            <h4 className="team-member-name text-xl font-bold mb-2">John Smith</h4>
            <p className="team-member-role text-md text-gray-600">COO</p>
          </div>
          <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
            <img src="team-member-3.jpg" alt="Emily Johnson" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
            <h4 className="team-member-name text-xl font-bold mb-2">Emily Johnson</h4>
            <p className="team-member-role text-md text-gray-600">Head of Marketing</p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutUsSection;
