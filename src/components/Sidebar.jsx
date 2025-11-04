import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfileSection({ onLogout }) {
  const { currentUser } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800/50 transition-colors group"
      >
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg ring-2 ring-indigo-500/20">
            {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs text-gray-400 truncate">Welcome back</p>
          <p className="text-sm font-semibold text-white truncate">
            {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
          </p>
        </div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Profile Dropdown Menu */}
      {profileMenuOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm font-semibold text-white truncate">
              {currentUser?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {currentUser?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setProfileMenuOpen(false);
                if (onLogout) {
                  onLogout();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ onClose, onLogout }) {
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard',
      type: 'link'
    },
    { 
      path: '/insights', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      label: 'Insights',
      type: 'link'
    },
  ];

  const isActive = (item) => {
    return location.pathname === item.path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 lg:w-72 bg-gray-900/95 backdrop-blur-md z-50 border-r border-gray-700/30 shadow-2xl relative">
        {/* Grid Pattern - Matching Homepage */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
        
        <div className="flex flex-col h-full relative z-10">
          {/* Logo */}
          <div className="px-4 sm:px-6 py-4 lg:py-4 border-b border-gray-700/50 flex-shrink-0 h-16 flex items-center">
            <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-xl sm:text-2xl">₹</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">SmartSpend</h1>
                <p className="text-xs text-gray-400 truncate">Finance Tracker</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => {
              const active = isActive(item);
              
              const handleClick = () => {
                if (onClose) onClose();
              };

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={handleClick}
                  className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className={active ? 'text-white' : 'text-gray-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-xs sm:text-sm">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-gray-700/50 flex-shrink-0 mt-auto">
            <ProfileSection onLogout={onLogout} />
          </div>
        </div>
      </aside>
    </>
  );
}
