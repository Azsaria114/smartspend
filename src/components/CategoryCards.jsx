import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const categoryConfig = {
  Food: { icon: '🍔', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  Transport: { icon: '🚗', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  Shopping: { icon: '🛍️', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  Bills: { icon: '💳', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  Entertainment: { icon: '🎬', color: 'from-pink-500 to-pink-600', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
  Health: { icon: '💊', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  Other: { icon: '📦', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
};

export default function CategoryCards({ expenses, monthlyTotal }) {
  const categoryBreakdown = useMemo(() => {
    const sums = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Other';
      sums[cat] = (sums[cat] || 0) + (Number(e.amount) || 0);
    });
    return sums;
  }, [expenses]);

  const categories = useMemo(() => {
    return Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([category, amount]) => {
        const percentage = monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0;
        const config = categoryConfig[category] || categoryConfig.Other;
        return {
          category,
          amount,
          percentage,
          ...config
        };
      });
  }, [categoryBreakdown, monthlyTotal]);

  if (categories.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No expenses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 shadow-lg relative">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none rounded-lg"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white">Spending by Category</h3>
        <Link to="/insights" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((item) => (
          <div
            key={item.category}
            className="bg-gray-700/40 border border-gray-600/50 rounded-lg p-4 hover:border-gray-500/50 transition-all duration-150 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium text-white text-sm">{item.category}</span>
              </div>
              <span className="text-xs font-medium text-gray-400">{item.percentage.toFixed(0)}%</span>
            </div>
            
            <p className="text-xl font-semibold text-white mb-3">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(100, item.percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

