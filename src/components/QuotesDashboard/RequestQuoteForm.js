// React Component to handle Quote Requests
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and imported

const QuoteRequestForm = () => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]); // Dropdown options for service types

  // Retrieve client email from local storage
  const clientEmail = localStorage.getItem('email');

  useEffect(() => {
    // Fetch pre-defined service types (this can be static or from a database)
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

    try {
      // Fetch client_id using the email
      const { data: clientData, error: clientError } = await supabase
        .from('clients_main_profiles')
        .select('id')
        .eq('email', clientEmail)
        .single();

      if (clientError) throw clientError;

      const clientId = clientData.id;

      // Insert new quote request into the quote_requests table
      const { error } = await supabase.from('quote_requests').insert({
        client_id: clientId,
        location,
        service_type: serviceType,
        description,
        budget_range: budgetRange
      });

      if (error) throw error;

      toast.success('Quote request submitted successfully!');
      // Clear form fields
      setServiceType('');
      setLocation('');
      setDescription('');
      setBudgetRange('');
    } catch (err) {
      console.error('Error submitting quote request:', err.message);
      toast.error('Failed to submit quote request. Please try again.');
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            placeholder="Enter the location"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            placeholder="Enter your budget range"
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

export default QuoteRequestForm;
