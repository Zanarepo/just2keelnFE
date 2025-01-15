import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';  // Import toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles

const GuestBookingsComponent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCleanerIdAndBookings = async () => {
      try {
        setLoading(true);

        const { data: cleanerData, error: cleanerError } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', localStorage.getItem('email'))
          .single();

        if (cleanerError) {
          setError('Error fetching cleaner ID');
          console.error(cleanerError);
          return;
        }

        const cleanerId = cleanerData?.id;

        if (!cleanerId) {
          setError('Cleaner ID not found');
          return;
        }

        const { data: bookingsData, error: bookingsError } = await supabase
          .from('guest_cleaners_bookings')
          .select('*')
          .eq('cleaner_id', cleanerId);

        if (bookingsError) {
          setError('Error fetching bookings');
          console.error(bookingsError);
        } else {
          setBookings(bookingsData);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCleanerIdAndBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p>{error}</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleAccept = async () => {
    try {
      await supabase
        .from('guest_cleaners_bookings')
        .update({ status: 'accepted' })
        .eq('id', selectedBooking.id);

      toast.success('Request accepted successfully!');  // Show success toast
      setShowModal(false);
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: 'accepted' } : b))
      );
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request.');  // Show error toast
    }
  };

  const handleReject = async () => {
    try {
      await supabase
        .from('guest_cleaners_bookings')
        .update({ status: 'rejected' })
        .eq('id', selectedBooking.id);

      toast.success('Request rejected successfully!');  // Show success toast
      setShowModal(false);
      setBookings((prev) =>
        prev.map((b) => (b.id === selectedBooking.id ? { ...b, status: 'rejected' } : b))
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request.');  // Show error toast
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-4">My Guests Bookings</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-green-200 text-sm text-gray-600">
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Budget Range</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="border border-gray-300 px-4 py-2">{booking.full_name || 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.location}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.budget_range}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => handleViewDetails(booking)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl sm:max-w-3xl md:max-w-2xl lg:max-w-2xl xl:max-w-2xl relative overflow-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <p><strong>Full Name:</strong> {selectedBooking?.full_name ? selectedBooking.full_name : 'Hidden'}</p>
            <p><strong>Email:</strong> {selectedBooking?.email || 'Hidden'}</p>
            <p><strong>Phone:</strong> {selectedBooking?.phone_number || 'Hidden'}</p>
            <p><strong>Service Type:</strong> {selectedBooking?.service_type}</p>
            <p><strong>Description:</strong> {selectedBooking?.description}</p>
            <p><strong>Budget:</strong> {selectedBooking?.budget_range}</p>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
     
    </div>
  );
};

export default GuestBookingsComponent;
