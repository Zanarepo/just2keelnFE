import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const servicesList = [
  'House Cleaning',
  'Office Cleaning',
  'Window Cleaning',
  'Carpet Cleaning',
  'Post Construction Cleaning',
  'Move In/Out Cleaning',
];

const GuestBookingForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [numRooms, setNumRooms] = useState('');
  const [buildingType, setBuildingType] = useState('');
  const [buildingCondition, setBuildingCondition] = useState('');
  const [hasWater, setHasWater] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [providers, setProviders] = useState([]);

  const handleServiceChange = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSearch = async () => {
    if (!location || !budget) {
      toast.error('Please enter location and budget to search providers.');
      return;
    }

    const { data, error } = await supabase
      .from('cleaners_main_profiles')
      .select('id, full_name, address, profile_picture_url, states_of_residence, specialization, bio')
      .ilike('service_locations', `%${location}%`);

    if (error) {
      toast.error('Error fetching providers');
    } else {
      setProviders(data);
      toast.success('Providers found in your area');
    }
  };

  const handleBooking = async (providerId) => {
    if (!fullName || !phoneNumber || selectedServices.length === 0) {
      toast.error('Please fill in your name, phone number, and select at least one service.');
      return;
    }

    const { error } = await supabase.from('guest_bookings').insert([
      {
        full_name: fullName,
        email: email || null,
        phone_number: phoneNumber,
        location,
        budget: budget ? parseInt(budget, 10) : null,
        num_rooms: numRooms ? parseInt(numRooms, 10) : null,
        building_type: buildingType || null,
        building_condition: buildingCondition || null,
        has_water: hasWater,
        special_request: specialRequest || null,
        services: selectedServices.join(', '),
        service_provider_id: providerId,
      },
    ]);

    if (error) {
      toast.error('Error creating booking');
    } else {
      toast.success('Booking created successfully!');
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setLocation('');
      setBudget('');
      setNumRooms('');
      setBuildingType('');
      setBuildingCondition('');
      setHasWater(false);
      setSpecialRequest('');
      setSelectedServices([]);
      setProviders([]);
    }
  };


  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-gray-50">
      {!providers.length ? (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Request Cleaning Services</h2>
          <div className="grid grid-cols-1 gap-6"> {/* Stack fields vertically on mobile */}
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Budget</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter your budget"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Types of Services Needed</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {servicesList.map((service) => (
                  <button
                    key={service}
                    type="button"
                    className={`py-2 px-4 rounded-full border ${selectedServices.includes(service)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleServiceChange(service)}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
  
            <div>
              <label className="block text-gray-700">Number of Rooms</label>
              <input
                type="number"
                value={numRooms}
                onChange={(e) => setNumRooms(e.target.value)}
                placeholder="Number of rooms"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Building Type</label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select building type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
  
            <div>
              <label className="block text-gray-700">Building Condition</label>
              <select
                value={buildingCondition}
                onChange={(e) => setBuildingCondition(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select building condition</option>
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
  
            <div>
              <label className="block text-gray-700">Does the facility have water?</label>
              <input
                type="checkbox"
                checked={hasWater}
                onChange={() => setHasWater(!hasWater)}
                className="mt-2"
              />
            </div>
  
            <div>
              <label className="block text-gray-700">Special Request (Optional)</label>
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="Enter any special requests or needs"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>
  
          <button
            onClick={handleSearch}
            className="mt-6 w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded"
          >
            Search Providers
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Providers Available in Your Area
            </h2>
          </div>
  
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="border rounded-lg p-4 flex flex-col justify-between items-center"
              >
                <div className="text-center mb-4">
                  <img
                    src={provider.profile_picture_url || 'https://via.placeholder.com/150'}
                    alt={provider.full_name}
                    className="w-32 h-32 rounded-full mx-auto object-cover mb-2"
                  />
                  <h4 className="text-lg font-semibold">{provider.full_name}</h4>
                  <p className="text-gray-600">{provider.address}</p>
                  <p className="text-sm text-gray-500">
                    Specialization: {provider.specialization || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    State of Residence: {provider.states_of_residence || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => handleBooking(provider.id)}
                  className="mt-auto bg-green-600 text-white py-2 px-4 rounded"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  
  



};

export default GuestBookingForm;
