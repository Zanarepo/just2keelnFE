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
    <div className="min-h-screen bg-white-100 py-6 px-4">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-green-500 mb-4 text-center">Client Subscriptions</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Client Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Subscription Type</th>
              <th className="py-2 px-4 text-left">Start Date</th>
              <th className="py-2 px-4 text-left">End Date</th>
              <th className="py-2 px-4 text-left">Upgrade</th>
            </tr>
          </thead>
          <tbody>
            {clientsWithSubscriptions.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="py-2 px-4">{client.clients_main_profiles.full_name}</td>
                <td className="py-2 px-4">{client.clients_main_profiles.email}</td>
                <td className="py-2 px-4">{client.subscription_type}</td>
                <td className="py-2 px-4">{new Date(client.start_date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(client.end_date).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleUpgrade(client.client_id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
