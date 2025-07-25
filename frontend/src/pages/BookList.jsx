import { useEffect, useState } from 'react';
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

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [sort, setSort] = useState('date');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit };
        if (genre) params.genre = genre;
        if (author) params.author = author;
        if (sort) params.sort = sort;
        const res = await api.get('/books', { params });
        setBooks(res.data.books);
        setTotal(res.data.total);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page, limit, genre, author, sort]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-center mb-12 py-12 px-2 sm:px-4 rounded-3xl bg-gradient-to-br from-blue-400/60 via-purple-300/40 to-pink-200/60 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-3xl pointer-events-none" />
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 drop-shadow-lg mb-4 animate-fade-in">Welcome to BookVerse</h1>
        <p className="relative text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6 animate-fade-in delay-100">
          Discover, review, and rate your favorite books. Browse our collection, add your own, and share your thoughts with the community!
        </p>
        <a href="/add" className="relative inline-block px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in delay-200">
          Add Your First Book
        </a>
        <div className="absolute -top-10 -right-10 w-32 sm:w-40 h-32 sm:h-40 bg-pink-400/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 sm:w-40 h-32 sm:h-40 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />
      </section>

      {/* Filters, Sorting & Pagination */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 my-8 animate-fade-in delay-300 px-2">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition min-w-0 text-blue-700"
            placeholder="Filter by author"
            value={author}
            onChange={e => { setAuthor(e.target.value); setPage(1); }}
          />
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition min-w-0 text-pink-700"
            placeholder="Filter by genre"
            value={genre}
            onChange={e => { setGenre(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <label className="text-gray-700 font-semibold">Sort by:</label>
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition bg-white/60 text-base"
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
          >
            <option value="date">Newest</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >Prev</button>
          <span className="text-gray-700 font-bold">{page}</span>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >Next</button>
        </div>
      </div>

      {/* Book Cards */}
      {loading ? (
        <div className="text-center text-lg text-blue-600 font-bold animate-pulse">Loading books...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-500 font-bold">{error}</div>
      ) : books.length === 0 ? (
        <div className="rounded-lg bg-white shadow p-6 text-gray-500 text-center">No books found. Try different filters or add one!</div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 animate-fade-in delay-500">
          {books.map((book, idx) => (
            <a
              key={book._id}
              href={`/books/${book._id}`}
              className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[220px] border border-gray-200 group overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:z-10 focus:z-10 focus:outline-none"
              style={{ animation: `fadeInUp 0.5s ${0.1 * idx}s both` }}
            >
              <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30 group-hover:opacity-60 transition" />
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-white">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 17V5.5A2.5 2.5 0 0 1 8.5 3h7A2.5 2.5 0 0 1 18 5.5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2 group-hover:underline text-center break-words">{book.title}</h2>
              <p className="text-gray-600 mb-2 text-center break-words">by {book.author}</p>
              <span className="inline-block bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow mb-2">{book.genre}</span>
              <div className="flex items-center gap-2 mt-2">
                <RatingStars value={Math.round(book.avgRating || 0)} size={4} />
                <span className="text-yellow-500 font-bold text-lg ml-1">{book.avgRating ? book.avgRating.toFixed(1) : 'N/A'}</span>
              </div>
              <div className="absolute inset-0 pointer-events-none group-hover:bg-gradient-to-br group-hover:from-blue-100/10 group-hover:to-pink-100/10 transition" />
            </a>
          ))}
        </div>
      )}
      {/* Custom fadeInUp animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 