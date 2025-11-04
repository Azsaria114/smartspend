import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: 'Dashboard',
      type: 'link'
    },
    { 
      path: '/insights', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
      <aside className="fixed left-0 top-0 h-screen w-64 lg:w-72 bg-gray-900 z-50 lg:sticky lg:top-0 lg:h-screen border-r border-gray-800">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 sm:px-6 py-4 lg:py-4 border-b border-gray-800 flex-shrink-0 h-16 flex items-center">
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

          {/* Bottom Section */}
          <div className="px-3 sm:px-4 py-4 sm:py-6 border-t border-gray-800 flex-shrink-0 mt-auto">
            <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-500/20">
              <p className="text-xs font-semibold text-gray-300 mb-1">💡 Pro Tip</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Track expenses daily for better insights
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
