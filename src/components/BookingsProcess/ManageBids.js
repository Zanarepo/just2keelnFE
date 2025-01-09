import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ManageBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('guest_bids')
        .select('id, bid_amount, cleaners_id, status, approved_amount')
        .eq('status', 'Pending'); // Only retrieve pending bids

      if (error) throw error;

      setBids(data);
    } catch (err) {
      console.error('Error fetching bids:', err.message);
      toast.error('Error fetching bids.');
    } finally {
      setLoading(false);
    }
  };
  const handleAcceptBid = async (bidId, bidAmount) => {
    console.log('Received bidId:', bidId);
    console.log('Received bidAmount:', bidAmount);
  
    if (!bidId || !bidAmount) {
      toast.error('Invalid bid details');
      return;
    }
  
    try {
      // Step 1: Update the bid status to 'Accepted' and set the approved_amount in the guest_bids table
      const { data: bidData, error: bidError } = await supabase
        .from('guest_bids')
        .update({
          status: 'Accepted',         // Mark the bid as accepted
          approved_amount: bidAmount, // Store the approved amount
        })
        .eq('id', bidId)            // Update the bid by its ID
        .select(); // Ensure the query returns the updated data
  
      if (bidError) throw bidError;
  
      // Check if bidData is returned properly
      if (bidData && bidData.length > 0) {
        // No need to use 'cleaner_id' if not required anymore
        toast.success('Bid accepted successfully!');
        fetchBids(); // Reload the bids after acceptance (if needed)
      } else {
        toast.error('No bid found with the given ID.');
      }
    } catch (err) {
      console.error('Error accepting bid:', err.message);
      toast.error('Error accepting bid.');
    }
  };
  
  



  const handleRejectBid = async (bidId) => {
    try {
      // Update the bid status to 'Rejected' in the guest_bids table
      const { error } = await supabase
        .from('guest_bids')
        .update({ status: 'Rejected', approved_amount: null }) // Clear approved_amount when rejected
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Bid rejected successfully!');
      fetchBids(); // Reload bids after rejection
    } catch (err) {
      console.error('Error rejecting bid:', err.message);
      toast.error('Error rejecting bid.');
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  if (loading) return <div>Loading bids...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Pending Bids</h2>

      <div>
        {bids.length > 0 ? (
          bids.map((bid) => (
            <div key={bid.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>Bid Amount:</strong> ₦{bid.bid_amount}</p>
              <p><strong>Status:</strong> {bid.status}</p>

              <div className="mt-2">
                <button
                  onClick={() => handleAcceptBid(bid.id, bid.bid_amount, bid.guest_quote_request_id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept Bid
                </button>
                <button
                  onClick={() => handleRejectBid(bid.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                >
                  Reject Bid
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending bids.</p>
        )}
      </div>
    </div>
  );
};

export default ManageBids;
