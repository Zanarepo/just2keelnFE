import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import ApprovedCleanerBids from '../QuotesDashboard/ApprovedCleanersBid'




const CleanerClientsBids = () => {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bids, setBids] = useState({});
  const [cleanerId, setCleanerId] = useState(null);

  // Retrieve cleaner ID using email
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      console.error('Cleaner email is not found in localStorage');
      return;
    }

    const fetchCleanerId = async () => {
      try {
        const { data, error } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (error) throw error;
        if (data) setCleanerId(data.id);
      } catch (err) {
        setError('Failed to fetch cleaner ID');
        console.error(err);
      }
    };

    fetchCleanerId();
  }, []);

  // Fetch all client quote requests
  useEffect(() => {
    const fetchQuoteRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('clients_quote_requests')
          .select('*');

        if (error) throw error;
        setQuoteRequests(data);
      } catch (err) {
        setError('Failed to fetch quote requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteRequests();
  }, []);

  // Handle bid input change
  const handleBidChange = (quoteRequestId, amount) => {
    setBids((prevBids) => ({
      ...prevBids,
      [quoteRequestId]: amount,
    }));
  };

  // Handle bid submission
  const handleBidSubmit = async (quoteRequestId) => {
    if (!cleanerId) {
      toast.error('Cleaner ID not found');
      return;
    }

    const bidAmount = bids[quoteRequestId];
    if (!bidAmount) {
      toast.error('Please enter a bid amount');
      return;
    }

    try {
      const { error } = await supabase.from('cleaners_clients_bids').insert([
        {
          quote_request_id: quoteRequestId,
          cleaner_id: cleanerId,
          cleaners_bid_amount: bidAmount,
        },
      ]);

      if (error) throw error;

      toast.success('Bid submitted successfully');
      setBids((prevBids) => ({ ...prevBids, [quoteRequestId]: '' })); // Clear the bid input after submission
    } catch (err) {
      toast.error('Failed to submit bid');
      console.error('Error submitting bid:', err);
    }
  };

  if (loading) return <p>Loading quote requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <ApprovedCleanerBids/>
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">Client Quote Requests</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-green-200 text-sm text-gray-600">
            <th className="border px-4 py-2">Client Name</th>
            <th className="border px-4 py-2">Service Type</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Budget Range</th>
            <th className="border px-4 py-2">Your Bid</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quoteRequests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">{request.full_name}</td>
              <td className="border px-4 py-2">{request.service_type}</td>
              <td className="border px-4 py-2">{request.location}</td>
              <td className="border px-4 py-2">₦{request.budget_range}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  value={bids[request.id] || ''}
                  onChange={(e) => handleBidChange(request.id, e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="Enter bid"
                />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleBidSubmit(request.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit Bid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CleanerClientsBids;
