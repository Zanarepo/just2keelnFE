import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const AdminBids = () => {
  const [bids, setBids] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({}); // To track bid amounts for updates
  const [selectedBid, setSelectedBid] = useState(null);
  const [newBidAmount, setNewBidAmount] = useState(''); // To add a new bid
  const [loading, setLoading] = useState(false);

  const fetchBids = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select(
          'id, approved_amount, client_id, status, cleaners_main_profiles(id, full_name, address, phone_number, profile_picture_url)'
        );
      
      if (error) throw error;
      setBids(data);
    } catch (err) {
      console.error('Error fetching bids:', err.message);
      toast.error('Error fetching bids.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteBid = async (bidId) => {
    try {
      const confirmDelete = toast.success('Are you sure you want to delete this bid?');
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('quote_requests')
        .delete()
        .eq('id', bidId);

      if (error) throw error;

      setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      toast.success('Bid deleted successfully.');
    } catch (err) {
      console.error('Error deleting bid:', err.message);
      toast.error('Error deleting bid.');
    }
  };

  const handleUpdateBid = async (bidId) => {
    try {
      const bidAmount = bidAmounts[bidId];
      if (!bidAmount) {
        toast.error('Please enter a bid amount.');
        return;
      }

      const { error } = await supabase
        .from('quote_requests')
        .update({ approved_amount: bidAmount, status: 'approved' })
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Bid updated successfully.');
      setBidAmounts((prev) => ({ ...prev, [bidId]: '' }));
      fetchBids();
    } catch (err) {
      console.error('Error updating bid:', err.message);
      toast.error('Error updating bid.');
    }
  };

  const handleNewBidSubmit = async (clientId) => {
    try {
      if (!newBidAmount) {
        toast.error('Please enter a new bid amount.');
        return;
      }

      const { error } = await supabase
        .from('quote_requests')
        .insert({
          client_id: clientId,
          approved_amount: newBidAmount,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('New bid created successfully.');
      setNewBidAmount('');
      fetchBids();
    } catch (err) {
      console.error('Error creating new bid:', err.message);
      toast.error('Error creating new bid.');
    }
  };

  const handleViewDetails = async (bid) => {
    setSelectedBid(bid);
  };

  const handleCloseModal = () => {
    setSelectedBid(null);
  };

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  if (loading) {
    return <div>Loading bids...</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Admin View - Bids from All Cleaners</h2>

      <h1 className="text-base text-left text-gray-600 mb-4">You can view and manage all bids submitted by cleaners.</h1>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Create New Bid</h3>
        <input
          type="number"
          placeholder="Enter new bid amount"
          value={newBidAmount}
          onChange={(e) => setNewBidAmount(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
        />
        <button
          onClick={() => handleNewBidSubmit(selectedBid?.client_id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Submit New Bid
        </button>
      </div>

      {bids.length > 0 ? (
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
            {bids.map((bid) => (
              <tr key={bid.id} className={bid.id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-2">{bid.cleaners_main_profiles?.full_name || 'N/A'}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={bidAmounts[bid.id] || bid.approved_amount}
                    onChange={(e) => setBidAmounts((prev) => ({ ...prev, [bid.id]: e.target.value }))}
                    className="border border-gray-300 p-2 rounded mr-2"
                  />
                </td>
                <td className="border border-gray-300 p-2">{bid.status}</td>
                <td className="border border-gray-300 p-2 flex gap-4 justify-center">
                  <button
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                    onClick={() => handleViewDetails(bid)}
                  >
                    View Details
                  </button>
                  <button
                    className="text-yellow-600 cursor-pointer hover:text-yellow-800"
                    onClick={() => handleUpdateBid(bid.id)}
                  >
                    Update Bid
                  </button>
                  <button
                    className="text-red-600 cursor-pointer hover:text-red-800"
                    onClick={() => handleDeleteBid(bid.id)}
                  >
                    Delete
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
            <p><strong>Client Name:</strong> {selectedBid.cleaners_main_profiles?.full_name || 'N/A'}</p>
            <p><strong>Client Address:</strong> {selectedBid.cleaners_main_profiles?.address || 'N/A'}</p>
            <p><strong>Client Phone:</strong> {selectedBid.cleaners_main_profiles?.phone_number || 'N/A'}</p>
            <p><strong>Status:</strong> {selectedBid.status}</p>
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

export default AdminBids;
