import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg rounded-b-2xl sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
          <span className="inline-block rounded-full p-1">
            {/* Modern book icon with gradient */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="url(#paint0_linear)"/>
              <g filter="url(#shadow)">
                <rect x="7" y="9" width="22" height="18" rx="2" fill="#fff"/>
                <rect x="9" y="11" width="18" height="2" rx="1" fill="#e0e7ff"/>
                <rect x="9" y="15" width="10" height="2" rx="1" fill="#c7d2fe"/>
                <rect x="9" y="19" width="14" height="2" rx="1" fill="#c7d2fe"/>
                <rect x="9" y="23" width="8" height="2" rx="1" fill="#c7d2fe"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA"/>
                  <stop offset="1" stopColor="#F472B6"/>
                </linearGradient>
                <filter id="shadow" x="5" y="7" width="26" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#a5b4fc"/>
                </filter>
              </defs>
            </svg>
          </span>
          BookVerse
        </NavLink>
        <div className="flex gap-2 sm:gap-4 items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-white font-semibold bg-black bg-opacity-20 px-3 py-1 rounded transition' : 'text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded transition'} end>Home</NavLink>
          {token ? (
            <>
              <NavLink to="/add" className={({ isActive }) => isActive ? 'text-white font-semibold bg-black bg-opacity-20 px-3 py-1 rounded transition' : 'text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded transition'}>Add Book</NavLink>
              <button onClick={handleLogout} className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded transition font-semibold">Logout</button>
              <span className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center text-white font-bold shadow">U</span>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-white font-semibold bg-black bg-opacity-20 px-3 py-1 rounded transition' : 'text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded transition'}>Login</NavLink>
              <NavLink to="/signup" className={({ isActive }) => isActive ? 'text-white font-semibold bg-black bg-opacity-20 px-3 py-1 rounded transition' : 'text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded transition'}>Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 