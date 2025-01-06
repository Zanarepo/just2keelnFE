import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ReviewPromptSection = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          toast.error('User email not found. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch client_id from clients_main_profiles
        const { data: clientData, error: clientError } = await supabase
          .from('clients_main_profiles')
          .select('id')
          .eq('email', email)
          .single();

        if (clientError || !clientData) {
          toast.error('Error fetching client details');
          setLoading(false);
          return;
        }

        const clientId = clientData.id;

        // Fetch completed bookings (status = 'done') for the client
        const { data: completedBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('booking_id, service_provider_id, services')
          .eq('client_id', clientId)
          .eq('status', 'done');

        if (bookingsError) {
          toast.error('Error fetching completed bookings');
          setLoading(false);
          return;
        }

        // Check for existing reviews for these bookings
        const reviewPromises = completedBookings.map(async (booking) => {
          const { data: reviewData, error: reviewError } = await supabase
            .from('review_and_ratings')
            .select('id')
            .eq('booking_id', booking.booking_id)
            .single();

          if (reviewError || !reviewData) {
            return booking; // Include booking if no review exists
          }
          return null;
        });

        const pendingReviewBookings = (await Promise.all(reviewPromises)).filter(
          (booking) => booking !== null
        );

        setPendingReviews(pendingReviewBookings);
      } catch (error) {
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 shadow rounded">
      <h3 className="text-2xl font-semibold text-center mb-6 text-green-600">Pending Reviews</h3>
      {pendingReviews.length === 0 ? (
        <p className="text-gray-500">No pending reviews. Thank you for your feedback!</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Please leave a review for the following completed bookings:
          </p>
          {pendingReviews.map((booking) => (
            <div key={booking.booking_id} className="mb-4 border-b pb-4">
              <p className="font-semibold">Service: {booking.services}</p>
              <button
                className="mt-2 py-1 px-4 bg-green-500 text-white rounded"
                onClick={() => handleReviewSubmit(booking.booking_id)}
              >
                Leave a Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const handleReviewSubmit = async (bookingId) => {
  const feedback = prompt('Please enter your feedback:');
  const rating = prompt('Rate the service (1-5):');

  if (!feedback || !rating) {
    toast.error('Both feedback and rating are required.');
    return;
  }

  try {
    const { error } = await supabase.from('review_and_ratings').insert([
      {
        booking_id: bookingId,
        feedback,
        rating: parseInt(rating, 10),
        created_at: new Date(),
      },
    ]);

    if (error) {
      toast.error('Error submitting review');
      return;
    }

    toast.success('Review submitted successfully');
    window.location.reload(); // Reload to update pending reviews
  } catch (error) {
    toast.error('An unexpected error occurred');
  }
};

export default ReviewPromptSection;
