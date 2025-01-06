import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Assuming supabase is set up
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed

const CleanerBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null); // To track selected booking for modal
  const [modalOpen, setModalOpen] = useState(false); // For controlling modal visibility

  // Retrieve the cleaner's email from local storage
  const cleanerEmail = localStorage.getItem('cleaner_email');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!cleanerEmail) {
        console.log('Cleaner email is not found in local storage.');
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Step 1: Get the cleaner's service_provider_id using their email
        const { data: cleanerData, error: cleanerError } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', cleanerEmail)
          .single(); // Assuming there's only one cleaner with the given email

        if (cleanerError) {
          console.error('Error fetching cleaner data:', cleanerError);
          setLoading(false);
          return;
        }

        const serviceProviderId = cleanerData.id;

        // Step 2: Fetch bookings for the specific cleaner (service_provider_id)
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*, client_id, services, num_rooms, special_request, created_at')
          .eq('service_provider_id', serviceProviderId);

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
          setLoading(false);
          return;
        }

        // Step 3: Get client details based on client_id in bookings
        const clientIds = bookingsData.map((booking) => booking.client_id);
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients_main_profiles')
          .select('id, full_name, address, state_of_residence, phone_number')
          .in('id', clientIds);

        if (clientsError) {
          console.error('Error fetching client details:', clientsError);
          setLoading(false);
          return;
        }

        setBookings(bookingsData);
        setClients(clientsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [cleanerEmail]); // Run effect when cleanerEmail changes

  const handleAccept = async (bookingId) => {
    console.log('Booking ID:', bookingId);  // Check the value of bookingId
    
    // Ensure bookingId is valid
    if (!bookingId) {
      toast.error('Invalid booking ID');
      return;
    }
  
    try {
      // Update the status to 'Accepted'
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Accepted' })  // Update only the status field
        .eq('booking_id', bookingId);  // Use the correct column for the booking ID
  
      if (error) {
        console.error('Error accepting the booking:', error);
        toast.error('Error accepting the booking!');
        return;
      }
  
      // Update the local state for the bookings to reflect the change
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status: 'Accepted' } : booking
        )
      );
  
      // Notify success
      toast.success('Booking accepted successfully!');
    } catch (error) {
      console.error('Error accepting the booking:', error);
      toast.error('Error accepting the booking!');
    }
  };
  
  const handleReject = async (bookingId) => {
    console.log('Booking ID:', bookingId);  // Check the value of bookingId
  
    // Ensure bookingId is valid
    if (!bookingId) {
      toast.error('Invalid booking ID');
      return;
    }
  
    try {
      // Update the status to 'Rejected'
      const {  error } = await supabase
        .from('bookings')
        .update({ status: 'Rejected' })  // Update only the status field
        .eq('booking_id', bookingId);  // Use the correct column for the booking ID
  
      if (error) {
        console.error('Error rejecting the booking:', error);
        toast.error('Error rejecting the booking!');
        return;
      }
  
      // Update the local state for the bookings to reflect the change
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status: 'Rejected' } : booking
        )
      );
  
      // Notify success
      toast.success('Booking rejected successfully!');
    } catch (error) {
      console.error('Error rejecting the booking:', error);
      toast.error('Error rejecting the booking!');
    }
  };
  

  const getClientDetails = (clientId) => {
    const client = clients.find((client) => client.id === clientId);
    return client ? client : null;
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  const getRowColor = (status) => {
    if (status === 'Accepted') return 'bg-green-100'; // Green for accepted
    if (status === 'Rejected') return 'bg-red-100'; // Red for rejected
    return ''; // Default color for pending or other status
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 mt-16">

      <h2 className="text-2xl font-semibold text-center mb-6 text-green-600">Bookings</h2>
      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Client Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">State of Residence</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((booking) => {
            const clientDetails = getClientDetails(booking.client_id);
            return (
              <tr key={booking.id} className={`border-b ${getRowColor(booking.status)}`}>
                <td className="border p-2">{clientDetails?.full_name}</td>
                <td className="border p-2">{clientDetails?.address}</td>
                <td className="border p-2">{clientDetails?.phone_number}</td>
                <td className="border p-2">{clientDetails?.state_of_residence}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="px-4 py-1 bg-green-500 text-white rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

     {modalOpen && selectedBooking && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-1/2">
      <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
      {/* Display booking details */}
      <div className="space-y-2">
        <p><strong>Booking ID:</strong> {selectedBooking.booking_id}</p>
        <p><strong>Service:</strong> {selectedBooking.services}</p>
        <p><strong>Special Request:</strong> {selectedBooking.special_request}</p>
        <p><strong>Number of Rooms:</strong> {selectedBooking.num_rooms}</p>
        <p><strong>Status:</strong> {selectedBooking.status}</p>
        <p><strong>Location:</strong> {selectedBooking.location}</p>
        <p><strong>Budget:</strong> {selectedBooking.budget}</p>
        <p><strong>Status:</strong> {selectedBooking.status}</p>
        <p><strong>Building Type:</strong> {selectedBooking.building_type}</p>
        <p><strong>Building Condition:</strong> {selectedBooking.building_condition}</p>
      
        
        <p><strong>Booking Date:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
      </div>

      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => handleAccept(selectedBooking.booking_id)} 
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Accept
        </button>
        <button 
          onClick={() => handleReject(selectedBooking.booking_id)} 
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
