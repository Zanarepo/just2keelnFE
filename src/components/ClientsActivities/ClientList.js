import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients_main_profiles') // Your table name
          .select('id, full_name, email, phone_number, address, created_at');

        if (error) {
          throw error;
        }

        setClients(data);
        setLoading(false);
      } catch (err) {
        setError('There was an error fetching the clients.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h2 className="text-2xl font-semibold text-green-500 mb-4 text-center">Clients List</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Full Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="py-2 px-4">{client.full_name}</td>
                <td className="py-2 px-4">{client.email}</td>
                <td className="py-2 px-4">{client.phone_number}</td>
                <td className="py-2 px-4">{client.address}</td>
                <td className="py-2 px-4">{new Date(client.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
