import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const CleanerBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cleanerEmail = localStorage.getItem('cleaner_email');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!cleanerEmail) {
        toast.error('Cleaner email not found.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch cleaner ID using the email
        const { data: cleanerData, error: cleanerError } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', cleanerEmail)
          .single();

        if (cleanerError) {
          toast.error('Failed to fetch cleaner profile.');
          console.error(cleanerError);
          setLoading(false);
          return;
        }

        const cleanerId = cleanerData.id;

        // Fetch bookings where service_provider_id matches cleanerId
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('guest_bookings')
          .select('*')
          .eq('service_provider_id', cleanerId)
          .order('created_at', { ascending: false });

        if (bookingsError) {
          toast.error('Failed to fetch bookings.');
          console.error(bookingsError);
          setLoading(false);
          return;
        }

        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An error occurred while fetching data.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [cleanerEmail]);

  const handleAccept = async (id) => {
    try {
      const { error } = await supabase
        .from('guest_bookings')
        .update({ status: 'Accepted' })
        .eq('id', id); // Correct column used: 'id'
  
      if (error) {
        toast.error('Failed to accept booking.');
        return;
      }
  
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: 'Accepted' } : booking
        )
      );
      toast.success('Booking accepted successfully.');
    } catch (error) {
      console.error('Error accepting the booking:', error);
      toast.error('An error occurred while accepting the booking.');
    }
  };
  
  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('guest_bookings')
        .update({ status: 'Rejected' })
        .eq('id', id); // Correct column used: 'id'
  
      if (error) {
        toast.error('Failed to reject booking.');
        return;
      }
  
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: 'Rejected' } : booking
        )
      );
      toast.success('Booking rejected successfully.');
    } catch (error) {
      console.error('Error rejecting the booking:', error);
      toast.error('An error occurred while rejecting the booking.');
    }
  };
  
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 mt-16">
      <h2 className="text-2xl font-semibold text-center mb-6 text-green-600">Your Guest Booking Request</h2>
      <h1 className="text-base text-left text-gray-600 mb-4">Here you get notified of direct cleaning booking from a guest on the website you have access to view the details and accept or reject the booking</h1>
       
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Full Name</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">Location</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id} className="border-b">
              <td className="border p-2">{booking.full_name}</td>
              <td className="border p-2">{booking.phone_number}</td>
              <td className="border p-2">{booking.location}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="px-4 py-1 bg-green-500 text-white rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && selectedBooking && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
      <div className="space-y-2">
        <p><strong>Service:</strong> {selectedBooking.services}</p>
        <p><strong>Number of Rooms:</strong> {selectedBooking.num_rooms}</p>
        <p><strong>Special Request:</strong> {selectedBooking.special_request}</p>
        <p><strong>Budget:</strong> {selectedBooking.budget}</p>
        <p><strong>Building Type:</strong> {selectedBooking.building_type}</p>
        <p><strong>Building Condition:</strong> {selectedBooking.building_condition}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span
            className={`font-semibold ${
              selectedBooking.status === 'Accepted'
                ? 'text-green-600'
                : selectedBooking.status === 'Rejected'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {selectedBooking.status}
          </span>
        </p>
        <p><strong>Booking Date:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 justify-between">
        <button
          onClick={() => handleAccept(selectedBooking.id)}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => handleReject(selectedBooking.id)}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reject
        </button>
        <button
          onClick={closeModal}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

export default CleanerBookingDetails;
