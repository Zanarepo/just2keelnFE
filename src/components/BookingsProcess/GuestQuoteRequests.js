import React, { useCallback, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const CleanerQuoteRequests = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const cleanerEmail = localStorage.getItem('cleaner_email');
  const [cleanerId, setCleanerId] = useState(null);

  const fetchCleanerId = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id')
        .eq('email', cleanerEmail)
        .single();

      if (error) throw error;
      setCleanerId(data.id); // Store the ID in state for caching
    } catch (err) {
      console.error('Error fetching cleaner ID:', err.message);
    }
  }, [cleanerEmail]);

  const fetchQuoteRequests = useCallback(async () => {
    if (!cleanerId) return; // Don't proceed if cleanerId is not available
    setLoading(true);

    try {
      const { data: allQuoteRequests, error: quoteError } = await supabase
        .from('guest_quote_request')
        .select('*');

      if (quoteError) throw quoteError;

      const { data: cleanerBids, error: bidError } = await supabase
        .from('guest_bids')
        .select('id, status')
        .eq('cleaners_id', cleanerId);

      if (bidError) throw bidError;

      const submittedQuoteRequestIds = cleanerBids.map((bid) => bid.id);
      const availableQuoteRequests = allQuoteRequests.filter(
        (quoteRequest) => !submittedQuoteRequestIds.includes(quoteRequest.id)
      );

      // Add the status of each bid to the available quote requests
      const updatedQuoteRequests = availableQuoteRequests.map((quoteRequest) => {
        const bid = cleanerBids.find(bid => bid.id === quoteRequest.id);
        return { ...quoteRequest, bidStatus: bid ? bid.status : 'Pending' }; // Default bid status is 'Pending'
      });

      setQuoteRequests(updatedQuoteRequests);
    } catch (err) {
      console.error('Error fetching quote requests:', err.message);
    } finally {
      setLoading(false);
    }
  }, [cleanerId]);

  useEffect(() => {
    if (cleanerEmail && !cleanerId) {
      fetchCleanerId(); // Fetch cleaner ID on component mount
    }
  }, [cleanerEmail, cleanerId, fetchCleanerId]);

  useEffect(() => {
    if (cleanerId) {
      fetchQuoteRequests(); // Fetch quote requests once cleaner ID is available
    }
  }, [cleanerId, fetchQuoteRequests]);

  const handleBidSubmit = async (quoteRequestId) => {
    try {
      const bidAmount = bidAmounts[quoteRequestId];
      if (!bidAmount) {
        toast.error('Please enter a bid amount.');
        return;
      }

      const { error } = await supabase
        .from('guest_bids')
        .insert({
          id: quoteRequestId,
          cleaners_id: cleanerId,
          bid_amount: bidAmount,
          status: 'Pending', // Default bid status is 'Pending'
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

  const handleInputChange = (quoteRequestId, value) => {
    setBidAmounts((prev) => ({ ...prev, [quoteRequestId]: value }));
  };

  if (loading) {
    return <div>Loading quote requests...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Available Quote Requests</h2>
      <p className="text-base text-left text-gray-600 mb-4">Here you get notified of quotes tendering requeted by a guest from the webapp, you can decide to submit your bid or not.</p>
        
      <div>
        {quoteRequests.length > 0 ? (
          quoteRequests.map((quoteRequest) => (
            <div key={quoteRequest.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>Location:</strong> {quoteRequest.location}</p>
              <p><strong>Service Type:</strong> {quoteRequest.service_type}</p>
              <p><strong>Description:</strong> {quoteRequest.description}</p>
              <p><strong>Budget Range:</strong> ₦{quoteRequest.budget_range}</p>
              <p><strong>Bid Status:</strong> {quoteRequest.bidStatus}</p> {/* Display bid status */}

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
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Submit Bid
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No open quote requests available.</p>
        )}
      </div>
    </div>
  );
};

export default CleanerQuoteRequests;
