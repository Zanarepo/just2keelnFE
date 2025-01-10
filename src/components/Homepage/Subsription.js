import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '../../supabaseClient'; // Assuming supabaseClient is set up
//import InactivityHandler from "../Homepage/InactivityHandler"

const PreSubscribeComponent = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cleanerPreference: '',
  });
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedBuildingType, setSelectedBuildingType] = useState('');
  const [selectedNumRooms, setSelectedNumRooms] = useState('');
  const [selectedCleaningFrequencyId, setSelectedCleaningFrequencyId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from('cleaning_subscriptions')
          .select('*');
        if (subscriptionError) throw subscriptionError;
  
        const { data: frequencyData, error: frequencyError } = await supabase
          .from('cleaning_frequencies')
          .select('*');
        if (frequencyError) throw frequencyError;
  
        setSubscriptions(subscriptionData);
        setFrequencies(frequencyData);
      } catch (error) {
        toast.error('Error fetching data: ' + error.message);
      }
    };
  
    fetchData();
  }, []); // Empty dependency array ensures it only runs once
  
  const uniqueBuildingTypes = [...new Set(subscriptions.map((sub) => sub.building_type))];

  const filteredSubscriptions = subscriptions.filter(
    (sub) => sub.building_type === selectedBuildingType
  );

  const handleSearch = () => {
    const matchingSubscription = filteredSubscriptions.find(
      (subscription) =>
        subscription.num_rooms === parseInt(selectedNumRooms) &&
        subscription.frequency_id === parseInt(selectedCleaningFrequencyId)
    );

    if (matchingSubscription) {
      setSelectedSubscription(matchingSubscription);
    } else {
      toast.info('No matching subscription found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.cleanerPreference) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const {  error } = await supabase.from('subscription_clients').insert([
        {
          client_full_name: formData.name,
          client_email: formData.email,
          client_phone_number: formData.phone,
          cleaner_preference: formData.cleanerPreference,
          subscription_id: selectedSubscription.id,
          frequency_id: selectedCleaningFrequencyId, // Include frequency ID
        },
      ]);
      if (error) throw error;

      toast.success('We will get back to you soon');
      setModalOpen(false);
      setFormData({ name: '', email: '', phone: '', cleanerPreference: '' });
    } catch (error) {
      toast.error('Error submitting your details: ' + error.message);
    }
  };



  return (
    <div className="p-6 max-w-4xl mx-auto">
    
      <div className="p-8 border border-gray-300 rounded-lg shadow-lg bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Building Type Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Building Type</label>
            <select
              value={selectedBuildingType}
              onChange={(e) => setSelectedBuildingType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Building Type</option>
              {uniqueBuildingTypes.map((buildingType) => (
                <option key={buildingType} value={buildingType}>
                  {buildingType}
                </option>
              ))}
            </select>
          </div>
  
          {/* Number of Rooms */}
          <div>
            <label className="block text-sm font-semibold mb-2">Number of Rooms</label>
            <select
              value={selectedNumRooms}
              onChange={(e) => setSelectedNumRooms(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Number of Rooms</option>
              {filteredSubscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.num_rooms}>
                  {subscription.num_rooms}
                </option>
              ))}
            </select>
          </div>
  
          {/* Cleaning Frequency */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cleaning Frequency</label>
            <select
              value={selectedCleaningFrequencyId}
              onChange={(e) => setSelectedCleaningFrequencyId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Cleaning Frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency.id} value={frequency.id}>
                  {frequency.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Price Range */}
          <div>
            <label className="block text-sm font-semibold mb-2">Price Range</label>
            <input
              type="text"
              value={`₦${selectedSubscription?.price || 'N/A'}`}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
  
        {/* Check Price Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Check Price
          </button>
        </div>
      </div>
  
  
  




  {/* Display Matching Subscription Cards */}
{selectedSubscription && (
  <div className="mt-8 flex justify-center">
    <div className="p-6 border border-gray-300 rounded-lg shadow-lg max-w-sm text-center">
      <h3 className="text-lg font-bold mb-4">Monthly Subscription For:</h3>
      <p className="mb-2">
        <strong>Building Type:</strong> {selectedSubscription.building_type}
      </p>
      <p className="mb-2">
        <strong>Number of Rooms:</strong> {selectedSubscription.num_rooms}
      </p>
      <p className="mb-2">
        <strong>Frequency:</strong>{' '}
        {frequencies.find((f) => f.id === selectedSubscription.frequency_id)?.name}
      </p>
      <p className="mb-4 text-xl font-semibold text-green-600">
        <strong>Price:</strong> ₦{selectedSubscription.price}
      </p>
      <p className="mb-4">
        <strong>Description:</strong> {selectedSubscription.description}
      </p>
      <button
        onClick={() => setModalOpen(true)}
        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Pre-Subscribe Now
      </button>
    </div>
  </div>
)}

      {/* Modal for Collecting Client Details */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Enter Your Details</h3>
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              {/* Email Address */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              {/* Phone Number */}
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              {/* Cleaner Preference */}
              <div className="mb-4">
                <label htmlFor="cleanerPreference" className="block text-sm font-medium text-gray-700">
                  Cleaner Preference
                </label>
                <input
                  type="text"
                  id="cleanerPreference"
                  value={formData.cleanerPreference}
                  onChange={(e) => setFormData({ ...formData, cleanerPreference: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
  
              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default PreSubscribeComponent;