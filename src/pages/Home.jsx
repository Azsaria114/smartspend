import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/30 to-purple-900/30">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.15),transparent_50%)]"></div>
      </div>

      {/* Navigation Bar - Glass Effect & Fixed Sticky */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-white/5">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <span className="text-gray-900 font-bold text-lg">₹</span>
              </div>
              <span className="text-xl font-bold text-white">SmartSpend</span>
            </Link>
            
            {/* Action Button - Right */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>

      {/* Hero Section - Better Alignment */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-16 pt-20 sm:pt-32 pb-20 sm:pb-32">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-300 font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Powered by AI • Free Forever</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Your Money,
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                  Under Control
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                Track every rupee, understand your spending patterns, and get personalized 
                <span className="text-indigo-400 font-semibold"> AI-powered insights</span> to make smarter financial decisions.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
                <Link
                  to="/signup"
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span>Start Tracking Free</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-4 bg-gray-800/50 border-2 border-gray-700 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:border-gray-600 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign In</span>
                </Link>
              </div>
              <p className="text-sm text-gray-400 text-center lg:text-left">
                No credit card required • Set up in 2 minutes
              </p>
            </div>

          </div>

          {/* Right Visual - Dashboard Preview Card */}
          <div className="flex-1 max-w-lg w-full lg:pl-8">
            <div className="relative">
              {/* Main Preview Card */}
              <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">₹</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">SmartSpend</h3>
                      <p className="text-xs text-gray-400">Your Dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>
                </div>

                {/* Balance Card Preview */}
                <div className="bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/20 rounded-xl p-5 border border-indigo-500/30 mb-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-300 mb-1 font-medium">Total Balance</p>
                        <h4 className="text-2xl font-bold text-white">₹58,420</h4>
                      </div>
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-indigo-500/20">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Spent this month</p>
                        <p className="text-sm font-semibold text-white">₹18,230</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-0.5">Saved</p>
                        <p className="text-sm font-semibold text-green-400">₹12,450</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-gray-600/30 hover:border-indigo-500/50 transition-colors">
                    <div className="text-lg font-bold text-white mb-0.5">₹18K</div>
                    <div className="text-xs text-gray-400">Expenses</div>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-gray-600/30 hover:border-indigo-500/50 transition-colors">
                    <div className="text-lg font-bold text-white mb-0.5">12</div>
                    <div className="text-xs text-gray-400">Categories</div>
                  </div>
                  <div className="bg-gray-700/40 rounded-lg p-3 text-center border border-gray-600/30 hover:border-indigo-500/50 transition-colors">
                    <div className="text-lg font-bold text-white mb-0.5">47</div>
                    <div className="text-xs text-gray-400">Transactions</div>
                  </div>
                </div>

                {/* AI Insight Preview */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-indigo-300 font-medium mb-1">AI Insight</p>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Your spending on Food is 15% higher this month. Consider meal planning to save ₹2,500.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl"></div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-1.5 border border-indigo-400/30">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Real-time Updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Better Alignment */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-800/50">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to help you track, analyze, and optimize your spending
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {/* Feature 1 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Tracking</h3>
            <p className="text-gray-400">
              Easily record and categorize your expenses with our intuitive interface. Get insights into where your money goes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Insights</h3>
            <p className="text-gray-400">
              Get personalized financial advice powered by AI. Understand your spending patterns and receive actionable recommendations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Budget Planning</h3>
            <p className="text-gray-400">
              Set budgets for different categories and track your progress. Stay on top of your financial goals with smart alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">₹</span>
              </div>
              <span className="text-gray-400 text-sm">SmartSpend © 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

