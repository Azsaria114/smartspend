import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { 
      path: '/dashboard', 
      icon: '📊', 
      label: 'Dashboard',
      type: 'link'
    },
    { 
      path: '/insights', 
      icon: '🤖', 
      label: 'AI Assistant',
      type: 'tab',
      tab: 'chat'
    },
    { 
      path: '/insights', 
      icon: '🧮', 
      label: 'Budget Planner',
      type: 'tab',
      tab: 'budget'
    },
  ];

  const isActive = (item) => {
    if (item.type === 'tab') {
      // Check if we're on insights page and tab matches
      return location.pathname === '/insights';
    }
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
      <aside className="fixed left-0 top-0 h-full w-72 glass-effect border-r border-white/20 z-50 lg:static lg:z-auto shadow-xl lg:shadow-none">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">₹</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SmartSpend</h1>
                <p className="text-xs text-gray-500">Finance Tracker</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => {
              const active = isActive(item);
              
              const handleClick = () => {
                if (item.type === 'tab' && item.tab) {
                  // Navigate to insights and open specific tab
                  setTimeout(() => {
                    const tab = document.querySelector(`[data-tab="${item.tab}"]`);
                    if (tab) tab.click();
                  }, 100);
                }
                if (onClose) onClose();
              };

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={handleClick}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                    active
                      ? 'sidebar-link-active shadow-md'
                      : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-900 mb-1">💡 Pro Tip</p>
              <p className="text-xs text-indigo-700">
                Track expenses daily for better insights
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

