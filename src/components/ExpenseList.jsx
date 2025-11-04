export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 text-center">
        <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-gray-300 font-medium mb-1">No expenses yet</p>
        <p className="text-sm text-gray-400">Add your first expense to get started!</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛍️',
      Bills: '💳',
      Entertainment: '🎬',
      Health: '💊',
      Other: '📦'
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      Transport: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      Shopping: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      Bills: 'bg-red-500/20 text-red-300 border-red-500/30',
      Entertainment: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      Health: 'bg-green-500/20 text-green-300 border-green-500/30',
      Other: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="bg-gray-700/30 px-4 py-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Expenses</h2>
          <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-500/30">
            {expenses.length}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-700/50">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="p-4 hover:bg-gray-700/30 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border ${getCategoryColor(expense.category)} flex-shrink-0`}>
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-base truncate">{expense.description}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(expense.category)} flex-shrink-0`}>
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-3">
                <span className="text-xl font-bold text-white">
                  ₹{expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors"
                    title="Edit expense"
                  >
                    <span className="text-sm">✏️</span>
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete expense"
                  >
                    <span className="text-sm">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
