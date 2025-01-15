import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const GuestQuoteRequest = ({ cleanerId, onClose = () => {} }) => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const serviceTypes = [
    'House Cleaning',
    'Office Cleaning',
    'Window Cleaning',
    'Carpet Cleaning',
    'Deep Cleaning',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('guest_quote_request').insert({
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        service_type: serviceType,
        location,
        description,
        budget_range: budgetRange,
        cleaner_id: cleanerId,
      });

      if (error) {
        console.error('Error inserting quote request:', error);
        throw error;
      }

      toast.success('Quote request submitted successfully!');
      // Clear form fields
      setServiceType('');
      setLocation('');
      setDescription('');
      setFullName('');
      setBudgetRange('');
      setEmail('');
      setPhoneNumber('');
      onClose();
    } catch (err) {
      console.error('Error submitting quote request:', err);
      toast.error(`Failed to submit quote request: ${err.message || err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="serviceType">Service Type</label>
        <select
          id="serviceType"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          required
        >
          <option value="" disabled>Select a service type</option>
          {serviceTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter the location"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Describe the service required"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="budgetRange">Budget Range</label>
        <input
          type="text"
          id="budgetRange"
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter your budget range"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="email">Email (Optional)</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter your email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700" htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter your phone number"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
      >
        Submit Request
      </button>
    </form>
  );
};

export default GuestQuoteRequest;
