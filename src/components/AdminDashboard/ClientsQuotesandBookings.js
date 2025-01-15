import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaEye, FaTrash } from 'react-icons/fa';
//import ApprovedRFQs from './ApprovedRFQs';
//import ClientsCleanersBookings from '../AdminDashboard/ClientsCleanersBookings'








const ClientsQuotesandBookings = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const { data: bidsData, error: bidsError } = await supabase
          .from('cleaners_clients_bids')
          .select('id, quote_request_id, cleaner_id, cleaners_bid_amount, created_at');

        if (bidsError) throw bidsError;

        const quoteRequestIds = bidsData.map((bid) => bid.quote_request_id);
        const cleanerIds = bidsData.map((bid) => bid.cleaner_id);

        const { data: quoteRequestsData, error: quoteRequestsError } = await supabase
          .from('clients_quote_requests')
          .select('id, client_id, service_type, location, budget_range, description')
          .in('id', quoteRequestIds);

        if (quoteRequestsError) throw quoteRequestsError;

        const clientIds = quoteRequestsData.map((request) => request.client_id);
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients_main_profiles')
          .select('id, full_name')
          .in('id', clientIds);

        if (clientsError) throw clientsError;

        const { data: cleanersData, error: cleanersError } = await supabase
          .from('cleaners_main_profiles')
          .select('id, full_name, states_of_residence, phone_number, address')
          .in('id', cleanerIds);

        if (cleanersError) throw cleanersError;

        const bidsWithDetails = bidsData.map((bid) => {
          const quoteRequest = quoteRequestsData.find((q) => q.id === bid.quote_request_id);
          const client = clientsData.find((c) => c.id === quoteRequest.client_id);
          const cleaner = cleanersData.find((cl) => cl.id === bid.cleaner_id);

          return {
            ...bid,
            clientName: client.full_name,
            serviceType: quoteRequest.service_type,
            location: quoteRequest.location,
            budgetRange: quoteRequest.budget_range,
            description: quoteRequest.description,
            cleaner,
          };
        });

        setBids(bidsWithDetails);
      } catch (error) {
        toast.error('Failed to fetch bids');
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const openModal = (cleaner) => {
    setSelectedCleaner(cleaner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCleaner(null);
  };

  const handleDeleteBid = async (bidId) => {
    try {
      const { error } = await supabase
        .from('cleaners_clients_bids')
        .delete()
        .eq('id', bidId);

      if (error) throw error;

      setBids((prevBids) => prevBids.filter((bid) => bid.id !== bidId));
      toast.success('Bid deleted successfully');
    } catch (error) {
      toast.error('Failed to delete bid');
      console.error('Error deleting bid:', error);
    }
  };

  if (loading) return <p>Loading bids...</p>;

  return (
    <div className="p-4">
      
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-4">RFQs Dashboard (cleaners & clients)</h2>
      <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">  <thead>
          <tr className="bg-green-200 text-sm text-gray-600">
              <th className="border px-4 py-2">Client Name</th>
              <th className="border px-4 py-2">Service Type</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Budget Range</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Cleaner Bid Amount</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td className="border px-4 py-2">{bid.clientName}</td>
                <td className="border px-4 py-2">{bid.serviceType}</td>
                <td className="border px-4 py-2">{bid.location}</td>
                <td className="border px-4 py-2">₦{bid.budgetRange}</td>
                <td className="border px-4 py-2">{bid.description}</td>
                <td className="border px-4 py-2">₦{bid.cleaners_bid_amount}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(bid.cleaner)}
                    className="text-blue-500 mr-2"
                  >
                    <FaEye size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteBid(bid.id)}
                    className="text-red-500"
                  >
                    <FaTrash size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && selectedCleaner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Cleaner Details</h3>
            <p><strong>Full Name:</strong> {selectedCleaner.full_name}</p>
            <p><strong>State of Residence:</strong> {selectedCleaner.states_of_residence}</p>
            <p><strong>LGA:</strong> {selectedCleaner.lga}</p>
            <p><strong>Phone Number:</strong> {selectedCleaner.phone_number}</p>
            <p><strong>Address:</strong> {selectedCleaner.address}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsQuotesandBookings;
