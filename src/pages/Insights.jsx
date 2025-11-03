import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { getFinancialAdvice } from '../services/geminiService';
import { Link } from 'react-router-dom';
import AIChat from '../components/AIChat';
import SmartBudget from '../components/SmartBudget';
import FormattedAdvice from '../components/FormattedAdvice';
import Sidebar from '../components/Sidebar';

export default function Insights() {
  const { currentUser, logout } = useAuth();
  const { expenses, loading: expensesLoading } = useExpenses(currentUser?.uid);
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('insights');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const financialAdvice = await getFinancialAdvice(expenses);
      setAdvice(financialAdvice);
    } catch (err) {
      setError('Failed to generate financial advice. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [expenses]);

  useEffect(() => {
    if (expenses.length > 0 && activeTab === 'insights') {
      fetchAdvice();
    }
  }, [expenses, fetchAdvice, activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Calculate statistics
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  // Month & last 7 days
  const now = new Date();
  const thisMonth = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const last7Days = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return (now - expenseDate) / (1000 * 60 * 60 * 24) <= 7;
  });
  const last7DaysTotal = last7Days.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block fixed lg:static inset-y-0 left-0 z-40`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 shadow-sm">
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
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Insights & AI
                  </h2>
                  <p className="text-xs text-gray-500">Smart financial analysis</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Dashboard
                </Link>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500">Welcome back</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </p>
                </div>
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Key Stats */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in">
              <div className="stat-card card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Expenses</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalSpent.toFixed(2)}</p>
                </div>
              </div>
              <div className="stat-card card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">₹{thisMonthTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="stat-card card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Last 7 Days</p>
                  <p className="text-3xl font-bold text-gray-900">₹{last7DaysTotal.toFixed(2)}</p>
                </div>
              </div>
              <div className="stat-card card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Avg Transaction</p>
                  <p className="text-3xl font-bold text-gray-900">₹{avgExpense.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl p-2 mb-6 shadow-sm border border-gray-100 animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('insights')}
                data-tab="insights"
                className={`flex-1 px-4 py-3 font-semibold text-sm transition-all duration-200 rounded-xl ${
                  activeTab === 'insights'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📊 Insights
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                data-tab="chat"
                className={`flex-1 px-4 py-3 font-semibold text-sm transition-all duration-200 rounded-xl ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                💬 AI Chat
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                data-tab="budget"
                className={`flex-1 px-4 py-3 font-semibold text-sm transition-all duration-200 rounded-xl ${
                  activeTab === 'budget'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🧮 Budget Planner
              </button>
            </div>
          </div>

          {expensesLoading ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <div className="text-gray-600 font-medium">Loading expenses...</div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <p className="text-gray-600 font-medium mb-4">No expenses recorded yet.</p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Add your first expense to get AI insights →
              </Link>
            </div>
          ) : (
            <>
              {activeTab === 'insights' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sidebar Stats */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📊</span>
                        <h3 className="text-base font-bold text-gray-900">Summary</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Total Expenses</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{totalSpent.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Transactions</p>
                          <p className="text-xl font-bold text-gray-900">{expenses.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🏆</span>
                        <h3 className="text-base font-bold text-gray-900">Top Categories</h3>
                      </div>
                      <div className="space-y-2">
                        {topCategories.map(([category, amount], index) => (
                          <div 
                            key={category}
                            className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-900 text-sm">{category}</span>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">₹{amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={fetchAdvice}
                      disabled={loading}
                      className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>🔄</span>
                          <span>Refresh Insights</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Advice - Improved Readability */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-indigo-600 p-4 border-b border-indigo-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">✨</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">Personalized Financial Advice</h3>
                            <p className="text-indigo-100 text-xs mt-0.5">AI-powered insights tailored to your spending</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white">
                        {loading ? (
                          <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mt-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">⚠️</span>
                              <span className="font-semibold text-sm">Error</span>
                            </div>
                            <p className="text-sm">{error}</p>
                          </div>
                        ) : advice ? (
                          <div className="max-w-none">
                            <FormattedAdvice advice={advice} />
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Click "Refresh Insights" to generate advice</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* API Setup Info */}
                    {(!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'your-gemini-api-key-here') && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">💡</span>
                          <div>
                            <p className="font-semibold text-blue-900 mb-1 text-sm">Enable Real AI Insights</p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                              Add your Gemini API key to the <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file as <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono text-xs">VITE_GEMINI_API_KEY</code> for personalized AI-powered financial advice.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
                    <AIChat expenses={expenses} />
                  </div>
                </div>
              )}

              {activeTab === 'budget' && (
                <div>
                  <SmartBudget expenses={expenses} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
