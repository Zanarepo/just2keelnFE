// ClientDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaCheck, FaTrash, FaEye } from 'react-icons/fa';

const ClientDashboard = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const clientEmail = localStorage.getItem('email');

  const fetchQuoteRequests = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clients_main_profiles')
        .select('id')
        .eq('email', clientEmail)
        .single();

      if (error) throw error;
      const clientId = data.id;

      if (!clientId) return;

      const { data: quoteRequestsData, error: quoteRequestsError } = await supabase
        .from('quote_requests')
        .select('*, bids(bid_amount, cleaner_id, cleaners_main_profiles(full_name, profile_picture_url, phone_number, address))')
        .eq('client_id', clientId);

      if (quoteRequestsError) throw quoteRequestsError;

      setQuoteRequests(quoteRequestsData);
    } catch (err) {
      console.error('Error fetching quote requests:', err.message);
    }
  }, [clientEmail]);

  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  const handleApproveBid = async (quoteRequestId, cleanerId, bidAmount) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ approved_cleaner_id: cleanerId, approved_amount: bidAmount, status: 'approved' })
        .eq('id', quoteRequestId);

      if (error) throw error;

      toast.success('Cleaner approved successfully!');
      fetchQuoteRequests();
    } catch (err) {
      toast.error('Error approving cleaner.');
      console.error('Error approving cleaner:', err.message);
    }
  };

  const handleDeleteBid = async (quoteRequestId, cleanerId) => {
    try {
      if (!quoteRequestId || !cleanerId) {
        toast.error('Invalid IDs.');
        return;
      }

      const { data, error } = await supabase
        .from('bids')
        .delete()
        .eq('quote_request_id', quoteRequestId)
        .eq('cleaner_id', cleanerId);

      if (error) {
        toast.error('Error deleting bid: ' + error.message);
        console.error('Error deleting bid:', error.message);
        return;
      }

      if (!data || data.length === 0) {
        toast.error('No bid found to delete.');
        return;
      }

      toast.success('Bid deleted successfully!');
      fetchQuoteRequests();
    } catch (err) {
      toast.error('Error deleting bid.');
      console.error('Error deleting bid:', err.message);
    }
  };

  const handleViewDetails = (cleaner) => {
    setSelectedCleaner(cleaner);
    setShowModal(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Your Quote Requests</h2>

      <div>
  {quoteRequests.map((quoteRequest) => (
    <div key={quoteRequest.id} className="mb-6 p-4 border border-gray-300 rounded">
      <p><strong>Location:</strong> {quoteRequest.location}</p>
      <p><strong>Service Type:</strong> {quoteRequest.service_type}</p>
      <p><strong>Description:</strong> {quoteRequest.description}</p>
      <p><strong>Budget Range:</strong> {quoteRequest.budget_range}</p>

      <h3 className="text-lg font-bold mt-4 mb-2">Bids</h3>

      {quoteRequest.bids.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-green-100">
            <tr>
              <th className="border border-gray-300 p-2">Cleaner</th>
              <th className="border border-gray-300 p-2">Bid Amount</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quoteRequest.bids
              .sort((a, b) => a.bid_amount - b.bid_amount) // Sorting bids by amount (ascending)
              .map((bid, index) => (
                <tr
                  key={bid.cleaner_id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} // Alternating row colors
                >
                  <td className="border border-gray-300 p-2">
                    {bid.cleaners_main_profiles.full_name}
                  </td>
                  <td className="border border-gray-300 p-2">₦{bid.bid_amount}</td>
                  <td className="border border-gray-300 p-2 flex gap-4 justify-center">
                    <FaCheck
                      onClick={() => handleApproveBid(quoteRequest.id, bid.cleaner_id, bid.bid_amount)}
                      className={`text-green-600 cursor-pointer ${
                        quoteRequest.status === 'approved' ? 'opacity-50 cursor-not-allowed' : 'hover:text-green-800'
                      }`}
                      title="Approve Bid"
                      disabled={quoteRequest.status === 'approved'}
                    />
                    <FaTrash
                      onClick={() => handleDeleteBid(quoteRequest.id, bid.cleaner_id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete Bid"
                    />
                    <FaEye
                      onClick={() => handleViewDetails(bid.cleaners_main_profiles)}
                      className="text-blue-600 cursor-pointer hover:text-blue-800"
                      title="View Details"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No bids available for this request.</p>
      )}
    </div>
  ))}
</div>


      {/* Modal for viewing cleaner details */}
      {showModal && selectedCleaner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-2">Cleaner Details</h3>
            <img
              src={selectedCleaner.profile_picture_url}
              alt="Cleaner Profile"
              className="w-24 h-24 rounded-full mb-4 mx-auto"
            />
            <p><strong>Full Name:</strong> {selectedCleaner.full_name}</p>
            <p><strong>Location:</strong> {selectedCleaner.address}</p>
            <p><strong>Phone Number:</strong> {selectedCleaner.phone_number}</p>
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

export default ClientDashboard;
