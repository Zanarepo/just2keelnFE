import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuestBookingsComponent from '../BookingsProcess/GuestBookingsComponent'
const GuestQuoteRequests = () => {
  const [quotes, setQuotes] = useState([]);
  const [bids, setBids] = useState({});
  const [approvedBids, setApprovedBids] = useState([]);
  const [view, setView] = useState('bids');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

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
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      console.error('Error fetching cleaner ID:', err);
      toast.error('Failed to fetch cleaner ID.');
      return null;
    }
  }, []); // Empty dependency array ensures it doesn't change on each render

  const fetchQuotes = useCallback(async () => {
    const cleanerId = await fetchCleanerId();
    if (!cleanerId) return;

    try {
      const { data, error } = await supabase
        .from('guest_quote_request')
        .select('*')
        .is('cleaner_id', null);

      if (error) throw error;
      setQuotes(data);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      toast.error('Failed to load quotes.');
    }
  }, [fetchCleanerId]); // Only recreate fetchQuotes if fetchCleanerId changes

  const fetchApprovedBids = useCallback(async () => {
    const cleanerId = await fetchCleanerId();
    if (!cleanerId) return;

    try {
      const { data, error } = await supabase
        .from('guest_quote_request')
        .select('*')
        .eq('cleaner_id', cleanerId)
        .not('approved_amount', 'is', null);

      if (error) throw error;
      setApprovedBids(data);
    } catch (err) {
      console.error('Error fetching approved bids:', err);
      toast.error('Failed to load approved bids.');
    }
  }, [fetchCleanerId]);

  useEffect(() => {
    if (view === 'bids') fetchQuotes();
    else if (view === 'approved') fetchApprovedBids();
  }, [view, fetchQuotes, fetchApprovedBids]);

  const openModal = (quote) => {
    setSelectedQuote(quote);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuote(null);
  };


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
  


  return (
    <div className="p-6">
      <GuestBookingsComponent/>
      <ToastContainer />
      <div className="mb-4 flex justify-between items-center flex-wrap">
  <h1 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">My Guest Quote Requests</h1>
  <div className="w-full sm:w-auto flex justify-start sm:justify-end mt-4 sm:mt-0">
    <button
      onClick={() => setView('bids')}
      className={`px-4 py-2 mr-2 mb-2 sm:mb-0 rounded ${view === 'bids' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
    >
      Bids
    </button>
    <button
      onClick={() => setView('approved')}
      className={`px-4 py-2 rounded ${view === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
    >
      Approved Bids
    </button>
  </div>
</div>


{view === 'bids' && (
  quotes.length === 0 ? (
    <p className="text-gray-500">No available quotes for biddings.</p>
  ) : (
    <div className="overflow-x-auto px-2 sm:px-4 lg:px-6">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr className="bg-green-200 text-xs sm:text-sm text-gray-600">
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Service Type</th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Full Name</th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Location</th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Budget Range</th>
            <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote.id} className="border border-gray-300 hover:bg-gray-50 transition duration-200">
              <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{quote.service_type}</td>
              <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{quote.full_name}</td>
              <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{quote.location}</td>
              <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">₦{quote.budget_range}</td>
              <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                <button
                  onClick={() => openModal(quote)}
                  className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-700 transition duration-200"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
)}

{view === 'approved' && (
  approvedBids.length === 0 ? (
    <p className="text-gray-500">No approved bids available.</p>
  ) : (
    <div className="overflow-x-auto px-2 sm:px-4 lg:px-6">
  <table className="min-w-full table-auto border-collapse border border-gray-300">
    <thead className="bg-gray-100">
      <tr className="bg-green-200 text-xs sm:text-sm text-gray-600">
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Phone Number</th>
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Full Name</th>
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Service Type</th>
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Location</th>
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Budget Range</th>
        <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left">Approved Amount</th>
      </tr>
    </thead>
    <tbody>
      {approvedBids.map((bid) => (
        <tr key={bid.id} className="border border-gray-300 hover:bg-gray-50 transition duration-200">
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{bid.phone_number}</td>
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{bid.full_name}</td>
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{bid.service_type}</td>
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{bid.location}</td>
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{bid.budget_range}</td>
          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">₦{bid.approved_amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    
  )
)}


      {/* Modal */}
     {/* Modal */}
{modalOpen && selectedQuote && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
    <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-2xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Bid Details</h2>
      <p><strong>Full Name:</strong> {selectedQuote.full_name}</p>
      <p><strong>Description:</strong> {selectedQuote.description}</p>
      <p className="mt-2"><strong>Bid Amount:</strong></p>
      <input
        type="number"
        value={bids[selectedQuote.id] || ''}
        onChange={(e) => setBids((prev) => ({ ...prev, [selectedQuote.id]: e.target.value }))}
        className="border border-gray-300 p-2 rounded w-full mt-1"
        placeholder="Enter your bid"
      />
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handleBidSubmit(selectedQuote.id)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-1/2 mr-2"
        >
          Submit Bid
        </button>
        <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-1/2"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default GuestQuoteRequests;
