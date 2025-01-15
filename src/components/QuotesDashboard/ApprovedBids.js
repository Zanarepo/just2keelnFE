import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Adjust based on your setup
import { toast } from 'react-toastify'; // Assuming you use Toast for notifications
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 
import ApprovedRequests from './ApprovedRequests';

const ClientRequestsAndBids = () => {
  const [clientId, setClientId] = useState(null);
  const [clientRequests, setClientRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client ID using email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      toast.error('Client email not found in local storage');
      setLoading(false);
      return;
    }

    const fetchClientId = async () => {
      try {
        const { data, error } = await supabase
          .from('clients_main_profiles')
          .select('id')
          .eq('email', email)
          .single();
        
        if (error) throw error;
        setClientId(data.id);
      } catch (err) {
        setError('Failed to fetch client ID');
        console.error(err);
        setLoading(false);
      }
    };

    fetchClientId();
  }, []);

  // Fetch client's requests once clientId is available
  useEffect(() => {
    if (!clientId) return;

    const fetchClientRequests = async () => {
      setLoading(true);
      try {
        const { data: requestsData, error: requestsError } = await supabase
          .from('clients_quote_requests')
          .select(`
            id,
            service_type,
            location,
            budget_range,
            created_at
          `)
          .eq('client_id', clientId);
        
        if (requestsError) throw requestsError;
        setClientRequests(requestsData);
      } catch (err) {
        setError('Failed to fetch client requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientRequests();
  }, [clientId]);

  // Fetch bids for each request
  useEffect(() => {
    const fetchBids = async () => {
      if (!clientRequests.length) return;

      setLoading(true);
      try {
        const bidsData = await Promise.all(
          clientRequests.map(async (request) => {
            const { data, error } = await supabase
              .from('cleaners_clients_bids')
              .select(`
                id,
                cleaner_id,
                cleaners_bid_amount,
                status,
                created_at,
                cleaner:cleaners_main_profiles(full_name, email, phone_number)
              `)
              .eq('quote_request_id', request.id);
            
            if (error) throw error;
            return { requestId: request.id, bids: data };
          })
        );

        setBids(bidsData);
      } catch (err) {
        setError('Failed to fetch bids');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [clientRequests]);

  const handleBidAction = async (requestId, bid, action) => {
    try {
      const { cleaner_id, cleaners_bid_amount } = bid;
  
      // If the action is 'approved', use the bid amount as the approved_amount
      const approved_amount = action === 'approved' ? cleaners_bid_amount : null;
  
      // Update the request status along with the approved amount (if approved)
      const { error } = await supabase
        .from('clients_quote_requests')
        .update({
          status: action,
          cleaner_id: cleaner_id,
          cleaners_bid_amount: cleaners_bid_amount,
          approved_amount: approved_amount, // Store the approved amount here
        })
        .eq('id', requestId);
  
      if (error) throw error;
  
      toast.success(`${action === 'approved' ? 'Bid approved' : 'Bid rejected'}`);
    } catch (err) {
      toast.error('Failed to update bid status');
      console.error(err);
    }
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;












  

  return (
    <div className="p-4">
      <ApprovedRequests/>
      <h3 className="text-lg sm:text-xl font-semibold text-center text-green-600 ">Your Requests and Bids</h3>
      {clientRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        clientRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 ease-in-out">
  <h4 className="text-xl font-semibold text-gray-800 mb-3">{request.service_type}</h4>
  <div className="space-y-2">
    <p className="text-sm text-gray-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2" />
      </svg>
      Location: <span className="text-gray-800">{request.location}</span>
    </p>
    <p className="text-sm text-gray-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2" />
      </svg>
      Budget Range: <span className="text-gray-800">₦{request.budget_range}</span>
    </p>
    <p className="text-sm text-gray-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v20m10-10H2" />
      </svg>
      Created At: <span className="text-gray-800">{new Date(request.created_at).toLocaleDateString()}</span>
    </p>
    </div>
    <div className="mt-4">
            <h5 className="font-semibold">Bids:</h5>
            {bids.length > 0 ? (
              bids
                .filter((bidData) => bidData.requestId === request.id)
                .map((bidData) => (
                  
                  
                  <div key={bidData.requestId} className="mt-2 overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-green-200 text-sm text-gray-600">
                        <th className="px-4 py-2 text-left">Cleaner Name</th>
                        <th className="px-4 py-2 text-left">Cleaner Email</th>
                        <th className="px-4 py-2 text-left">Cleaner Phone</th>
                        <th className="px-4 py-2 text-left">Bid Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>


                    <tbody>
                        {bidData.bids.map((bid) => (
                            <tr key={bid.id} className="border-t text-sm">
                              <td className="px-4 py-2">{bid.cleaner ? bid.cleaner.full_name : 'No cleaner info available'}</td>
                              <td className="px-4 py-2">{bid.cleaner ? bid.cleaner.email : 'N/A'}</td>
                              <td className="px-4 py-2">{bid.cleaner ? bid.cleaner.phone_number : 'N/A'}</td>
                              <td className="px-4 py-2">₦{bid.cleaners_bid_amount}</td>
                              <td className="px-4 py-2">{bid.status}</td>
                              <td className="px-4 py-2 flex items-center space-x-2">
                                <button
                                  onClick={() => handleBidAction(request.id, bid, 'approved')}
                                  className="text-green-500 hover:text-green-700"
                                >
                                  <FaCheckCircle />
                                </button>
                                <button
                                  onClick={() => handleBidAction(request.id, bid, 'rejected')}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FaTimesCircle />
                                </button>
                              </td>
                            </tr>



                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
              ) : (
                <p>No bids for this request.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientRequestsAndBids;