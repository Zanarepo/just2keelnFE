import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CleanerReviews = ({ cleanerId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch reviews using useCallback to avoid dependency issues
  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews_and_ratings')
        .select('*')
        .eq('cleaner_id', cleanerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data);
    } catch (err) {
      toast.error('Error fetching reviews: ' + err.message);
    }
  }, [cleanerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warn('Please provide a rating.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('reviews_and_ratings').insert([
        {
          cleaner_id: cleanerId,
          cleaner_email: localStorage.getItem('email'),
          rating,
          review: reviewText,
        },
      ]);

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setRating(0);
      setReviewText('');
      fetchReviews(); // Refresh reviews
    } catch (err) {
      toast.error('Error submitting review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto bg-white  rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            {/* Rating Input */}
            <div className="mb-4">
              <label className="block text-gray-700">Rating (1-5)</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="mt-1 p-2 border rounded w-full"
              >
                <option value="0">Select a rating</option>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-gray-700">Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Write your review here..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Display Reviews */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Client Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-500">Rating: {rev.rating}/5</p>
                <p className="text-gray-700 mt-2">{rev.review}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(rev.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanerReviews;
