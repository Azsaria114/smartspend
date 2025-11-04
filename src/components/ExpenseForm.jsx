import { useState, useEffect } from 'react';

export default function ExpenseForm({ expense, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (expense) {
      // Editing existing expense
      let dateStr = new Date().toISOString().split('T')[0];
      if (expense.date) {
        const expenseDate = expense.date instanceof Date 
          ? expense.date 
          : new Date(expense.date);
        if (!isNaN(expenseDate.getTime())) {
          dateStr = expenseDate.toISOString().split('T')[0];
        }
      }
      
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: dateStr
      });
    } else {
      // Reset form when not editing
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    
    onSubmit({
      ...formData,
      amount: amount,
      date: formData.date // Pass as string, will be converted to Timestamp in hook
    });
    
    // Don't reset here - let parent handle form visibility
    // Reset will happen in useEffect when expense becomes null
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150"
            placeholder="e.g., Coffee, Groceries, Uber..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 cursor-pointer"
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💳 Bills</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Health">💊 Health</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            {expense ? 'Update Expense' : 'Add Expense'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 bg-gray-700 text-gray-300 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm border border-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
