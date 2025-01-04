import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(''); // Track selected payment status

  // Fetch payments data from the payments table
  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('payment_id, client_id, amount, payment_date, status'); // Ensure fields you need are selected

      if (error) throw error;

      setPayments(data);
      setFilteredPayments(data); // Initially, show all payments
    } catch (error) {
      toast.error('Error fetching payments data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter payments by status
  const filterPayments = (status) => {
    setPaymentStatus(status);
    if (status === '') {
      setFilteredPayments(payments); // Show all payments when no filter is applied
    } else {
      const filtered = payments.filter((payment) => payment.status === status);
      setFilteredPayments(filtered);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-green-500 mb-4 text-center">Manage Payments</h1>

     {/* Filter Options */}
<div className="mb-4 flex justify-center space-x-4">
  <button
    onClick={() => filterPayments('Completed')}
    className={`px-4 py-2 rounded-md ${
      paymentStatus === 'Completed' ? 'bg-green-600' : 'bg-green-500'
    } text-white`}
  >
    Completed
  </button>
  <button
    onClick={() => filterPayments('Pending')}
    className={`px-4 py-2 rounded-md ${
      paymentStatus === 'Pending' ? 'bg-yellow-600' : 'bg-yellow-500'
    } text-white`}
  >
    Pending
  </button>
  <button
    onClick={() => filterPayments('')}
    className={`px-4 py-2 rounded-md ${
      paymentStatus === '' ? 'bg-gray-600' : 'bg-gray-500'
    } text-white`}
  >
    All
  </button>
</div>

      {/* Loading State */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table to Display Payments */}
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Client ID</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Payment Date</th>
                <th className="px-4 py-2">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Render Each Payment */}
              {filteredPayments.map((payment) => (
                <tr key={payment.payment_id}>
                  <td className="px-4 py-2">{payment.payment_id}</td>
                  <td className="px-4 py-2">{payment.client_id}</td>
                  <td className="px-4 py-2">${payment.amount}</td>
                  <td className="px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                  <td className={`px-4 py-2 ${payment.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {payment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
