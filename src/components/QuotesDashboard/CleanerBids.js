import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const CleanerBids = () => {
  const [cleanerBids, setCleanerBids] = useState([]);
  const [cleanerEmail] = useState(localStorage.getItem('cleaner_email')); // Get email from localStorage
  const [selectedBid, setSelectedBid] = useState(null); // State for selected bid details

  const fetchCleanerBids = useCallback(async () => {
    try {
      // Fetch cleaner ID using email from localStorage
      const { data: cleanerData, error: cleanerError } = await supabase
        .from('cleaners_main_profiles')
        .select('id')
        .eq('email', cleanerEmail)
        .single();

      if (cleanerError) throw cleanerError;
      const cleanerId = cleanerData?.id;

      if (!cleanerId) {
        toast.error('Cleaner ID not found.');
        return;
      }

      // Fetch all bids submitted by the cleaner
      const { data: cleanerBidsData, error: cleanerBidsError } = await supabase
        .from('quote_requests')
        .select(
          'id, approved_amount, client_id, status, cleaners_main_profiles(full_name, address, phone_number, profile_picture_url)'
        )
        .eq('approved_cleaner_id', cleanerId) // Filter by cleaner's ID
        .neq('status', 'pending'); // Filter bids with status other than 'pending'

      if (cleanerBidsError) throw cleanerBidsError;

      setCleanerBids(cleanerBidsData);
    } catch (err) {
      console.error('Error fetching cleaner bids:', err.message);
      toast.error('Error fetching bids.');
    }
  }, [cleanerEmail]);

  const fetchClientDetails = async (clientId) => {
    try {
      // Fetch client details based on client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients_main_profiles')
        .select('full_name, address, phone_number, state_of_residence, lga_of_residence')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;

      return clientData;
    } catch (err) {
      console.error('Error fetching client details:', err.message);
      toast.error('Error fetching client details.');
      return null;
    }
  };

  const handleDeleteBid = async (bidId) => {
    try {
      // Confirm the deletion action
      const confirmDelete = window.confirm('Are you sure you want to delete this bid?');
      if (!confirmDelete) return;
  
      // Delete the bid from the 'quote_requests' table
      const {  error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', bidId);
  
      if (error) throw error;
  
      // If successful, update the state to remove the deleted bid
      setCleanerBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
  
      toast.success('Bid deleted successfully.');
    } catch (err) {
      console.error('Error deleting bid:', err.message);
      toast.error('Error deleting bid.');
    }
  };
  
  const handleViewDetails = async (bid) => {
    // Fetch client details when the "View Details" button is clicked
    const clientDetails = await fetchClientDetails(bid.client_id);
    if (clientDetails) {
      setSelectedBid({ ...bid, clientDetails });
    }
  };

  const handleCloseModal = () => {
    setSelectedBid(null);
  };

  useEffect(() => {
    if (cleanerEmail) {
      fetchCleanerBids();
    } else {
      toast.error('Cleaner email not found.');
    }
  }, [cleanerEmail, fetchCleanerBids]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Cleaner Bids</h2>

      <h1 className="text-base text-left text-gray-600 mb-4">These section deals with bids from a registered client, you get to see all the bids you have won and ready for execution</h1>

      {cleanerBids.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-green-100">
            <tr>
              <th className="border border-gray-300 p-2">Client</th>
              <th className="border border-gray-300 p-2">Approved Amount</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cleanerBids.map((bid, index) => (
              <tr key={bid.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-2">{bid.cleaners_main_profiles.full_name}</td>
                <td className="border border-gray-300 p-2">₦{bid.approved_amount}</td>
                <td className="border border-gray-300 p-2">{bid.status}</td>
                <td className="border border-gray-300 p-2 flex gap-4 justify-center">
                  <button
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    title="View Details"
                    onClick={() => handleViewDetails(bid)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No bids available.</p>
      )}

      {selectedBid && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-green-600 mb-4">Bid Details</h3>
            <p><strong>Client Name:</strong> {selectedBid.clientDetails?.full_name}</p>
            <p><strong> State of Residence:</strong> {selectedBid.clientDetails?.state_of_residence}</p>
            <p><strong>LGA of  Residence:</strong> {selectedBid.clientDetails?.lga_of_residence}</p>
            <p><strong>Client Address:</strong> {selectedBid.clientDetails?.address}</p>
            <p><strong>Client Phone:</strong> {selectedBid.clientDetails?.phone_number}</p>
            <div className="flex gap-4 justify-center mt-4">
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CleanerBids;
