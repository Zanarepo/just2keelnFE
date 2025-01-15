import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ApprovedRequests = () => {
  const [clientId, setClientId] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCleaner, setSelectedCleaner] = useState(null);

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

  // Fetch approved requests based on client ID
  useEffect(() => {
    if (clientId) {
      const fetchApprovedRequests = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('clients_quote_requests')
            .select('id, service_type, approved_amount, cleaner_id')
            .eq('client_id', clientId)
            .eq('status', 'approved');
          
          if (error) throw error;
          setApprovedRequests(data);
        } catch (err) {
          setError('Failed to fetch approved requests');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchApprovedRequests();
    }
  }, [clientId]);

  // Fetch cleaner details (including profile picture) by cleaner_id
  const fetchCleanerDetails = async (cleanerId) => {
    try {
      const { data, error } = await supabase
        .from('cleaners_main_profiles')
        .select('full_name, phone_number, states_of_residence, address, profile_picture_url')
        .eq('id', cleanerId)
        .single();
      
      if (error) throw error;
      setSelectedCleaner(data);
    } catch (err) {
      console.error('Error fetching cleaner details:', err);
    }
  };

  const closeModal = () => setSelectedCleaner(null);

  return (
    <div className="p-4">
      <h3 className="text-lg sm:text-xl font-semibold text-center text-green-600">Your Approved Quotes</h3>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {approvedRequests.length === 0 ? (
        <p>No approved requests found.</p>
      ) : (
       
       
        <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg p-8 mb-4 ">
          <thead>
            <tr  className="bg-green-200 text-sm text-gray-600">
              <th className="px-4 py-2 text-left">Cleaner Details</th>
              <th className="px-4 py-2 text-left">Approved Amount</th>
              <th className="px-4 py-2 text-left">Service Type</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map((request) => (
              <tr key={request.id} className="text-sm border-t">
                <td className="px-4 py-2 text-left">
                  {request.cleaner_id ? (
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => fetchCleanerDetails(request.cleaner_id)}
                    >
                      View profile
                    </button>
                  ) : (
                    'No cleaner assigned'
                  )}
                </td>
                <td className="px-4 py-2 text-left">₦{request.approved_amount}</td>
                <td className="px-4 py-2 text-left">{request.service_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      




      )}

      {selectedCleaner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <div className="flex justify-center mb-4">
              <img
                src={selectedCleaner.profile_picture_url || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <h4 className="text-lg font-semibold">{selectedCleaner.full_name}</h4>
            <p className="text-sm text-gray-600">State of Residence: {selectedCleaner.state_of_residence}</p>
            <p className="text-sm text-gray-600">LGA of Residence: {selectedCleaner.lga_of_residence}</p>
            <p className="text-sm text-gray-600">Phone: {selectedCleaner.phone_number}</p>
            <p className="text-sm text-gray-600">Address: {selectedCleaner.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;
