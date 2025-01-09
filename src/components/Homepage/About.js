import React from 'react';
import { FaBullhorn, FaHandshake, FaUsers } from 'react-icons/fa'; // Importing Font Awesome icons

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
      
      {/* Card 1 */}
      <div className="about-us-card bg-white p-6 rounded-lg shadow-md text-center">
        <div className="icon-container text-5xl text-green-700 mb-4 flex justify-center mx-auto">
          <FaBullhorn />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
        <p className="text-lg text-gray-600 text-left">
          Our mission is simple: To make cleaning services accessible, reliable, and transparent for everyone. 
          Whether you are a busy professional, a student, or a business owner, Just2Kleen is here to meet your cleaning needs.
        </p>
      </div>

      {/* Card 2 */}
      <div className="about-us-card bg-white p-6 rounded-lg shadow-md text-center">
        <div className="icon-container text-5xl text-green-700 mb-4 flex justify-center mx-auto">
          <FaHandshake />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">What We Offer</h3>
        <p className="text-lg text-gray-600 text-left">
          Just2Kleen offers tailored cleaning solutions that are affordable, convenient, and efficient. We connect clients 
          with professional service providers to ensure high-quality services at competitive prices.
        </p>
      </div>

      {/* Card 3 */}
      <div className="about-us-card bg-white p-6 rounded-lg shadow-md text-center">
      <div className="icon-container text-5xl text-green-700 mb-4 flex justify-center mx-auto">
  <FaUsers />
</div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
        <p className="text-lg text-gray-600 text-left">
          We prioritize community building, transparency, and service excellence. Cleaners manage their schedules, and clients 
          easily book and pay for services with confidence, ensuring a seamless experience.
        </p>
      </div>
    </div>

  </div>

  {/* Meet Our Team Section */}
  <div className="about-us-team bg-white-100 py-12 mt-8">
    <h3 className="text-3xl font-bold text-center text-green-700 mb-8">Meet Our Team</h3>
    <div className="team-members grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
        <img src="images/Zana.jpg" alt="zana" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
        <h4 className="team-member-name text-xl font-bold mb-2">Prince Zana</h4>
        <p className="team-member-role text-md text-gray-600">Head of Product</p>
      </div>
      <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
        <img src="images/Patrick.jpg" alt="patrick" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
        <h4 className="team-member-name text-xl font-bold mb-2">Patrick Agba</h4>
        <p className="team-member-role text-md text-gray-600">Head of Operations</p>
      </div>
      <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
        <img src="images/Paul.jpg" alt="paul" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
        <h4 className="team-member-name text-xl font-bold mb-2">Paul Evalsam</h4>
        <p className="team-member-role text-md text-gray-600">Head of Strategy</p>
      </div>
      <div className="team-member bg-white p-6 rounded-lg shadow-md text-center">
        <img src="images/oluchi.jpg" alt="oluchi" className="team-member-photo rounded-full mb-4 w-24 h-24 mx-auto" />
        <h4 className="team-member-name text-xl font-bold mb-2">Oluchi Ezugo</h4>
        <p className="team-member-role text-md text-gray-600">Head of Brands</p>
      </div>
    </div>
  </div>

</section>

  );
};

export default AboutUsSection;
