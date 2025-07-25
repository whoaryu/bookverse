import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function RatingStars({ value = 0, size = 6 }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size*4} height={size*4} viewBox="0 0 24 24" fill={i <= value ? 'url(#star-gradient)' : 'none'} stroke="#fbbf24" strokeWidth="2" className="drop-shadow">
          <defs>
            <linearGradient id="star-gradient" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch book details and reviews
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [bookRes, reviewsRes] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/books/${id}/reviews`)
        ]);
        setBook(bookRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError('Failed to load book or reviews');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Add review
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      await api.post(`/books/${id}/reviews`, { rating, text: review });
      // Refetch reviews and book for updated avgRating
      const [bookRes, reviewsRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/books/${id}/reviews`)
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
      setReview('');
      setRating(0);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center text-lg text-blue-600 font-bold animate-pulse">Loading book...</div>;
  if (error || !book) return <div className="text-center text-lg text-red-500 font-bold">{error || 'Book not found'}</div>;

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-0">
      {/* Book Info Card */}
      <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 sm:p-10 mb-10 border border-gray-200 animate-fade-in" style={{ animation: 'fadeInUp 0.6s both' }}>
        <div className="absolute -top-8 -left-8 w-20 sm:w-24 h-20 sm:h-24 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-8 -right-8 w-20 sm:w-24 h-20 sm:h-24 bg-pink-400/30 rounded-full blur-2xl animate-pulse" />
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 mb-2 break-words">{book.title}</h1>
        <p className="text-base sm:text-lg text-gray-700 mb-1">by <span className="font-semibold text-purple-700">{book.author}</span></p>
        <span className="inline-block bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-4 py-1 rounded-full text-xs sm:text-sm font-semibold shadow mb-4">{book.genre}</span>
        {book.description && <p className="text-gray-600 mb-4 break-words">{book.description}</p>}
        <div className="flex items-center gap-2 mb-2">
          <RatingStars value={Math.round(book.avgRating || 0)} size={6} />
          <span className="text-lg font-bold text-yellow-500">{book.avgRating ? book.avgRating.toFixed(1) : 'N/A'}</span>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-purple-700 mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-lg bg-white shadow p-6 text-gray-500 text-center">No reviews yet. Be the first to review!</div>
          ) : reviews.map((r, i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-4 bg-white/70 backdrop-blur rounded-2xl shadow p-4 sm:p-5 border border-gray-100 animate-fade-in" style={{ animation: `fadeInUp 0.5s ${0.1 * i}s both` }}>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow">
                {r.user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-blue-700 break-words">{r.user?.username || 'User'}</span>
                  <RatingStars value={r.rating} size={4} />
                </div>
                <p className="text-gray-700 break-words">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Form */}
      {token && (
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 animate-fade-in" style={{ animation: 'fadeInUp 0.6s both' }}>
          <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-3">Add Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-gray-700 font-semibold">Your Rating:</span>
              {[1,2,3,4,5].map(i => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRating(i)}
                  className={i <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'}
                  aria-label={`Rate ${i}`}
                  disabled={submitting}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={i <= rating ? 'currentColor' : 'none'} stroke="#fbbf24" strokeWidth="2">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>
            <textarea
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition resize-none bg-white/60 text-base sm:text-lg focus:scale-105 focus:shadow-lg"
              rows={3}
              placeholder="Write your review..."
              value={review}
              onChange={e => setReview(e.target.value)}
              disabled={submitting}
              required
            />
            {submitError && <div className="text-red-500 text-center font-semibold">{submitError}</div>}
            <button type="submit" disabled={submitting || !rating || !review.trim()} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 