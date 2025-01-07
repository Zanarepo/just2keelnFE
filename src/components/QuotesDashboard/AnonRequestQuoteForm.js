import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and imported

const GuestQuoteRequestForm = () => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]); // Dropdown options for service types

  useEffect(() => {
    // Fetch predefined service types (this can be static or from a database)
    const predefinedServiceTypes = [
      'House Cleaning',
      'Office Cleaning',
      'Carpet Cleaning',
      'Window Cleaning',
      'Deep Cleaning'
    ];
    setServiceTypes(predefinedServiceTypes);
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the form data
    console.log({
      email,
      phoneNumber,
      serviceType,
      location,
      description,
      budgetRange
    });
  
    try {
      // Insert new quote request into the Guest_quote_request table
      const {  error } = await supabase.from('guest_quote_request').insert({
        email,
        phone_number: phoneNumber,
        service_type: serviceType,
        location,
        description,
        budget_range: budgetRange
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
      setBudgetRange('');
      setEmail('');
      setPhoneNumber('');
    } catch (err) {
      console.error('Error submitting quote request:', err);  // Log the error to the console
      toast.error(`Failed to submit quote request: ${err.message || err}`);
    }
  };
  
  









  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Request a Quote</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          >
            <option value="" disabled>Select a service type</option>
            {serviceTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter the location"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Describe the service required"
            required
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700">Budget Range</label>
          <input
            type="text"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your budget range"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700">Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your email"
          />
        </div>
  
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Enter your phone number"
          />
        </div>
  
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
  
};

export default GuestQuoteRequestForm;
