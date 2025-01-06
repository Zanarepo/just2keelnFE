import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientSubscriptions = () => {
  const [clientsWithSubscriptions, setClientsWithSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients and their subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, client_id, subscription_type, start_date, end_date, active, clients_main_profiles(full_name, email, phone_number)')
          .eq('active', true);

        if (error) {
          throw error;
        }

        setClientsWithSubscriptions(data);
        setLoading(false);
      } catch (err) {
        setError('There was an error fetching the subscriptions.');
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Handle subscription upgrade
  const handleUpgrade = async (clientId) => {
    try {
      // Assuming 'premium' is the upgraded subscription type.
      const { error } = await supabase
        .from('subscriptions')
        .update({ subscription_type: 'premium', updated_at: new Date() })
        .eq('client_id', clientId);

      if (error) {
        throw error;
      }

      // Show success toast notification
      toast.success('Subscription upgraded successfully!');

      // Re-fetch data to reflect the changes
      setClientsWithSubscriptions((prev) => prev.map(client =>
        client.client_id === clientId
          ? { ...client, subscription_type: 'premium' }
          : client
      ));
    } catch (err) {
      // Show error toast notification
      toast.error('There was an error upgrading the subscription.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-white-100">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-green-500 mb-4 text-center">Client Subscriptions</h2>
  
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 text-left border-b border-gray-300">Client Name</th>
              <th className="py-2 text-left border-b border-gray-300">Email</th>
              <th className="py-2 text-left border-b border-gray-300">Subscription Type</th>
              <th className="py-2 text-left border-b border-gray-300">Start Date</th>
              <th className="py-2 text-left border-b border-gray-300">End Date</th>
              <th className="py-2 text-left border-b border-gray-300">Upgrade</th>
            </tr>
          </thead>
          <tbody>
            {clientsWithSubscriptions.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="py-2">{client.clients_main_profiles.full_name}</td>
                <td className="py-2">{client.clients_main_profiles.email}</td>
                <td className="py-2">{client.subscription_type}</td>
                <td className="py-2">{new Date(client.start_date).toLocaleDateString()}</td>
                <td className="py-2">{new Date(client.end_date).toLocaleDateString()}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleUpgrade(client.client_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Upgrade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
};

export default ClientSubscriptions;
