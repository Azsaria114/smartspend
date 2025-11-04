import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { Link } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseFilters from '../components/ExpenseFilters';
import EnhancedCharts from '../components/EnhancedCharts';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import FloatingActionButton from '../components/FloatingActionButton';
import CategoryCards from '../components/CategoryCards';
import GuidedTour from '../components/GuidedTour';
import { useNotifications } from '../hooks/useNotifications';
import Header from '../components/Header';

function getStorageKey(userId) {
  return userId ? `smartBudget.settings.v1.${userId}` : 'smartBudget.settings.v1';
}

function loadBudget(userId) {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveBudget(budget, userId) {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(budget));
  } catch {}
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(currentUser?.uid);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeInput, setIncomeInput] = useState('');

  useEffect(() => {
    if (expenses && expenses.length >= 0) {
      setFilteredExpenses([...expenses]);
    }
  }, [expenses]);

  const [budget, setBudget] = useState(() => loadBudget(currentUser?.uid));
  const monthlyIncome = budget?.monthlyIncome || 0;
  
  // Reload budget when user changes
  useEffect(() => {
    setBudget(loadBudget(currentUser?.uid));
  }, [currentUser?.uid]);

  // Initialize income input when modal opens
  useEffect(() => {
    if (showIncomeModal) {
      setIncomeInput(budget?.monthlyIncome?.toString() || '');
    }
  }, [showIncomeModal, budget]);

  // Save income handler
  const handleSaveIncome = () => {
    const incomeValue = Number(incomeInput) || 0;
    const updatedBudget = {
      ...budget,
      monthlyIncome: incomeValue,
      allocations: budget?.allocations || {}
    };
    saveBudget(updatedBudget, currentUser?.uid);
    setBudget(updatedBudget); // Update state immediately
    setShowIncomeModal(false);
  };

  // Notifications
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(expenses, monthlyIncome, budget);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-300 font-medium">Loading your finances...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.12),transparent_50%)]"></div>
        
        {/* Additional floating shapes for depth */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/8 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-pink-500/8 rounded-full blur-2xl"></div>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:fixed inset-y-0 left-0 z-40 lg:h-screen`}>
        <Sidebar onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 lg:ml-64 xl:ml-72">
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

          {/* Unified Header - Fixed Sticky */}
          <div className="fixed top-0 left-0 right-0 z-30 lg:left-64 xl:left-72">
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
            />
          </div>

          {/* Spacer for fixed header */}
          <div className="h-16"></div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            {/* Greeting */}
            <div className="mb-4 mt-2">
              <h1 className="text-2xl font-semibold text-white">
                {getGreeting()}, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </h1>
            </div>

            {/* Main Balance Card - Single Source of Truth */}
            <div className="mb-4" id="balance">
              {monthlyIncome > 0 ? (
                <div className="bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-lg border border-indigo-500/30 p-5 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-300 mb-1">Available Balance</p>
                      <h2 className="text-3xl font-bold text-white">₹{availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <p className="text-sm font-medium text-purple-300">Monthly Income</p>
                        <button
                          onClick={() => setShowIncomeModal(true)}
                          className="p-1 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded transition-colors"
                          title="Edit Income"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xl font-semibold text-white">₹{monthlyIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-indigo-500/20">
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
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
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
                  <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg border border-blue-500/30 p-5 shadow-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-300 mb-1">Total Expenses</p>
                      <h2 className="text-3xl font-bold text-white mb-2">₹{thisMonthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                      <p className="text-sm text-gray-400 mb-4">{thisMonthExpenses.length} transactions this month</p>
                      <button
                        onClick={() => setShowIncomeModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Set Monthly Income
                      </button>
                    </div>
                  </div>
                )}
            </div>

          {/* Category Cards */}
          {thisMonthExpenses.length > 0 && (
            <div className="mb-4" id="category-cards">
              <CategoryCards expenses={thisMonthExpenses} monthlyTotal={thisMonthTotal} />
            </div>
          )}

          {/* Main Grid - Each Section Has Unique Purpose */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Spending Analytics - Charts Only */}
            <div className="lg:col-span-2" id="analytics">
              <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-lg border border-purple-500/30 p-5 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Spending Analytics</h3>
                  <Link to="/insights" className="text-sm text-purple-300 hover:text-purple-200 font-medium">
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
            <div className="bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-lg border border-cyan-500/30 p-5 shadow-lg">
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

          {/* Expense Filters & List - Minimal */}
          {expenses.length > 0 && (
            <div className="mt-4">
              <div className="relative bg-gradient-to-br from-gray-800/90 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-xl border border-indigo-500/20 shadow-2xl overflow-hidden">
                {/* Enhanced Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  {/* Filters Section - Compact */}
                  <div className="px-4 py-3.5 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-900/10 to-purple-900/10 backdrop-blur-sm">
                    <ExpenseFilters onFilterChange={handleFilterChange} />
                  </div>
                  
                  {/* Expense List Section - Minimal */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-white">Recent Expenses</h3>
                      <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">{filteredExpenses.length} total</span>
                    </div>
                  
                  {filteredExpenses.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {filteredExpenses.slice(0, showAllExpenses ? filteredExpenses.length : 4).map((expense) => {
                          const categoryConfig = {
                            Food: { icon: '🍔', color: 'text-orange-400' },
                            Transport: { icon: '🚗', color: 'text-blue-400' },
                            Shopping: { icon: '🛍️', color: 'text-purple-400' },
                            Bills: { icon: '💳', color: 'text-red-400' },
                            Entertainment: { icon: '🎬', color: 'text-pink-400' },
                            Health: { icon: '💊', color: 'text-green-400' },
                            Other: { icon: '📦', color: 'text-gray-400' }
                          };
                          
                          const config = categoryConfig[expense.category] || categoryConfig.Other;

                          return (
                            <div 
                              key={expense.id}
                              className="relative bg-gradient-to-r from-gray-800/60 via-gray-800/40 to-gray-800/60 border border-indigo-500/20 rounded-lg p-3 hover:bg-gradient-to-r hover:from-indigo-900/30 hover:via-purple-900/20 hover:to-indigo-900/30 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-200 cursor-pointer group backdrop-blur-sm"
                              onClick={() => handleEdit(expense)}
                            >
                              {/* Subtle glow effect on hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-500/0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                              <div className="relative z-10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className={`text-lg ${config.color}`}>{config.icon}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{expense.description}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-gray-400">{expense.category}</span>
                                      <span className="text-xs text-gray-500">•</span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(expense.date).toLocaleDateString('en-US', { 
                                          month: 'short', 
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 ml-3">
                                  <span className="text-base font-bold text-white">
                                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(expense);
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-all"
                                      title="Edit"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
              <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(expense.id);
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                                      title="Delete"
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
              </button>
                                  </div>
                                </div>
                              </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {filteredExpenses.length > 4 && !showAllExpenses && (
                        <button
                          onClick={() => setShowAllExpenses(true)}
                          className="w-full mt-3 py-2.5 text-sm font-medium text-indigo-300 hover:text-white bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg hover:from-indigo-600/30 hover:to-purple-600/30 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/20"
                        >
                          View All {filteredExpenses.length} Expenses →
                        </button>
                      )}
                      
                      {showAllExpenses && filteredExpenses.length > 4 && (
                        <button
                          onClick={() => setShowAllExpenses(false)}
                          className="w-full mt-3 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-300 border border-gray-600/50 rounded-lg hover:bg-gray-700/50 transition-all"
                        >
                          Show Less
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400">No expenses found</p>
                    </div>
                  )}
                </div>
                </div>
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

        {/* Income Setting Modal */}
        <Modal
          isOpen={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          title="Set Monthly Income"
        >
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Monthly Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={incomeInput}
                onChange={(e) => setIncomeInput(e.target.value)}
                placeholder="e.g., 50000"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-base text-white placeholder-gray-400"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-2">
                Enter your monthly income to track your available balance and budget progress.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowIncomeModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIncome}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Save Income
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

