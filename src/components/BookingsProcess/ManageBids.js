import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BidManagement = () => {
  const [bids, setBids] = useState([]);
  const [selectedBids, setSelectedBids] = useState([]); // For selecting multiple bids for deletion
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedBid, setSelectedBid] = useState(null); // Store selected bid for actions

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const { data, error } = await supabase
          .from('guest_quote_request')
          .select('id, cleaner_id, cleaners_bid_amount, status, full_name, phone_number, cleaner:cleaners_main_profiles(id, full_name)')
          .not('cleaners_bid_amount', 'is', null); // Filter where cleaners_bid_amount is not NULL

        if (error) throw error;

        if (data && data.length > 0) {
          setBids(data);
        } else {
          toast.info('No bids found.');
        }
      } catch (err) {
        console.error('Error fetching bids:', err);
        toast.error('Failed to load bids.');
      }
    };

    fetchBids();
  }, []);

  const handleAcceptBid = async (bidId, bidAmount) => {
    try {
      const { error } = await supabase
        .from('guest_quote_request')
        .update({ approved_amount: bidAmount, status: 'accepted' })
        .eq('id', bidId);

      if (error) throw error;
      toast.success('Bid accepted successfully!');
      setBids(bids.map(bid => (bid.id === bidId ? { ...bid, status: 'accepted', approved_amount: bidAmount } : bid)));
      setShowModal(false); // Close modal after accepting
    } catch (err) {
      console.error('Error accepting bid:', err);
      toast.error('Failed to accept bid.');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      const { error } = await supabase
        .from('guest_quote_request')
        .update({ status: 'rejected' })
        .eq('id', bidId);

      if (error) throw error;
      toast.success('Bid rejected.');
      setBids(bids.filter(bid => bid.id !== bidId));
      setShowModal(false); // Close modal after rejecting
    } catch (err) {
      console.error('Error rejecting bid:', err);
      toast.error('Failed to reject bid.');
    }
  };

  const handleDeleteBids = async () => {
    try {
      const { error } = await supabase
        .from('guest_quote_request')
        .delete()
        .in('id', selectedBids);

      if (error) throw error;
      toast.success('Selected bids deleted.');
      setBids(bids.filter(bid => !selectedBids.includes(bid.id)));
      setSelectedBids([]);
    } catch (err) {
      console.error('Error deleting bids:', err);
      toast.error('Failed to delete bids.');
    }
  };

  const toggleBidSelection = (bidId) => {
    setSelectedBids((prevSelectedBids) =>
      prevSelectedBids.includes(bidId)
        ? prevSelectedBids.filter((id) => id !== bidId)
        : [...prevSelectedBids, bidId]
    );
  };

  const openModal = (bid) => {
    setSelectedBid(bid); // Set selected bid for modal actions
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
    setSelectedBid(null); // Clear selected bid
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-lg sm:text-xl font-bold text-center text-green-600 p-4">Guests Bids Management</h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={handleDeleteBids}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Delete Selected Bids
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
          <tr className="bg-green-200 text-sm text-gray-600">
              <th className="border border-gray-300 p-2 text-left">Select</th>
        
              <th className="border border-gray-300 p-2 text-left">Bid Amount</th>
       
    
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.length > 0 ? (
              bids.map((bid) => (
                <tr key={bid.id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">
                    <input
                      type="checkbox"
                      checked={selectedBids.includes(bid.id)}
                      onChange={() => toggleBidSelection(bid.id)}
                      className="form-checkbox"
                    />
                  </td>
                  
                  <td className="border border-gray-300 p-2">{bid.cleaners_bid_amount}</td>
              
              
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => openModal(bid)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No bids available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     {/* Modal */}
{showModal && selectedBid && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-md w-full sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <h2 className="text-xl font-semibold mb-4">Bid Details</h2>
      <p><strong>Bid Amount:</strong> {selectedBid.cleaners_bid_amount}</p>
      <p><strong>Status:</strong> {selectedBid.status}</p>
      <p><strong>Cleaner Name:</strong> {selectedBid.cleaner ? selectedBid.cleaner.full_name : 'No Cleaner Found'}</p>
      <p><strong>Phone Number:</strong> {selectedBid.phone_number}</p>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handleAcceptBid(selectedBid.id, selectedBid.cleaners_bid_amount)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={() => handleRejectBid(selectedBid.id)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>

      <button
        onClick={closeModal}
        className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-500"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default BidManagement;
