import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const BookingsSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          toast.error('User email not found. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch client_id from clients_main_profiles
        const { data: clientData, error: clientError } = await supabase
          .from('clients_main_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (clientError || !clientData) {
          toast.error('Error fetching client details');
          setLoading(false);
          return;
        }

        const clientId = clientData.id;

        // Fetch bookings for this client
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('booking_id, service_provider_id, services, final_quote, status')
          .eq('client_id', clientId);

        if (bookingsError) {
          toast.error('Error fetching bookings');
          setLoading(false);
          return;
        }

        // Fetch cleaner names for each booking using service_provider_id
        const cleanerPromises = bookingsData.map(async (booking) => {
          const { data: cleanerData, error: cleanerError } = await supabase
            .from('cleaners_main_profiles')
            .select('full_name')
            .eq('id', booking.service_provider_id) // Use service_provider_id to fetch cleaner
            .single();

          if (cleanerError) {
            toast.warn('Error fetching some cleaner details');
            return { ...booking, cleanerName: 'Unknown Cleaner' };
          }

          return { ...booking, cleanerName: cleanerData.full_name };
        });

        const completeBookings = await Promise.all(cleanerPromises);
        setBookings(completeBookings);
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 shadow rounded">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Bookings</h3>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Cleaner</th>
              <th className="border border-gray-300 px-4 py-2">Service Type</th>
              <th className="border border-gray-300 px-4 py-2">Final Quote</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td className="border border-gray-300 px-4 py-2">{booking.cleanerName}</td>
                <td className="border border-gray-300 px-4 py-2">{booking.services}</td>
                <td className="border border-gray-300 px-4 py-2">{booking.final_quote}</td>
                <td className="border border-gray-300 px-4 py-2">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingsSection;
