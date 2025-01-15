import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Import Supabase client
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const ClientSchedules = () => {
  const [serviceType, setServiceType] = useState('Monthly Cleaning');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceTime, setServiceTime] = useState('');
  const [clientSchedule, setClientSchedule] = useState([]);
  const [cleanerProfile, setCleanerProfile] = useState(null); // To store selected cleaner's profile
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [isCleanerModalOpen, setIsCleanerModalOpen] = useState(false); // To control cleaner modal visibility

  // List of service types
  const serviceTypes = [
    'Monthly Cleaning',
    'Weekly Cleaning',
    'Daily Cleaning',
    'Monthly Fumigation',
    'Bi-weekly Cleaning',
  ];

  // Fetch existing schedules on component mount
  useEffect(() => {
    const fetchSchedules = async () => {
      const email = localStorage.getItem('email');
      
      if (!email) {
        toast.error('Client not logged in.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('clients_main_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (error) {
          toast.error('Error fetching client data.');
          setLoading(false);
          return;
        }

        const clientId = data.id;

        // Fetch client schedules based on the client_id, ordered by the most recent
        const { data: schedules, error: scheduleError } = await supabase
          .from('client_schedules')
          .select('service_date, service_time, service_type, status, cleaner_id')
          .eq('client_id', clientId)
          .order('service_date', { ascending: false }); // Order by most recent

        if (scheduleError) {
          toast.error('Error fetching schedules.');
        } else {
          setClientSchedule(schedules);
        }
      } catch (err) {
        toast.error('Error loading schedules.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Handle adding a new schedule
  const handleAddSchedule = async () => {
    const clientEmail = localStorage.getItem('email');

    if (!clientEmail) {
      toast.error('Client not logged in.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients_main_profiles')
        .select('id')
        .eq('email', clientEmail)
        .single();

      if (error) {
        toast.error('Error fetching client data.');
        return;
      }

      const clientId = data.id;

      const { error: insertError } = await supabase
        .from('client_schedules')
        .insert([
          {
            client_id: clientId,
            service_date: serviceDate,
            service_time: serviceTime,
            service_type: serviceType,
            status: 'Pending', // Default status
          },
        ]);

      if (insertError) {
        toast.error('Failed to add schedule.');
        return;
      }

      toast.success('Schedule added successfully!');
      setClientSchedule((prevSchedules) => [
        ...prevSchedules,
        { service_date: serviceDate, service_time: serviceTime, service_type: serviceType, status: 'Pending' },
      ]);
      setIsModalOpen(false); // Close the modal after adding schedule
    } catch (err) {
      toast.error('Error adding schedule.');
    }
  };

  // Fetch cleaner profile by cleaner_id
  const handleViewCleanerProfile = async (cleanerId) => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('full_name, phone_number, address, profile_picture_url, states_of_residence' )
        .eq('id', cleanerId)
        .single();

      if (error) {
        toast.error('Error fetching cleaner profile.');
        return;
      }

      setCleanerProfile(data);
      setIsCleanerModalOpen(true); // Open cleaner modal
    } catch (err) {
      toast.error('Error fetching cleaner profile.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const closeCleanerModal = () => setIsCleanerModalOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div className="">
  {/* Main Heading */}
  <h2 className="text-2xl sm:text-3xl font-semibold text-green-500 mb-6 sm:mb-8 text-center mt-6 sm:mt-12">
   
  </h2>
  
  <div className="mt-6 sm:mt-8 lg:mt-12 px-4 sm:px-6 lg:px-8">
  <h2 className="text-lg sm:text-xl lg:text-2xl text-center text-green-500 font-semibold mb-6 sm:mb-8 lg:mb-12">
    Your Schedules
  </h2>

  {clientSchedule.length === 0 ? (
    <div className="text-center">No schedules found.</div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full bg-white border border-gray-300 rounded-lg">
        <thead>
        <tr className="bg-green-200 text-sm text-gray-600">
            <th className="py-2 px-4 border-b text-center">Service Type</th>
            <th className="py-2 px-4 border-b text-center">Service Date</th>
            <th className="py-2 px-4 border-b text-center">Service Time</th>
            <th className="py-2 px-4 border-b text-center">Status</th>
            <th className="py-2 px-4 border-b text-center">View Profile</th>
          </tr>
        </thead>
        <tbody>
          {clientSchedule.map((schedule, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b text-center">{schedule.service_type}</td>
              <td className="py-2 px-4 border-b text-center">{schedule.service_date}</td>
              <td className="py-2 px-4 border-b text-center">{schedule.service_time}</td>
              <td className="py-2 px-4 border-b text-center">
                <span
                  className={`px-3 py-1 rounded-full ${
                    schedule.status === 'Pending' ? 'bg-yellow-300' : 'bg-green-300'
                  }`}
                >
                  {schedule.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleViewCleanerProfile(schedule.cleaner_id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>


  {/* Add Schedule Button */}
  <div className="text-center mt-4">
    <button
      onClick={openModal}
      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
    >
      Add Schedule
    </button>
  </div>

  {/* Add Schedule Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <h3 className="text-xl font-semibold mb-4">Add New Schedule</h3>

        {/* Service Type Selection */}
        <div className="mb-4">
          <label htmlFor="service-type" className="block text-lg font-medium">Service Type</label>
          <select
            id="service-type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          >
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        {/* Service Date */}
        <div className="mb-4">
          <label htmlFor="service-date" className="block text-lg font-medium">Service Date</label>
          <input
            type="date"
            id="service-date"
            value={serviceDate}
            onChange={(e) => setServiceDate(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>

        {/* Service Time */}
        <div className="mb-4">
          <label htmlFor="service-time" className="block text-lg font-medium">Service Time</label>
          <input
            type="time"
            id="service-time"
            value={serviceTime}
            onChange={(e) => setServiceTime(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>

        {/* Add Schedule Button */}
        <div className="flex justify-between">
          <button
            onClick={handleAddSchedule}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
          >
            Add Schedule
          </button>
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Cleaner Profile Modal */}
  {isCleanerModalOpen && (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 text-center">
        {/* Profile Picture */}
        {cleanerProfile?.profile_picture_url && (
          <img
            src={cleanerProfile.profile_picture_url}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border border-gray-300 shadow-sm"
          />
        )}

        {/* Modal Header */}
        <h3 className="text-2xl font-semibold mb-4">Profile</h3>

        {/* Profile Details */}
        {cleanerProfile ? (
          <div className="space-y-3 text-left">
            <div><strong>Name:</strong> <span>{cleanerProfile.full_name}</span></div>
            <div><strong>Phone:</strong> <span>{cleanerProfile.phone_number}</span></div>
            <div><strong>Address:</strong> <span>{cleanerProfile.address}</span></div>
            <div><strong>State:</strong> <span>{cleanerProfile.states_of_residence}</span></div>
          </div>
        ) : (
          <div className="text-gray-500 mt-4">Loading profile...</div>
        )}

        {/* Close Button */}
        <button
          onClick={closeCleanerModal}
          className="mt-6 bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default ClientSchedules;
