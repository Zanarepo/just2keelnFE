import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [action, setAction] = useState('');
  const [selectedReviewCleanerName, setSelectedReviewCleanerName] = useState('');

  const fetchReviewsData = async () => {
    try {
      // Fetch reviews data
      const { data: reviewsData, error: reviewError } = await supabase
        .from('reviews_and_ratings')
        .select('review_id, cleaner_id, rating, review');

      if (reviewError) throw reviewError;

      // Check if reviews data exists
      if (!reviewsData || reviewsData.length === 0) {
        console.error('No reviews data found');
        return;
      }

      // Get cleaner IDs from reviews
      const cleanerIds = reviewsData.map((review) => review.cleaner_id);

      // Fetch cleaner details based on cleaner_id
      const { data: cleanersData, error: cleanerError } = await supabase
        .from('cleaners_main_profiles')
        .select('id, full_name')
        .in('id', cleanerIds);

      if (cleanerError) throw cleanerError;

      // Map cleaner names to reviews
      const reviewsWithNames = reviewsData.map((review) => {
        const cleaner = cleanersData.find((c) => c.id === review.cleaner_id);
        return {
          ...review,
          cleaner_name: cleaner ? cleaner.full_name : 'Unknown Cleaner',
        };
      });

      setReviews(reviewsWithNames);
    } catch (error) {
      toast.error('Error fetching reviews data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (reviewId, action, cleanerName) => {
    setSelectedReviewId(reviewId);
    setAction(action);
    setSelectedReviewCleanerName(cleanerName);
    setShowConfirmation(true); // Show confirmation modal
  };

  const performAction = async () => {
    if (!selectedReviewId) {
      toast.error('Review ID is missing!');
      return;
    }

    try {
      if (action === 'delete') {
        // Perform delete operation
        const { error } = await supabase
          .from('reviews_and_ratings')
          .delete()
          .eq('review_id', selectedReviewId);

        if (error) throw error;

        // Filter out the deleted review from the state
        setReviews(reviews.filter((review) => review.review_id !== selectedReviewId));

        toast.success('Review deleted successfully!');
        setShowConfirmation(false); // Close confirmation modal
      }
    } catch (error) {
      toast.error(`Error performing ${action} on review`);
      console.error(error);
      setShowConfirmation(false); // Close confirmation modal on error
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Close confirmation modal without action
  };

  useEffect(() => {
    fetchReviewsData();
  }, []);

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl font-semibold text-green-500 mb-4 text-center">Manage Reviews & Ratings</h1>

      {/* Loading State */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table to Display Reviews */}
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b">
                <th className="px-4 py-2">Cleaner Name</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Review</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render Each Review */}
              {reviews.map((review) => (
                <tr key={review.review_id}>
                  <td className="px-4 py-2">{review.cleaner_name}</td>
                  <td className="px-4 py-2">{review.rating}</td>
                  <td className="px-4 py-2">{review.review}</td>
                  <td className="px-4 py-2">
                    <select
                      onChange={(e) => handleAction(review.review_id, e.target.value, review.cleaner_name)}
                      className="px-4 py-2 border rounded-md focus:outline-none"
                    >
                      <option value="">Select Action</option>
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Are you sure you want to {action} review for {selectedReviewCleanerName}?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={performAction}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
