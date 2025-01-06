import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ApprovedQuoteRequests = () => {
  const [approvedBids, setApprovedBids] = useState([]);
  const [clientEmail] = useState(localStorage.getItem('client_email')); // Get email from localStorage
  const [selectedBid, setSelectedBid] = useState(null); // To store the selected bid for viewing details
  const [showModal, setShowModal] = useState(false); // To control the modal visibility

  const fetchApprovedQuoteRequests = useCallback(async () => {
    try {
      // Fetch client ID using email from localStorage
      const { data: clientData, error: clientError } = await supabase
        .from('clients_main_profiles')
        .select('id')
        .eq('email', clientEmail)
        .single();

      if (clientError) throw clientError;
      const clientId = clientData?.id;

      if (!clientId) {
        toast.error('Client ID not found.');
        return;
      }

      // Fetch quote requests where approved_cleaner_id is NOT null and status is approved
      const { data: approvedQuoteRequestsData, error: approvedQuoteRequestsError } = await supabase
        .from('quote_requests')
        .select(
          'id, approved_amount, approved_cleaner_id, status, cleaners_main_profiles(full_name, address, phone_number, profile_picture_url)'
        )
        .eq('client_id', clientId) // Ensure we're looking at the client's requests
        .eq('status', 'approved') // Filter by approved status
        .not('approved_cleaner_id', 'is', null); // Ensure approved_cleaner_id is not null

      if (approvedQuoteRequestsError) throw approvedQuoteRequestsError;

      setApprovedBids(approvedQuoteRequestsData);
    } catch (err) {
      console.error('Error fetching approved quote requests:', err.message);
      toast.error('Error fetching approved bids.');
    }
  }, [clientEmail]);

  const handleViewDetails = (bid) => {
    setSelectedBid(bid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBid(null);
  };

  const handleDeleteBid = async (bidId) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', bidId);

      if (error) throw error;

      // Remove the deleted bid from the local state
      setApprovedBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));

      toast.success('Quote request deleted successfully.');
    } catch (err) {
      console.error('Error deleting quote request:', err.message);
      toast.error('Error deleting quote request.');
    }
  };

  useEffect(() => {
    if (clientEmail) {
      fetchApprovedQuoteRequests();
    } else {
      toast.error('Client email not found.');
    }
  }, [clientEmail, fetchApprovedQuoteRequests]);

  return (
    <div className="p-5 mt-16"> {/* Added mt-16 to create space below the navbar */}
    <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Approved Quote Requests</h2>
   

      {approvedBids.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-green-100">
            <tr>
              <th className="border border-gray-300 p-2">Cleaner</th>
              <th className="border border-gray-300 p-2">Approved Amount</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedBids.map((bid, index) => (
              <tr key={bid.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-2">{bid.cleaners_main_profiles.full_name}</td>
                <td className="border border-gray-300 p-2">₦{bid.approved_amount}</td>
                <td className="border border-gray-300 p-2 flex gap-4 justify-center">
                  <button
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    title="View Details"
                    onClick={() => handleViewDetails(bid)}
                  >
                    View Details
                  </button>
                  <button
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    title="Delete"
                    onClick={() => handleDeleteBid(bid.id)}
                  >
           {/*          Delete   uncomments when ready  */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No approved bids available.</p>
      )}

      {/* Modal for viewing cleaner details */}
      {showModal && selectedBid && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96">
          <h3 className="text-xl font-bold text-green-600 mb-4 text-center">Cleaner Details</h3>
          <p className="text-center"><strong>Name:</strong> {selectedBid.cleaners_main_profiles.full_name}</p>
          <p className="text-center"><strong>Address:</strong> {selectedBid.cleaners_main_profiles.address}</p>
          <p className="text-center"><strong>Phone:</strong> {selectedBid.cleaners_main_profiles.phone_number}</p>
          <img
            src={selectedBid.cleaners_main_profiles.profile_picture_url}
            alt="Cleaner"
            className="w-32 h-32 object-cover rounded-full my-4 mx-auto" // Center the image horizontally
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => handleDeleteBid(selectedBid.id)}
            >
            
            </button>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default ApprovedQuoteRequests;
