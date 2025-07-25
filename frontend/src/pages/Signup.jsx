import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-2 sm:px-0">
      <div className="relative w-full max-w-md p-6 sm:p-10 bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 animate-fade-in" style={{ animation: 'fadeInUp 0.6s both' }}>
        <div className="absolute -top-8 -left-8 w-20 sm:w-24 h-20 sm:h-24 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-8 -right-8 w-20 sm:w-24 h-20 sm:h-24 bg-pink-400/30 rounded-full blur-2xl animate-pulse" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-6 text-center">Sign Up for BookVerse</h1>
        <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition bg-white/60 text-base sm:text-lg focus:scale-105 focus:shadow-lg"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition bg-white/60 text-base sm:text-lg focus:scale-105 focus:shadow-lg"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition bg-white/60 text-base sm:text-lg focus:scale-105 focus:shadow-lg"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 text-base sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
} 