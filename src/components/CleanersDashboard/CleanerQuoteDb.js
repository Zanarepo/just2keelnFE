import React, { useCallback, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const CleanerDashboard = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const cleanerEmail = localStorage.getItem('cleaner_email');

  const fetchCleanerId = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id')
        .eq('email', cleanerEmail)
        .single();
  
      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error fetching cleaner ID:', err.message);
      return null;
    }
  }, [cleanerEmail]);
  
  const fetchQuoteRequests = useCallback(async () => {
    try {
      const cleanerId = await fetchCleanerId();
      if (!cleanerId) return;
  
      const { data: allQuoteRequests, error: quoteError } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('status', 'open');
  
      if (quoteError) throw quoteError;
  
      const { data: cleanerBids, error: bidError } = await supabase
        .from('bids')
        .select('quote_request_id')
        .eq('cleaner_id', cleanerId);
  
      if (bidError) throw bidError;
  
      const submittedQuoteRequestIds = cleanerBids.map((bid) => bid.quote_request_id);
      const availableQuoteRequests = allQuoteRequests.filter(
        (quoteRequest) => !submittedQuoteRequestIds.includes(quoteRequest.id)
      );
  
      setQuoteRequests(availableQuoteRequests);
    } catch (err) {
      console.error('Error fetching quote requests:', err.message);
    }
  }, [fetchCleanerId]);
  
  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);
  
  const handleBidSubmit = async (quoteRequestId) => {
    try {
      const cleanerId = await fetchCleanerId();
      if (!cleanerId) return;

      const bidAmount = bidAmounts[quoteRequestId];
      if (!bidAmount) {
        toast.error('Please enter a bid amount.');
        return;
      }

      const { error } = await supabase
        .from('bids')
        .insert({
          quote_request_id: quoteRequestId,
          cleaner_id: cleanerId,
          bid_amount: bidAmount,
        });

      if (error) throw error;

      toast.success('Bid submitted successfully!');
      setBidAmounts((prev) => ({ ...prev, [quoteRequestId]: '' }));
      fetchQuoteRequests();
    } catch (err) {
      toast.error('Error submitting bid.');
      console.error('Error submitting bid:', err.message);
    }
  };

  const handleBidDelete = async (quoteRequestId) => {
    try {
      const cleanerId = await fetchCleanerId();
      if (!cleanerId) return;

      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('quote_request_id', quoteRequestId)
        .eq('cleaner_id', cleanerId);

      if (error) throw error;

      toast.success('Bid deleted successfully!');
      fetchQuoteRequests();
    } catch (err) {
      toast.error('Error deleting bid.');
      console.error('Error deleting bid:', err.message);
    }
  };

  const handleInputChange = (quoteRequestId, value) => {
    setBidAmounts((prev) => ({ ...prev, [quoteRequestId]: value }));
  };

  useEffect(() => {
    fetchQuoteRequests();
  }, [fetchQuoteRequests]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Available Quote Requests</h2>
      <p className="text-base text-left text-gray-600 mb-4">
  This is where you manage all your Quotes request bidding from a registered client. 
   A client request for cleaners to submit their quote after seeing the details of the quote and the budget for the services, you can decide to bid for it or not. 
</p>
      <div>
        {quoteRequests.map((quoteRequest) => (
          <div key={quoteRequest.id} className="mb-4 p-4 border border-gray-300 rounded">
            <p><strong>Location:</strong> {quoteRequest.location}</p>
            <p><strong>Service Type:</strong> {quoteRequest.service_type}</p>
            <p><strong>Description:</strong> {quoteRequest.description}</p>
            <p><strong>Budget Range:</strong> ₦{quoteRequest.budget_range}</p>

            <div className="mt-2">
              <input
                type="number"
                placeholder="Enter your bid"
                value={bidAmounts[quoteRequest.id] || ''}
                onChange={(e) => handleInputChange(quoteRequest.id, e.target.value)}
                className="border border-gray-300 p-2 rounded mr-2"
              />
              <button
                onClick={() => handleBidSubmit(quoteRequest.id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              >
                Submit Bid
              </button>
              <button
                onClick={() => handleBidDelete(quoteRequest.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Bid
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleanerDashboard;
