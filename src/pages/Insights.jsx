import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../hooks/useExpenses';
import { getFinancialAdvice } from '../services/geminiService';
import { Link, useLocation } from 'react-router-dom';
import AIChat from '../components/AIChat';
import SmartBudget from '../components/SmartBudget';
import FormattedAdvice from '../components/FormattedAdvice';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Insights() {
  const { currentUser, logout } = useAuth();
  const { expenses, loading: expensesLoading } = useExpenses(currentUser?.uid);
  const location = useLocation();
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('insights');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync active tab with URL hash for sidebar highlighting
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'chat' || hash === 'budget' || hash === 'insights') {
      setActiveTab(hash);
    } else if (location.pathname === '/insights' && !hash) {
      // Default to insights if no hash
      setActiveTab('insights');
    }
  }, [location.pathname]);

  // Update URL hash when tab changes
  useEffect(() => {
    if (activeTab === 'chat' || activeTab === 'budget') {
      window.location.hash = activeTab;
    } else {
      window.location.hash = '';
    }
  }, [activeTab]);

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
          showNotifications={false}
          showAddExpense={false}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Key Stats */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Total Expenses</p>
                <p className="text-2xl font-bold text-white">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">This Month</p>
                <p className="text-2xl font-bold text-white">₹{thisMonthTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Last 7 Days</p>
                <p className="text-2xl font-bold text-white">₹{last7DaysTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Avg Transaction</p>
                <p className="text-2xl font-bold text-white">₹{avgExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-gray-800 rounded-lg p-1.5 mb-6 border border-gray-700 shadow-lg">
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab('insights')}
                data-tab="insights"
                className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-md ${
                  activeTab === 'insights'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                data-tab="chat"
                className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-md ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                AI Chat
              </button>
              <button
                onClick={() => setActiveTab('budget')}
                data-tab="budget"
                className={`flex-1 px-4 py-2.5 font-medium text-sm transition-all duration-200 rounded-md ${
                  activeTab === 'budget'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Budget Planner
              </button>
            </div>
          </div>

          {expensesLoading ? (
            <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <div className="text-gray-300 font-medium">Loading expenses...</div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="bg-gray-800 p-12 rounded-lg border border-gray-700 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-300 font-medium mb-4">No expenses recorded yet.</p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
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
                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Summary</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">Total Expenses</p>
                          <p className="text-2xl font-bold text-white">
                            ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">Transactions</p>
                          <p className="text-xl font-bold text-white">{expenses.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg border border-gray-700 p-5 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Top Categories</h3>
                      </div>
                      <div className="space-y-2">
                        {topCategories.map(([category, amount], index) => (
                          <div 
                            key={category}
                            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-indigo-500 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium text-white text-sm">{category}</span>
                            </div>
                            <span className="font-bold text-white text-sm">₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={fetchAdvice}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Refresh Insights</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Advice - Story Format Design */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
                      {/* Compact Header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 border-b border-indigo-500/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">Your Financial Story</h3>
                            <p className="text-indigo-100 text-xs mt-0.5">Personalized insights & recommendations</p>
                          </div>
                        </div>
                      </div>

                      {/* Story Content */}
                      <div className="p-5 bg-gray-800">
                        {loading ? (
                          <div className="space-y-3">
                            <div className="h-3 bg-gray-700 rounded w-full animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-5/6 animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-4/6 animate-pulse"></div>
                            <div className="h-3 bg-gray-700 rounded w-full mt-4 animate-pulse"></div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-semibold text-sm">Error</span>
                            </div>
                            <p className="text-xs text-red-200">{error}</p>
                            <button
                              onClick={fetchAdvice}
                              className="mt-3 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs font-medium transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        ) : advice ? (
                          <div className="relative">
                            {/* Story Timeline */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent"></div>
                            
                            <div className="pl-6 space-y-4">
                              <FormattedAdvice advice={advice} />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h4 className="text-base font-semibold text-white mb-1">Ready for Insights?</h4>
                            <p className="text-gray-400 text-xs">Click "Refresh Insights" to get your personalized financial story</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* API Setup Info */}
                    {(!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'your-gemini-api-key-here') && (
                      <div className="bg-blue-900/30 border border-blue-500/50 p-5 rounded-lg mt-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="font-semibold text-blue-300 mb-2 text-sm">Enable Real AI Insights</p>
                            <p className="text-xs text-blue-400 leading-relaxed">
                              Add your Gemini API key to the <code className="bg-blue-900/50 px-1.5 py-0.5 rounded font-mono text-xs text-blue-200">.env</code> file as <code className="bg-blue-900/50 px-1.5 py-0.5 rounded font-mono text-xs text-blue-200">VITE_GEMINI_API_KEY</code> for personalized AI-powered financial advice.
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
                  <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg" style={{ height: '600px' }}>
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
          </div>
        </main>
      </div>
    </div>
  );
}
