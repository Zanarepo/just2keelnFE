import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const PaymentsSection = ({ clientId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        
        // Fetch the payment history for the client from Supabase
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('client_id', clientId)
          .order('payment_date', { ascending: false }); // Order payments by date

        if (error) throw error;

        setPayments(data);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [clientId]);

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="payments-section mt-24"> {/* Added margin-top */}
      <h2 className="text-2xl font-semibold text-center mb-6 text-green-500">Payment History</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Payment Date</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Payment Method</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-4 py-2 text-center">No payment history available.</td>
            </tr>
          ) : (
            payments.map(payment => (
              <tr key={payment.payment_id}>
                <td className="px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">${(payment.amount / 100).toFixed(2)}</td> {/* Assuming amount is in cents */}
                <td className="px-4 py-2">{payment.payment_method}</td>
                <td className="px-4 py-2">{payment.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
  
};

export default PaymentsSection;
