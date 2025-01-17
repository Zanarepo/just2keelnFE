import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';  // Import the Supabase client
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for toast
import { toast } from 'react-toastify';
const PartnershipComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: '',
    address: '',
    contact_number: '',
    email: '',
  });

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { organization_name, address, contact_number, email } = formData;

    // Store form data in Supabase
    const { error } = await supabase
      .from('partnerships')
      .insert([
        {
          organization_name,
          address,
          contact_number,
          email,
        },
      ]);

    if (error) {
        toast.error('Error submitting form: ' + error.message);
    } else {
      toast.success('Form submitted successfully!');
    }

    handleModalClose();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const partnershipData = [
    {
      title: 'Construction Companies',
      description: 'We provide post-construction maintenance cleaning services to ensure newly built properties are spotless and move-in ready.',
      image: '/images/Constructionpartner.jpg',
    },
    {
      title: 'Real Estate Companies',
      description: 'Partner with us to maintain your properties and enhance their market appeal.',
      image: '/images/Estates.jpg',
    },
    {
      title: 'Schools',
      description: 'We offer regular and thorough cleaning services to ensure a safe and clean learning environment.',
      image: '/images/schools.jpg',
    },
    {
      title: 'Event Planners',
      description: 'Let us handle the cleanup after events, so you can focus on delivering memorable experiences.',
      image: '/images/event2.jpg',
    },
    {
      title: 'Parks',
      description: 'We help maintain cleanliness in public and private parks for a refreshing outdoor experience.',
      image: '/images/Parks.jpg',
    },
    {
      title: 'Corporate Bodies',
      description: 'Partner with us for regular office cleaning and facility maintenance services.',
      image: '/images/corporate.jpg',
    },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-8">
        Partner with Just2Kleen
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-6 max-w-7xl mx-auto">
        {partnershipData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-4 flex flex-col items-center text-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover mb-4 rounded-md"
            />
            <h3 className="text-lg font-bold text-green-700 mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <button
              onClick={handleModalOpen}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Partner with Us
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-green-700 mb-4">Partner with Us</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="organization_name">
                  Name of Organization
                </label>
                <input
                  type="text"
                  id="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="contact_number">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnershipComponent;
