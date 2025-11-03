import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import EnhancedCharts from '../components/EnhancedCharts';
import Sidebar from '../components/Sidebar';
import ExpenseFilters from '../components/ExpenseFilters';
import Modal from '../components/Modal';
import FloatingActionButton from '../components/FloatingActionButton';
import CategoryCards from '../components/CategoryCards';
import GuidedTour from '../components/GuidedTour';
import NotificationCenter from '../components/NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'smartBudget.settings.v1';
function loadBudget() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(currentUser?.uid);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [dateFilter, setDateFilter] = useState('month');

  useEffect(() => {
    if (expenses && expenses.length >= 0) {
      setFilteredExpenses([...expenses]);
    }
  }, [expenses]);

  const budget = loadBudget();
  const monthlyIncome = budget?.monthlyIncome || 0;

  // Notifications
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(expenses, monthlyIncome);

  // Expose handlers globally for sidebar
  useEffect(() => {
    window.addExpenseHandler = () => {
      setEditingExpense(null);
      setShowFormModal(true);
    };
    return () => {
      delete window.addExpenseHandler;
    };
  }, []);

  // Month calculation
  const now = new Date();
  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const monthlyBudgetTotal = useMemo(() => {
    if (!budget?.allocations || !monthlyIncome) return 0;
    const percentSum = Object.values(budget.allocations).reduce((a, b) => a + Number(b || 0), 0);
    return (monthlyIncome * percentSum) / 100;
  }, [budget, monthlyIncome]);

  const availableBalance = monthlyIncome > 0 ? monthlyIncome - thisMonthTotal : 0;
  const budgetProgressPct = monthlyBudgetTotal > 0 
    ? Math.min(100, Math.max(0, (thisMonthTotal / monthlyBudgetTotal) * 100))
    : 0;

  // Category breakdown for chart
  const spendByCategory = useMemo(() => {
    const sums = {};
    thisMonthExpenses.forEach((e) => {
      const cat = e.category || 'Other';
      sums[cat] = (sums[cat] || 0) + (Number(e.amount) || 0);
    });
    return sums;
  }, [thisMonthExpenses]);

  const topCategories = Object.entries(spendByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Recent expenses (last 5)
  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [expenses]);

  const handleFilterChange = (filters) => {
    let filtered = [...expenses];
    
    if (filters.search) {
      filtered = filtered.filter(e => 
        e.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    
    if (filters.dateRange !== 'all') {
      const expenseDate = new Date();
      filtered = filtered.filter(e => {
        const d = new Date(e.date);
        if (filters.dateRange === 'today') {
          return d.toDateString() === expenseDate.toDateString();
        } else if (filters.dateRange === 'week') {
          const diffDays = (expenseDate - d) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        } else if (filters.dateRange === 'month') {
          return d.getMonth() === expenseDate.getMonth() && d.getFullYear() === expenseDate.getFullYear();
        }
        return true;
      });
    }
    
    setFilteredExpenses(filtered);
  };

  const handleSubmit = async (expenseData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
        setEditingExpense(null);
      } else {
        await addExpense(expenseData);
      }
      setEditingExpense(null);
      setShowFormModal(false);
    } catch (error) {
      console.error('Error saving expense:', error);
      alert(`Failed to save expense: ${error.message || 'Please try again.'}`);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowFormModal(true);
  };

  const handleCancel = () => {
    setEditingExpense(null);
    setShowFormModal(false);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 font-medium">Loading your finances...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:static inset-y-0 left-0 z-40`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-xl">☰</span>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <NotificationCenter
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                />
                <button
                  id="add-expense"
                  onClick={() => {
                    setEditingExpense(null);
                    setShowFormModal(true);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <span>+</span>
                  <span className="hidden sm:inline">Add Expense</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
            </h1>
          </div>

          {/* Main Balance Card - Single Source of Truth */}
          <div className="mb-6" id="balance">
            {monthlyIncome > 0 ? (
              <div className="bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/90 text-sm font-medium mb-1">Available Balance</p>
                      <h2 className="text-4xl sm:text-5xl font-bold">₹{availableBalance.toFixed(2)}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-xs mb-1">Monthly Income</p>
                      <p className="text-xl font-semibold">₹{monthlyIncome.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-xs mb-1">Spent This Month</p>
                        <p className="text-lg font-semibold">₹{thisMonthTotal.toFixed(2)}</p>
                      </div>
                      {monthlyBudgetTotal > 0 && (
                        <div className="text-right">
                          <p className="text-white/80 text-xs mb-1">Budget Progress</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  budgetProgressPct >= 100 ? 'bg-red-300' : 
                                  budgetProgressPct >= 80 ? 'bg-yellow-300' : 
                                  'bg-white'
                                }`}
                                style={{ width: `${Math.min(100, budgetProgressPct)}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{budgetProgressPct.toFixed(0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                <div className="relative z-10">
                  <p className="text-white/90 text-sm font-medium mb-2">Total Expenses</p>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-1">₹{thisMonthTotal.toFixed(2)}</h2>
                  <p className="text-white/80 text-sm">{thisMonthExpenses.length} transactions this month</p>
                  <Link 
                    to="/insights"
                    className="inline-block mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Set up budget →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Category Cards */}
          {thisMonthExpenses.length > 0 && (
            <div className="mb-6" id="category-cards">
              <CategoryCards expenses={thisMonthExpenses} monthlyTotal={thisMonthTotal} />
            </div>
          )}

          {/* Main Grid - Each Section Has Unique Purpose */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Spending Analytics - Charts Only */}
            <div className="lg:col-span-2" id="analytics">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Spending Analytics</h3>
                  <Link to="/insights" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                    View All →
                  </Link>
                </div>
                {thisMonthExpenses.length > 0 ? (
                  <EnhancedCharts expenses={thisMonthExpenses} />
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No expenses this month yet</p>
                    <button
                      onClick={() => setShowFormModal(true)}
                      className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Top Categories - Quick Insight */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categories</h3>
              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map(([category, amount], index) => {
                    const percentage = (amount / thisMonthTotal) * 100;
                    const colors = [
                      'bg-orange-500',
                      'bg-blue-500',
                      'bg-purple-500'
                    ];
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">₹{amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of monthly spending</p>
                      </div>
                    );
                  })}
                  <Link 
                    to="/insights"
                    className="block mt-4 text-center text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View All Categories →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No spending yet this month</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions - Limited List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <Link 
                to="/insights" 
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentExpenses.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentExpenses.map((expense) => {
                  const categoryColors = {
                    Food: 'bg-orange-100 text-orange-700',
                    Transport: 'bg-blue-100 text-blue-700',
                    Shopping: 'bg-purple-100 text-purple-700',
                    Bills: 'bg-red-100 text-red-700',
                    Entertainment: 'bg-pink-100 text-pink-700',
                    Health: 'bg-green-100 text-green-700',
                    Other: 'bg-gray-100 text-gray-700'
                  };
                  
                  const categoryIcons = {
                    Food: '🍔',
                    Transport: '🚗',
                    Shopping: '🛍️',
                    Bills: '💳',
                    Entertainment: '🎬',
                    Health: '💊',
                    Other: '📦'
                  };

                  return (
                    <div 
                      key={expense.id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleEdit(expense)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${categoryColors[expense.category] || categoryColors.Other}`}>
                            {categoryIcons[expense.category] || '📦'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{expense.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(expense.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: expense.date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(expense.id);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <p className="text-gray-600 font-medium mb-2">No transactions yet</p>
                <p className="text-sm text-gray-500 mb-4">Start tracking your expenses</p>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Add Your First Expense
                </button>
              </div>
            )}
          </div>

          {/* Filters - Only shown when there are expenses */}
          {expenses.length > 5 && (
            <div className="mt-6">
              <ExpenseFilters onFilterChange={handleFilterChange} />
              <div className="mt-4">
                <ExpenseList
                  expenses={filteredExpenses}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Guided Tour */}
      <GuidedTour />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => {
        setEditingExpense(null);
        setShowFormModal(true);
      }} />

      {/* Expense Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={handleCancel}
        title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
      >
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  );
}
