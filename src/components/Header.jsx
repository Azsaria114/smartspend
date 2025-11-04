import { useLocation } from 'react-router-dom';
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
  onMarkAllAsRead
}) {
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
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/30 shadow-xl w-full">
      {/* Grid Pattern - Matching Homepage */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
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
          </div>
        </div>
      </div>
    </header>
  );
}

