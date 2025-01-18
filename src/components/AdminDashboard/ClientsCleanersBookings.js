import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

const BookingsDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Fetch booking details
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(
            'booking_id, services, location, budget, num_rooms, building_type, building_condition, has_water, status, special_request, final_quote, client_approval, created_at, updated_at, service_provider_id, client_id'
          );

        if (bookingsError) throw bookingsError;

        const clientIds = bookingsData.map((booking) => booking.client_id);
        const serviceProviderIds = bookingsData.map((booking) => booking.service_provider_id);

        // Fetch client details
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients_main_profiles')
          .select('id, full_name')
          .in('id', clientIds);

        if (clientsError) throw clientsError;

        // Fetch cleaner (service provider) details
        const { data: cleanersData, error: cleanersError } = await supabase
          .from('cleaners_main_profiles')
          .select('id, full_name')
          .in('id', serviceProviderIds);

        if (cleanersError) throw cleanersError;

        // Map data to display
        const bookingsWithDetails = bookingsData.map((booking) => {
          const client = clientsData.find((c) => c.id === booking.client_id);
          const cleaner = cleanersData.find((cl) => cl.id === booking.service_provider_id);

          return {
            ...booking,
            clientName: client?.full_name || 'N/A',
            cleanerName: cleaner?.full_name || 'N/A',
          };
        });

        setBookings(bookingsWithDetails);
      } catch (error) {
        toast.error('Failed to fetch bookings');
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="w-full p-0">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-4">Bookings Dashboard</h2>
      <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-200 text-sm text-gray-600">
              <th className="px-4 py-2 text-left">Client Name</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Budget</th>
              <th className="px-4 py-2 text-left">Cleaner Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.clientName}</td>
                <td className="border px-4 py-2">{booking.location}</td>
                <td className="border px-4 py-2">₦{booking.budget}</td>
                <td className="border px-4 py-2">{booking.cleanerName}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="text-blue-500 mr-2"
                  >
                    <FaEye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
            <p><strong>Services:</strong> {selectedBooking.services}</p>
            <p><strong>Location:</strong> {selectedBooking.location}</p>
            <p><strong>Budget:</strong> ₦{selectedBooking.budget}</p>
            <p><strong>Number of Rooms:</strong> {selectedBooking.num_rooms}</p>
            <p><strong>Building Type:</strong> {selectedBooking.building_type}</p>
            <p><strong>Building Condition:</strong> {selectedBooking.building_condition}</p>
            <p><strong>Has Water:</strong> {selectedBooking.has_water ? 'Yes' : 'No'}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Special Request:</strong> {selectedBooking.special_request}</p>
            <p><strong>Final Quote:</strong> ₦{selectedBooking.final_quote}</p>
            <p><strong>Client Approval:</strong> {selectedBooking.client_approval ? 'Approved' : 'Pending'}</p>
            <p><strong>Created At:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(selectedBooking.updated_at).toLocaleString()}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsDashboard;
