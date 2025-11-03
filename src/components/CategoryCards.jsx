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
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Spending by Category</h3>
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No expenses yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Spending by Category</h3>
        <Link to="/insights" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((item) => (
          <div
            key={item.category}
            className="group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            {/* Category Icon & Background */}
            <div className={`bg-gradient-to-br ${item.color} p-4 relative`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-white/90 text-xs font-semibold">{item.percentage.toFixed(0)}%</span>
              </div>
              <div className="text-white font-bold text-sm">{item.category}</div>
            </div>

            {/* Amount & Progress */}
            <div className="p-4 bg-white">
              <p className="text-2xl font-bold text-gray-900 mb-2">₹{item.amount.toFixed(2)}</p>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-300`}
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                />
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
}

