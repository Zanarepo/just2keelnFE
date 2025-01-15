import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure supabaseClient is correctly imported
import { toast } from 'react-toastify';

const BidDetails = () => {
  const [bidDetails, setBidDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInCleaner, setLoggedInCleaner] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track admin status
  const [selectedBid, setSelectedBid] = useState(null); // Track selected bid for viewing

  // Fetch logged-in cleaner or admin information
  const fetchLoggedInUser = async () => {
    const email = localStorage.getItem('email'); // Get logged-in cleaner's email from localStorage
    const adminStatus = localStorage.getItem('isAdmin') === 'true'; // Get admin status
    console.log('Logged-in user email from localStorage:', email); // Debugging log

    if (email) {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('id, email')
        .eq('email', email)
        .single();
      
      if (data) {
        setLoggedInCleaner(data);
        setIsAdmin(adminStatus); // Set admin status
        console.log('User data retrieved:', data); // Debugging log
      }
      if (error) {
        console.error('Error fetching user:', error.message);
        toast.error('Error fetching user.');
      }
    } else {
      console.error('No email found in localStorage.');
      toast.error('No user email found.');
    }
  };

  // Memoize fetchBidDetails function
  const fetchBidDetails = useCallback(async () => {
    if (!loggedInCleaner && !isAdmin) {
      toast.error('No logged-in user found.');
      console.log('No logged-in user found, skipping bid fetch.');
      return;
    }

    console.log('Fetching bid details for user:', loggedInCleaner?.email || 'Admin');

    try {
      let query = supabase.from('guest_bids').select('*');

      // If the user is an admin, fetch all bids
      if (!isAdmin && loggedInCleaner) {
        query = query.eq('cleaners_id', loggedInCleaner.id); // If it's a cleaner, filter by cleaner's ID
      }

      const { data: bidData, error: bidError } = await query;

      if (bidError) {
        console.error('Error fetching bid data:', bidError.message);
        toast.error('Error fetching bid data.');
        return;
      }

      console.log('Bid data retrieved:', bidData); // Debugging log

      if (bidData && bidData.length > 0) {
        // Step 2: Fetch corresponding quote request details for each bid
        const bidPromises = bidData.map(async (bid) => {
          const { data: quoteRequestData, error: quoteRequestError } = await supabase
            .from('guest_quote_request')
            .select('*') // Fetch all details from guest_quote_request
            .eq('id', bid.id) // Match the guest_quote_request ID with the bid ID
            .single(); // Fetch a single record

          if (quoteRequestError) {
            console.error('Error fetching quote request data:', quoteRequestError.message);
            toast.error('Error fetching quote request data.');
            return null;
          }

          return {
            bid,
            quoteRequest: quoteRequestData,
          };
        });

        const details = await Promise.all(bidPromises);
        console.log('Final bid details with quote request:', details); // Debugging log
        setBidDetails(details); // Update state with fetched data
      } else {
        console.log('No bid data found for this user.');
      }
    } catch (err) {
      console.error('Error fetching bid details:', err.message);
      toast.error('Error fetching bid details.');
    } finally {
      setLoading(false);
    }
  }, [loggedInCleaner, isAdmin]); // Dependencies of fetchBidDetails function

  // Fetch logged-in user details on component mount
  useEffect(() => {
    fetchLoggedInUser();
  }, []); // Empty dependency array so it only runs once on mount

  // Fetch bid details once logged-in user data is available
  useEffect(() => {
    if (loggedInCleaner || isAdmin) {
      fetchBidDetails();
    }
  }, [loggedInCleaner, isAdmin, fetchBidDetails]); // Add fetchBidDetails to dependencies

  // Handle view request action
  const handleViewRequest = (bidId) => {
    const selected = bidDetails.find(detail => detail.bid.id === bidId);
    setSelectedBid(selected); // Set the selected bid for modal view
    console.log('Selected bid for viewing:', selected); // Debugging log
  };

  if (loading) {
    return <div>Loading bid details...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
        
        Your Guest Quote Bids Status Details
      </h2>
      <p className="text-base text-left text-gray-600 mb-4">
  Your Guest Quote Bids Status Details displays all the bids you have submitted and the status of the bids. 
  You&apos;d get notified when the status changes.
</p>

      <div>
        {bidDetails.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-white-300 shadow-md">
          <thead className="bg-white-200 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th className="px-6 py-3 border border-gray-300 text-left">Guest Name (Client)</th>
              <th className="px-6 py-3 border border-gray-300 text-left">Approved Amount</th>
              <th className="px-6 py-3 border border-gray-300 text-left">Status</th>
              <th className="px-6 py-3 border border-gray-300 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
        
          {bidDetails.map((detail) => {
  // Check if detail.bid exists to prevent accessing properties of null or undefined
  if (!detail.bid) {
    return null; // Or you can display a fallback UI, like a placeholder row
  }

  const isAccepted = detail.bid.status === 'Accepted';
  const isRejected = detail.bid.status === 'Rejected';

  return (
    <tr
      key={detail.bid.id}
      className={`${
        isAccepted ? 'bg-white-100 border-l-4 border-green-500' : ''
      } ${isRejected ? 'bg-white-100 border-l-4 border-red-500' : ''} hover:bg-gray-50 transition duration-200`}
    >
      <td className="px-6 py-3 border border-gray-300 text-gray-700">{detail.quoteRequest.full_name}</td>
      <td className="px-6 py-3 border border-gray-300 text-gray-700">₦{detail.bid.approved_amount}</td>
      <td className="px-6 py-3 border border-gray-300">
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded ${
            isAccepted ? 'bg-green-200 text-green-800' : isRejected ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
          }`}
        >
          {detail.bid.status}
        </span>
      </td>
      <td className="px-6 py-3 border border-gray-300">
        <button
          onClick={() => handleViewRequest(detail.bid.id)}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          View
        </button>
      </td>
    </tr>
  );
              })}
            </tbody>
          </table>
        ) : (
          <p>No bids available.</p>
        )}
      </div>

      {/* Modal for showing bid details */}
      {selectedBid && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold mb-4">Bid Details</h3>
            <p><strong>Guest Name:</strong> {selectedBid.quoteRequest.full_name}</p>
            <p><strong>Description:</strong> {selectedBid.quoteRequest.description}</p>
            <p><strong>Email:</strong> {selectedBid.quoteRequest.mail}</p>
            <p><strong>Location:</strong> {selectedBid.quoteRequest.location}</p>
            <p><strong>Phone Number:</strong> {selectedBid.quoteRequest.phone_number}</p>
            <p><strong>Budget Range:</strong> ₦{selectedBid.quoteRequest.budget_range}</p>
            <p><strong>Service:</strong> {selectedBid.quoteRequest.service_type}</p>
            <p><strong>Approved Amount:</strong> ₦{selectedBid.bid.approved_amount}</p>
            <p><strong>Status:</strong> {selectedBid.bid.status}</p>
            <button
              onClick={() => setSelectedBid(null)}
              className="mt-4 text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidDetails;
