import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/insights', icon: '💡', label: 'Insights & AI' },
  ];

  const isActive = (path) => location.pathname === path;

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
              const active = isActive(item.path);
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
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
            
            <div className="pt-4 mt-4 border-t border-white/20">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3 px-4">Quick Access</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (window.addExpenseHandler) window.addExpenseHandler();
                    if (onClose) onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-white/50 hover:text-indigo-600 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  <span className="text-lg">➕</span>
                  <span>Add Expense</span>
                </button>
                <Link
                  to="/insights"
                  onClick={() => {
                    setTimeout(() => {
                      const budgetTab = document.querySelector('[data-tab="budget"]');
                      if (budgetTab) budgetTab.click();
                    }, 100);
                    if (onClose) onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-white/50 hover:text-indigo-600 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  <span className="text-lg">🧮</span>
                  <span>Budget Planner</span>
                </Link>
                <Link
                  to="/insights"
                  onClick={() => {
                    setTimeout(() => {
                      const chatTab = document.querySelector('[data-tab="chat"]');
                      if (chatTab) chatTab.click();
                    }, 100);
                    if (onClose) onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-white/50 hover:text-indigo-600 rounded-xl transition-all duration-200 font-medium text-sm"
                >
                  <span className="text-lg">🤖</span>
                  <span>AI Assistant</span>
                </Link>
              </div>
            </div>
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

