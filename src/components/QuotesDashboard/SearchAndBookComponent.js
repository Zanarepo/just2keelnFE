import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnonRequestQuoteForm from './AnonRequestQuoteForm'; // Adjust the path as needed
//import GuestQuoteRequest from '../QuotesDashboard/GuestQuoteRequest';

const CleanerSearch = () => {
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedCleaner, setSelectedCleaner] = useState(null);

  const debounceTimeout = useRef(null); // Ref to store the timeout ID

  const resetFields = () => {
    setState('');
    setLga('');
    setSpecialization('');
    setCleaners([]);
    setSelectedCleaner(null);
  };

  const handleSearch = async () => {
    if (!state) {
      toast.error('Please enter state to search providers.');
      return;
    }

    setLoading(true);
    toast.info('Searching for providers...');

    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id, full_name, address, profile_picture_url, states_of_residence, specialization, bio')
        .ilike('service_locations', `%${state}%`); // Query based on state only

      if (error) throw error;

      if (data.length === 0) {
        toast.error('No providers found matching your criteria.');
      } else {
        setCleaners(data); // Set the found cleaners
        toast.success('Providers found in your area');
      }
    } catch (err) {
      toast.error('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the fields after 30 seconds of inactivity
  useEffect(() => {
    // Clear the previous timeout if there's an input change
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to reset fields after 30 seconds of inactivity
    debounceTimeout.current = setTimeout(() => {
      resetFields();
     
    }, 90000); // Reset after 90 seconds

    // Cleanup the timeout on component unmount
    return () => clearTimeout(debounceTimeout.current);
  }, [state, lga, specialization]); // Effect runs when any of these fields change

  // Function to handle the "Book Now" button click
  const handleBookNow = (cleaner) => {
    setSelectedCleaner(cleaner);
    setShowRequestForm(true); // Show the request form when booking
  };




  return (
   <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg mt6">
  <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Find a Cleaner</h2>

  {/* Form Container */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6 mt16">
    <div>
      <label className="block text-gray-700">State of Residence</label>
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter your state of residence"
      />
    </div>

    <div>
      <label className="block text-gray-700">LGA of Residence</label>
      <input
        type="text"
        value={lga}
        onChange={(e) => setLga(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter your LGA of Residence"
      />
    </div>

    <div>
      <label className="block text-gray-700">Specialization</label>
      <input
        type="text"
        value={specialization}
        onChange={(e) => setSpecialization(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter specialization e.g : Glass Cleaner"
      />
    </div>
  </div>

 {/* Search Button */}
{/* Search Button */}
<div className="flex justify-center mt-4 sm:mt-6">
  <button
    onClick={handleSearch}
    className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
  >
    Search Cleaners
  </button>
</div>



  {/* Loading Text */}
  {loading && <p className="mt-4 text-center text-gray-500">Searching...</p>}

  {/* Search Results */}
  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
    {cleaners.map((cleaner) => (
      <div key={cleaner.id} className="border rounded-lg p-4 flex flex-col justify-between items-center">
        <div className="text-center mb-4">
          <img
            src={cleaner.profile_picture_url || 'https://via.placeholder.com/150'}
            alt={cleaner.full_name}
            className="w-32 h-32 rounded-full mx-auto object-cover mb-2"
          />
          <h4 className="text-lg font-semibold">{cleaner.full_name}</h4>
          <p className="text-gray-600">{cleaner.address}</p>
          <p className="text-sm text-gray-500">Specialization: {cleaner.specialization || 'N/A'}</p>
          <p className="text-sm text-gray-500">State: {cleaner.states_of_residence || 'N/A'}</p>
        </div>

        <button
          onClick={() => handleBookNow(cleaner)}
          className="mt-auto bg-green-600 text-white py-2 px-4 rounded"
        >
          Book Now
        </button>
      </div>
    ))}
  </div>
  {showRequestForm && selectedCleaner && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl relative overflow-auto max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={() => setShowRequestForm(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
      >
        &times; {/* Close Icon (X) */}
      </button>

      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* Left Section - Empty (Removed Image) */}
        {/* Right Section (Form) */}
        <div className="sm:w-full sm:max-w-2xl overflow-auto">
          <h3 className="text-xl font-bold mb-4">Request Quote for {selectedCleaner.full_name}</h3>
          
          {/* Pass cleaner ID to AnonRequestQuoteForm */}
          <AnonRequestQuoteForm 
            cleanerId={selectedCleaner.id} 
            onClose={() => setShowRequestForm(false)} 
          />

          {/* Close Button below the form for accessibility */}
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => setShowRequestForm(false)}
              className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


</div>
  );
};

export default CleanerSearch;
