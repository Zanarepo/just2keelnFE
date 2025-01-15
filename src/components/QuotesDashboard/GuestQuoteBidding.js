import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GuestQuoteRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [bids, setBids] = useState({}); // To store bid amounts for each quote
  const [approvedBids, setApprovedBids] = useState([]); // To store approved bids
  const [view, setView] = useState('bids'); // Toggle between views ('bids' or 'approved')

  const fetchCleanerId = useCallback(async () => {
    const cleanerEmail = localStorage.getItem('email');
    if (!cleanerEmail) {
      toast.warn('Cleaner email not found.');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id')
        .eq('email', cleanerEmail)
        .single(); // Assuming email is unique, so we can fetch a single result

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error fetching cleaner ID:', err);
      toast.error('Failed to fetch cleaner ID.');
      return null;
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    const cleanerId = await fetchCleanerId();
    if (!cleanerId) return;

    try {
      const { data, error } = await supabase
        .from('guest_quote_request')
        .select('*')
        .is('cleaner_id', null); // Only show quotes without a cleaner assigned

      if (error) throw error;
      setQuotes(data);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      toast.error('Failed to load quotes.');
    }
  }, [fetchCleanerId]);

  const fetchApprovedBids = useCallback(async () => {
    const cleanerId = await fetchCleanerId();
    if (!cleanerId) return;

    try {
      const { data, error } = await supabase
        .from('guest_quote_request')
        .select('*')
        .eq('cleaner_id', cleanerId)
        .not('approved_amount', 'is', null); // Only approved bids

      if (error) throw error;
      setApprovedBids(data);
    } catch (err) {
      console.error('Error fetching approved bids:', err);
      toast.error('Failed to load approved bids.');
    }
  }, [fetchCleanerId]);

  const handleBidSubmit = async (quoteId) => {
    const bidAmount = bids[quoteId];
    const cleanerId = await fetchCleanerId();

    if (!bidAmount) {
      toast.warn('Please enter a bid amount.');
      return;
    }

    try {
      const { error } = await supabase
        .from('guest_quote_request')
        .update({ cleaner_id: cleanerId, cleaners_bid_amount: bidAmount })
        .eq('id', quoteId);

      if (error) throw error;
      toast.success('Bid submitted successfully!');
      fetchQuotes(); // Refresh the list after submitting the bid
    } catch (err) {
      console.error('Error submitting bid:', err);
      toast.error('Failed to submit bid.');
    }
  };

  useEffect(() => {
    if (view === 'bids') fetchQuotes();
    else if (view === 'approved') fetchApprovedBids();
  }, [view, fetchQuotes, fetchApprovedBids]);

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Guest Quote Requests</h1>
        <div>
          <button
            onClick={() => setView('bids')}
            className={`px-4 py-2 mr-2 rounded ${view === 'bids' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Bids
          </button>
          <button
            onClick={() => setView('approved')}
            className={`px-4 py-2 rounded ${view === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Approved Bids
          </button>
        </div>
      </div>

      {view === 'bids' && (
        quotes.length === 0 ? (
          <p className="text-gray-500">No available quotes for bidding.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Full Name</th>
                <th className="border border-gray-300 p-2">Service Type</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Budget Range</th>
                <th className="border border-gray-300 p-2">Bid Amount</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border border-gray-300">
                  <td className="p-2">{quote.full_name}</td>
                  <td className="p-2">{quote.service_type}</td>
                  <td className="p-2">{quote.location}</td>
                  <td className="p-2">{quote.budget_range}</td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={bids[quote.id] || ''}
                      onChange={(e) => setBids((prev) => ({ ...prev, [quote.id]: e.target.value }))}
                      className="border border-gray-300 p-1 rounded w-full"
                      placeholder="Enter your bid"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleBidSubmit(quote.id)}
                    >
                      Submit Bid
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {view === 'approved' && (
        approvedBids.length === 0 ? (
          <p className="text-gray-500">No approved bids available.</p>
        ) : (
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">Full Name</th>
                <th className="border border-gray-300 p-2">Service Type</th>
                <th className="border border-gray-300 p-2">Location</th>
                <th className="border border-gray-300 p-2">Budget Range</th>
                <th className="border border-gray-300 p-2">Approved Amount</th>
              </tr>
            </thead>
            <tbody>
              {approvedBids.map((bid) => (
                <tr key={bid.id} className="border border-gray-300">
                  <td className="p-2">{bid.full_name}</td>
                  <td className="p-2">{bid.service_type}</td>
                  <td className="p-2">{bid.location}</td>
                  <td className="p-2">{bid.budget_range}</td>
                  <td className="p-2">{bid.approved_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default GuestQuoteRequests;
