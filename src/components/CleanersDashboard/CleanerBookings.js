import React, { useState, useEffect, useCallback } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { supabase } from '../../supabaseClient'; // Adjust the path as needed
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and imported

const CleanerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
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

  const fetchBookings = useCallback(async () => {
    const cleanerId = await fetchCleanerId(); // Fetch cleaner_id dynamically
  
    if (!cleanerId) return; // If cleaner_id is not found, exit early
  
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, client:clients_main_profiles (full_name, address, phone_number)') // Fetch client details
        .eq('service_provider_id', cleanerId); // Ensure we're filtering by cleaner's ID (service_provider_id)
  
      if (error) throw error;
      setBookings(data); // Set the bookings data
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
    }
  }, [fetchCleanerId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleDeleteBookings = async () => {
      try {
        const { error } = await supabase
          .from('bookings')
          .delete()
          .in('id', selectedBookings);
  
        if (error) throw error;
        setSelectedBookings([]); // Clear selected schedules
        fetchBookings(); // Refresh schedules after deletion
        toast.success('Schedules deleted successfully!');
      } catch (err) {
        console.error('Error deleting schedules:', err.message);
        toast.error('Error deleting schedules.');
      }
    };
  
    const toggleBookingSelection = (id) => {
      setSelectedBookings((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Client Booking Requests</h2>

      <div className="flex justify-right mb-4">
        <button
          onClick={handleDeleteBookings}
          className={`px-4 py-2 text-white bg-red-600 rounded-lg ${
            selectedBookings.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          }`}
          disabled={selectedBookings.length === 0}
        >
          <FaTrash className="inline mr-2" /> Delete Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Select</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Final Quote</th>
              <th className="p-2 border">Budget</th>
              <th className="p-2 border">Building Type</th>
              <th className="p-2 border">Building Condition</th>
              <th className="p-2 border">Has Water</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-100"
              >
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={() => toggleBookingSelection(booking.id)} // Fix to allow individual checkbox toggling
                  />
                </td>
                <td className="p-2 border">{booking.location}</td>
                <td className="p-2 border">{booking.final_quote}</td>
                <td className="p-2 border">{booking.budget}</td>
                <td className="p-2 border">{booking.building_type}</td>
                <td className="p-2 border">{booking.building_condition}</td>
                <td className="p-2 border">{booking.has_water ? 'Yes' : 'No'}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => {
                      setModalDetails(booking.client);
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
        <div className="flex justify-center mt-4">
            <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
                Close
            </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CleanerBookings;
