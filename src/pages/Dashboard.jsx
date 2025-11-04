import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import EnhancedCharts from '../components/EnhancedCharts';
import Sidebar from '../components/Sidebar';
import ExpenseFilters from '../components/ExpenseFilters';
import Modal from '../components/Modal';
import FloatingActionButton from '../components/FloatingActionButton';
import CategoryCards from '../components/CategoryCards';
import GuidedTour from '../components/GuidedTour';
import { useNotifications } from '../hooks/useNotifications';
import Header from '../components/Header';

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
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 lg:h-screen`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Unified Header */}
          <Header
          showNotifications={true}
          showAddExpense={true}
          onAddExpense={() => {
            setEditingExpense(null);
            setShowFormModal(true);
          }}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Greeting */}
            <div className="mb-6 mt-4">
              <h1 className="text-2xl font-semibold text-white">
                {getGreeting()}, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </h1>
            </div>

            {/* Main Balance Card - Single Source of Truth */}
            <div className="mb-6" id="balance">
              {monthlyIncome > 0 ? (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Available Balance</p>
                      <h2 className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-400 mb-1">Monthly Income</p>
                      <p className="text-xl font-semibold text-white">₹{monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Spent This Month</p>
                      <p className="text-lg font-semibold text-white">₹{thisMonthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    {monthlyBudgetTotal > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-gray-400">Budget Progress</p>
                          <span className="text-xs font-medium text-gray-300">{budgetProgressPct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              budgetProgressPct >= 100 ? 'bg-red-500' : 
                              budgetProgressPct >= 80 ? 'bg-yellow-500' : 
                              'bg-gradient-to-r from-indigo-500 to-purple-600'
                            }`}
                            style={{ width: `${Math.min(100, budgetProgressPct)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Total Expenses</p>
                    <h2 className="text-3xl font-bold text-white mb-2">₹{thisMonthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p className="text-sm text-gray-400 mb-4">{thisMonthExpenses.length} transactions this month</p>
                    <Link 
                      to="/insights"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Set up budget
                      <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-white">Spending Analytics</h3>
                  <Link to="/insights" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                    View All →
                  </Link>
                </div>
                {thisMonthExpenses.length > 0 ? (
                  <EnhancedCharts expenses={thisMonthExpenses} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm mb-3 text-gray-400">No expenses this month yet</p>
                    <button
                      onClick={() => setShowFormModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>
        </div>

            {/* Top Categories - Quick Insight */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Top Categories</h3>
              {topCategories.length > 0 ? (
                <div className="space-y-4">
                  {topCategories.map(([category, amount], index) => {
                    const percentage = (amount / thisMonthTotal) * 100;
                    const colors = [
                      'bg-gradient-to-r from-orange-500 to-red-500',
                      'bg-gradient-to-r from-blue-500 to-cyan-500',
                      'bg-gradient-to-r from-purple-500 to-pink-500'
                    ];
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-500'}`}></div>
                            <span className="text-sm font-medium text-gray-300">{category}</span>
                          </div>
                          <span className="text-sm font-bold text-white">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index] || 'bg-gray-500'} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}% of monthly spending</p>
                      </div>
                    );
                  })}
                  <Link 
                    to="/insights"
                    className="block mt-4 text-center text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View All Categories →
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400">No spending yet this month</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions - Limited List */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <Link 
                to="/insights" 
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentExpenses.length > 0 ? (
              <div className="divide-y divide-gray-700">
                {recentExpenses.map((expense) => {
                  const categoryColors = {
                    Food: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
                    Transport: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                    Shopping: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
                    Bills: 'bg-red-500/20 text-red-300 border border-red-500/30',
                    Entertainment: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
                    Health: 'bg-green-500/20 text-green-300 border border-green-500/30',
                    Other: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
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
                      className="p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => handleEdit(expense)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${categoryColors[expense.category] || categoryColors.Other}`}>
                            {categoryIcons[expense.category] || '📦'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate">{expense.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(expense.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: expense.date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-white">₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(expense.id);
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-2">No transactions yet</p>
                <p className="text-sm text-gray-400 mb-4">Start tracking your expenses</p>
                <button
                  onClick={() => setShowFormModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
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
          </div>
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
