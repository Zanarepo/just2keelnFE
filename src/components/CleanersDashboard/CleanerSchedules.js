import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaEye, FaCheck } from 'react-icons/fa'; // Import the necessary icons
import { supabase } from '../../supabaseClient'; // Adjust the path as needed
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and imported

const CleanerSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalDetails, setModalDetails] = useState(null);

  const email = localStorage.getItem('email'); // Retrieve email from localStorage

  // Function to fetch cleaner_id based on email
  const fetchCleanerId = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error fetching cleaner ID:', err.message);
      return null;
    }
  }, [email]);

  const fetchSchedules = useCallback(async () => {
    const cleanerId = await fetchCleanerId(); // Fetch cleaner_id dynamically

    if (!cleanerId) return; // If cleaner_id is not found, exit early

    try {
      const { data, error } = await supabase
        .from('client_schedules')
        .select('*, client:clients_main_profiles (full_name, address, phone_number)')
        .eq('cleaner_id', cleanerId);

      if (error) throw error;
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err.message);
    }
  }, [fetchCleanerId]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleStatusChange = async (scheduleId, newStatus) => {
    try {
      const { error } = await supabase
        .from('client_schedules')
        .update({ status: newStatus })
        .eq('id', scheduleId);

      if (error) throw error;
      fetchSchedules(); // Refresh schedules after update
      toast.success('Schedule status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err.message);
      toast.error('Error updating schedule status.');
    }
  };

  const handleDeleteSchedules = async () => {
    try {
      const { error } = await supabase
        .from('client_schedules')
        .delete()
        .in('id', selectedSchedules);

      if (error) throw error;
      setSelectedSchedules([]); // Clear selected schedules
      fetchSchedules(); // Refresh schedules after deletion
      toast.success('Schedules deleted successfully!');
    } catch (err) {
      console.error('Error deleting schedules:', err.message);
      toast.error('Error deleting schedules.');
    }
  };

  const toggleScheduleSelection = (id) => {
    setSelectedSchedules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">Your Cleaning Schedules</h2>
      <h1 className="text-base text-left text-gray-600 mb-4">This is where you manage all your cleaning schedules from your clients</h1>

      <div className="flex justify-left mb-4">
        <button
          onClick={handleDeleteSchedules}
          className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
            selectedSchedules.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
          disabled={selectedSchedules.length === 0}
        >
          <FaTrash className="inline mr-2" /> Delete Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="bg-green-200 text-sm text-gray-600" >
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Client Name</th>
              <th className="p-2 border">Service Type</th>
              <th className="p-2 border">Service Date</th>
              <th className="p-2 border">Service Time</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr
                key={schedule.id}
                className={`${
                  schedule.status === 'active'
                    ? 'bg-green-100'
                    : schedule.status === 'expired'
                    ? 'bg-red-100'
                    : 'bg-gray-50'
                } hover:bg-gray-100`}
              >
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedSchedules.includes(schedule.id)}
                    onChange={() => toggleScheduleSelection(schedule.id)}
                  />
                </td>
                <td className="p-2 border">{schedule.client.full_name}</td>
                <td className="p-2 border">{schedule.service_type}</td>
                <td className="p-2 border">{schedule.service_date}</td>
                <td className="p-2 border">{schedule.service_time}</td>
                <td className="p-2 border">{schedule.status}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleStatusChange(schedule.id, 'completed')}
                    className="px-2 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <FaCheck className="inline" />
                  </button>
                  <button
                    onClick={() => {
                      setModalDetails(schedule.client);
                      setShowModal(true);
                    }}
                    className="ml-2 px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    <FaEye className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && modalDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Client Details</h3>
            <p><strong>Name:</strong> {modalDetails.full_name}</p>
            <p><strong>Address:</strong> {modalDetails.address}</p>
            <p><strong>Phone Number:</strong> {modalDetails.phone_number}</p>
            <p><strong>Location:</strong> {modalDetails.location}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanerSchedules;
