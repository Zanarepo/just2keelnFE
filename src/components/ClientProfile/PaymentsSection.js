import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientSchedules from '../ClientsActivities/ClientSchedules';
import ReviewPromptSection from './ReviewPromptSection';



const PaymentsSection = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailAndPayments = async () => {
      try {
        setLoading(true);

        // Check if email is already stored in local storage
        let storedEmail = localStorage.getItem('email');

        if (!storedEmail) {
          // Fetch the authenticated user's email if not in local storage
          const { data: user, error } = await supabase.auth.getUser();

          if (error) {
            console.error('Error fetching user:', error);
            toast.error('Failed to retrieve user. Please log in.');
            return;
          }

          if (user) {
            storedEmail = user.email;
            localStorage.setItem('email', storedEmail); // Store email in local storage
          }
        }

        if (storedEmail) {
          // Fetch the payment history for the client based on the email
          const { data, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .order('payment_date', { ascending: false }); // Order payments by date

          if (paymentsError) throw paymentsError;

          setPayments(data);
          toast.success('Payment history loaded successfully.');
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
        toast.error('Error loading payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmailAndPayments();
  }, []);

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="payments-section mt-16">
       <div className="payments-section mt-16"><ClientSchedules/> </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-center mt-4 sm:mt-6 mb-4 sm:mb-6 text-green-500">
  Payment History
</h2>
<div className="overflow-x-auto px-4 sm:px-6 lg:px-8"></div>
<table className="w-full bg-white border border-gray-300 rounded-lg">
    <thead>
    <tr className="bg-green-200 text-sm text-gray-600">
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
            payments.map((payment) => (
              <tr key={payment.payment_id} >
                <td className="px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">${(payment.amount / 100).toFixed(2)}</td> {/* Assuming amount is in cents */}
                <td className="px-4 py-2">{payment.payment_method}</td>
                <td className="px-4 py-2">{payment.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
     
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
       <div className="payments-section mt-16"><ReviewPromptSection/></div>
    </div>
  );
};

export default PaymentsSection;
