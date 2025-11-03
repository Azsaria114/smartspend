export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-gray-600 font-medium mb-1">No expenses yet</p>
        <p className="text-sm text-gray-500">Add your first expense to get started!</p>
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
      Food: 'bg-orange-100 text-orange-700 border-orange-200',
      Transport: 'bg-blue-100 text-blue-700 border-blue-200',
      Shopping: 'bg-purple-100 text-purple-700 border-purple-200',
      Bills: 'bg-red-100 text-red-700 border-red-200',
      Entertainment: 'bg-pink-100 text-pink-700 border-pink-200',
      Health: 'bg-green-100 text-green-700 border-green-200',
      Other: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Expenses</h2>
          <span className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            {expenses.length}
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div 
            key={expense.id} 
            className="p-4 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg border ${getCategoryColor(expense.category)} flex-shrink-0`}>
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{expense.description}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(expense.category)} flex-shrink-0`}>
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-3">
                <span className="text-xl font-bold text-gray-900">
                  ₹{expense.amount.toFixed(2)}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Edit expense"
                  >
                    <span className="text-sm">✏️</span>
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
