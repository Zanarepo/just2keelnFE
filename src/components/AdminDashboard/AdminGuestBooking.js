import React, { useCallback, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const AdminQuoteRequests = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuoteRequests = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all guest bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('guest_cleaners_bookings')
        .select('*');

      if (bookingsError) throw bookingsError;

      // Fetch cleaner details for each booking
      const cleanerIds = [...new Set(bookings.map((booking) => booking.cleaner_id))];
      const { data: cleaners, error: cleanersError } = await supabase
        .from('cleaners_main_profiles')
        .select('id, full_name, phone_number, address')
        .in('id', cleanerIds);

      if (cleanersError) throw cleanersError;

      // Map cleaner details to corresponding bookings
      const updatedRequests = bookings.map((booking) => {
        const cleaner = cleaners.find((c) => c.id === booking.cleaner_id) || {};
        return { ...booking, cleanerDetails: cleaner };
      });

      setQuoteRequests(updatedRequests);
    } catch (err) {
      console.error('Error fetching quote requests:', err.message);
      toast.error('Failed to fetch quote requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return <div>Loading quote requests...</div>;
  }




  return (
    <div className="w-full p-0">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 mt-4">
        Guest Bookings Requests
      </h2>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Guest Name</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Phone Number</th>
              <th className="p-2 border">Cleaner Name</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {quoteRequests.length > 0 ? (
              quoteRequests.map((request) => (
                <tr key={request.id}>
                  <td className="p-2 border">{request.full_name}</td>
                  <td className="p-2 border">{request.location}</td>
                  <td className="p-2 border">{request.phone_number}</td>
                  <td className="p-2 border">{request.cleanerDetails.full_name || 'N/A'}</td>
                  <td className="p-2 border">{request.status}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="px-4 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No guest bookings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>






      {/* Modal for viewing request details */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
            <h3 className="text-lg font-bold mb-4">Booking Details</h3>
            <p><strong>Guest Name:</strong> {selectedRequest.full_name}</p>
            <p><strong>Location:</strong> {selectedRequest.location}</p>
            <p><strong>Phone Number:</strong> {selectedRequest.phone_number}</p>
            <p><strong>Service Type:</strong> {selectedRequest.service_type}</p>
            <p><strong>Description:</strong> {selectedRequest.description}</p>
            <p><strong>Budget Range:</strong> ₦{selectedRequest.budget_range}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Cleaner Name:</strong> {selectedRequest.cleanerDetails.full_name || 'N/A'}</p>
            <p><strong>Cleaner Phone:</strong> {selectedRequest.cleanerDetails.phone_number || 'N/A'}</p>
            <p><strong>Cleaner Address:</strong> {selectedRequest.cleanerDetails.address || 'N/A'}</p>
            <div className="mt-4 text-right">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

export default AdminQuoteRequests;
