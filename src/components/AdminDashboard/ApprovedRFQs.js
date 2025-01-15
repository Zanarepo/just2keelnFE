

import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

const ApprovedRFQs = () => {
  const [approvedBids, setApprovedBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCleaner, setSelectedCleaner] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchApprovedBids = async () => {
      try {
        setLoading(true);

        // Fetch approved bids
        const { data: approvedBidsData, error: approvedBidsError } = await supabase
          .from('clients_quote_requests')
          .select(
            'id, client_id, approved_amount, description, service_type, location, cleaner_id'
          )
          .not('approved_amount', 'is', null); // Only fetch bids with approved amounts

        if (approvedBidsError) throw approvedBidsError;

        const clientIds = approvedBidsData.map((request) => request.client_id);
        const cleanerIds = approvedBidsData.map((request) => request.cleaner_id);

        // Fetch client details
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients_main_profiles')
          .select('id, full_name')
          .in('id', clientIds);

        if (clientsError) throw clientsError;

        // Fetch cleaner details
        const { data: cleanersData, error: cleanersError } = await supabase
          .from('cleaners_main_profiles')
          .select('id, full_name, states_of_residence, phone_number, address')
          .in('id', cleanerIds);

        if (cleanersError) throw cleanersError;

        // Map data to display
        const approvedBidsWithDetails = approvedBidsData.map((bid) => {
          const client = clientsData.find((c) => c.id === bid.client_id);
          const cleaner = cleanersData.find((cl) => cl.id === bid.cleaner_id);

          return {
            ...bid,
            clientName: client.full_name,
            cleaner,
          };
        });

        setApprovedBids(approvedBidsWithDetails);
      } catch (error) {
        toast.error('Failed to fetch approved bids');
        console.error('Error fetching approved bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedBids();
  }, []);

  const openModal = (cleaner) => {
    setSelectedCleaner(cleaner);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCleaner(null);
  };

  if (loading) return <p>Loading approved bids...</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg sm:text-xl font-bold text-center text-green-600 p-4">Approved Bids Dashboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
          <tr className="bg-green-200 text-sm text-gray-600">
              <th className="border px-4 py-2">Client Name</th>
              <th className="border px-4 py-2">Service Type</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Approved Amount</th>
              <th className="border px-4 py-2">Cleaner Name</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedBids.map((bid) => (
              <tr key={bid.id}>
                <td className="border px-4 py-2">{bid.clientName}</td>
                <td className="border px-4 py-2">{bid.service_type}</td>
                <td className="border px-4 py-2">{bid.location}</td>
                <td className="border px-4 py-2">{bid.description}</td>
                <td className="border px-4 py-2">₦{bid.approved_amount}</td>
                <td className="border px-4 py-2">{bid.cleaner.full_name}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(bid.cleaner)}
                    className="text-blue-500 mr-2"
                  >
                    <FaEye size={20} />
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

export default ApprovedRFQs;
