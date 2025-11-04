import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';

export default function Header({ 
  title,
  subtitle,
  showNotifications = true,
  showAddExpense = true,
  onAddExpense,
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onLogout
}) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Determine title and subtitle based on route if not provided
  const getPageInfo = () => {
    if (title) return { title, subtitle };
    
    if (location.pathname === '/dashboard') {
      return {
        title: 'Dashboard',
        subtitle: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      };
    }
    if (location.pathname === '/insights') {
      return {
        title: 'Insights',
        subtitle: 'AI-powered financial analysis'
      };
    }
    return { title: 'SmartSpend', subtitle: '' };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30 shadow-lg w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-16">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{pageInfo.title}</h2>
              {pageInfo.subtitle && (
                <p className="text-xs sm:text-sm text-gray-400 truncate mt-0.5">{pageInfo.subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {showNotifications && notifications && (
              <NotificationCenter
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={onMarkAsRead}
                onMarkAllAsRead={onMarkAllAsRead}
              />
            )}
            
            {showAddExpense && onAddExpense && (
              <button
                id="add-expense"
                onClick={onAddExpense}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add Expense</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-700">
              <div className="hidden lg:block text-right">
                <p className="text-xs text-gray-400 mb-0.5">Welcome back</p>
                <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                  {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                </p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 transition-all cursor-pointer">
                  {currentUser?.displayName?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-all flex-shrink-0 group"
                title="Logout"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

