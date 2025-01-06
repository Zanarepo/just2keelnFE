import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const SubmitBid = ({ quoteRequestId, bidId, onBidRemoved }) => {
  const [bidAmount, setBidAmount] = useState(''); // Local state for each form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cleanerId, setCleanerId] = useState(localStorage.getItem('cleaner_id') || '');

  useEffect(() => {
    const fetchCleanerId = async () => {
      if (cleanerId) return;

      const cleanerEmail = localStorage.getItem('cleaner_email');
      if (!cleanerEmail) {
        toast.error('Cleaner email not found.');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', cleanerEmail)
          .single();

        if (error) throw error;

        localStorage.setItem('cleaner_id', data.id);
        setCleanerId(data.id);
      } catch (err) {
        console.error('Error fetching cleaner ID:', err.message);
        toast.error('Failed to retrieve cleaner ID.');
      }
    };

    fetchCleanerId();
  }, [cleanerId]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!bidAmount) {
      toast.error('Please enter a bid amount.');
      return;
    }

    if (!cleanerId) {
      toast.error('Cleaner ID not found.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bids')
        .upsert([
          {
            id: bidId || undefined,  // If bidId exists, update the existing bid, otherwise create a new one
            quote_request_id: quoteRequestId,
            cleaner_id: cleanerId,
            bid_amount: bidAmount,
          },
        ]);

      if (error) throw error;

      toast.success('Bid submitted successfully!');
      setBidAmount(''); // Clear the input after successful submission
    } catch (err) {
      toast.error('Error submitting bid.');
      console.error('Error submitting bid:', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveBid = async () => {
    if (!bidId) {
      toast.error('No bid ID found.');
      return;
    }

    try {
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', bidId);

      if (error) throw error;

      toast.success('Bid removed successfully!');
      onBidRemoved(); // Notify the parent to refresh the bid list
    } catch (err) {
      toast.error('Error removing bid.');
      console.error('Error removing bid:', err.message);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded mb-4">
      <h3 className="text-lg font-bold mb-2">Submit Your Bid</h3>
      <form onSubmit={handleBidSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Bid Amount</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          Submit Bid
        </button>
      </form>

      {bidId && (
        <button
          onClick={handleRemoveBid}
          className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Remove Bid
        </button>
      )}
    </div>
  );
};

export default SubmitBid;
