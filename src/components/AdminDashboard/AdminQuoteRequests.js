import React, { useCallback, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
//import AdminGuestBooking from '../AdminDashboard/AdminGuestBooking'
//import ManageBids from '../BookingsProcess/ManageBids'

 
const AdminQuoteRequests = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [bidAmounts, setBidAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false); // Admin view toggle

  const fetchQuoteRequests = useCallback(async () => {
    setLoading(true);

    try {
      const { data: allQuoteRequests, error: quoteError } = await supabase
        .from('guest_cleaners_bookings')
        .select('*');

      if (quoteError) throw quoteError;

      const { data: allBids, error: bidError } = await supabase
        .from('guest_bids')
        .select('*');

      if (bidError) throw bidError;

      // Map bids to their respective quote requests
      const updatedQuoteRequests = allQuoteRequests.map((quoteRequest) => {
        const bid = allBids.find((bid) => bid.id === quoteRequest.id);
        return { ...quoteRequest, bidStatus: bid ? bid.status : 'Pending' };
      });

      setQuoteRequests(updatedQuoteRequests);
    } catch (err) {
      console.error('Error fetching quote requests:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuoteRequests(); // Fetch quote requests on component mount
  }, [fetchQuoteRequests]);

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
          bid_amount: bidAmount,
          status: 'Pending',
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
     
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 mt-4 p-4">Available Guests Quotes Requests</h2>
      <div className="mb-4">
        <button
          onClick={() => setIsAdminView(!isAdminView)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {isAdminView ? 'Switch to Cleaner View' : 'Switch to Admin View'}
        </button>
      </div>

      <div>
        {quoteRequests.length > 0 ? (
          quoteRequests.map((quoteRequest) => (
            <div key={quoteRequest.id} className="mb-4 p-4 border border-gray-300 rounded">
              <p><strong>Location:</strong> {quoteRequest.location}</p>
              <p><strong>Service Type:</strong> {quoteRequest.service_type}</p>
              <p><strong>Description:</strong> {quoteRequest.description}</p>
              <p><strong>Budget Range:</strong> ₦{quoteRequest.budget_range}</p>
              <p><strong>Bid Status:</strong> {quoteRequest.bidStatus}</p>

              {!isAdminView && (
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
              )}
            </div>
          ))
        ) : (
          <p>No open quote requests available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminQuoteRequests