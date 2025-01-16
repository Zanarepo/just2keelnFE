import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const ApprovedBids = () => {
  const [approvedBids, setApprovedBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      console.error('Cleaner email is not found in localStorage');
      return;
    }

    const fetchCleanerIdAndApprovedBids = async () => {
      try {
        // Fetch cleaner ID
        const { data: cleanerData, error: cleanerError } = await supabase
          .from('cleaners_main_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (cleanerError) throw cleanerError;

        const cleanerId = cleanerData.id;

        // Fetch approved bids for this cleaner
        const { data: bidsData, error: bidsError } = await supabase
        .from('clients_quote_requests')
        .select('id, client_id, service_type, approved_amount')
        .eq('cleaner_id', cleanerId)
        .not('approved_amount', 'is', null); // Correct way to check for non-null values
      
        if (bidsError) throw bidsError;

        // Fetch client details for each bid
        const clientIds = bidsData.map((bid) => bid.client_id);
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients_main_profiles')
          .select('id, full_name, address, phone_number, state_of_residence')
          .in('id', clientIds);

        if (clientsError) throw clientsError;

        // Map client details to their corresponding bids
        const bidsWithClientDetails = bidsData.map((bid) => ({
          ...bid,
          client: clientsData.find((client) => client.id === bid.client_id),
        }));

        setApprovedBids(bidsWithClientDetails);
      } catch (err) {
        setError('Failed to fetch approved bids');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCleanerIdAndApprovedBids();
  }, []);

  const handleViewDetails = (client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  if (loading) return <p>Loading approved bids...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="p-4">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-6">Approved Bids</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-200 text-sm text-gray-600">
              <th className="border px-4 py-2">Client Name</th>
              <th className="border px-4 py-2">Service Type</th>
              <th className="border px-4 py-2">Approved Amount</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedBids.map((bid) => (
              <tr key={bid.id}>
                <td className="border px-4 py-2">{bid.client?.full_name || 'N/A'}</td>
                <td className="border px-4 py-2">{bid.service_type}</td>
                <td className="border px-4 py-2">₦{bid.approved_amount}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleViewDetails(bid.client)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      {selectedClient && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div className="bg-white p-6 rounded-lg w-full sm:w-4/5 md:w-3/5 lg:w-1/3 max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col justify-between">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6">Client Details</h3>
      <p className="text-lg sm:text-xl mb-4"><strong>Full Name:</strong> {selectedClient.full_name}</p>
      <p className="text-lg sm:text-xl mb-4"><strong>Location:</strong> {selectedClient.address}</p>
      <p className="text-lg sm:text-xl mb-4"><strong>Phone Number:</strong> {selectedClient.phone_number}</p>
      <p className="text-lg sm:text-xl mb-6"><strong>State of Residence:</strong> {selectedClient.state_of_residence}</p>
      
      <button
        onClick={closeModal}
        className="mt-4 bg-red-500 text-white px-6 py-3 rounded block mx-auto text-lg sm:text-xl"
      >
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
}  

export default ApprovedBids;
