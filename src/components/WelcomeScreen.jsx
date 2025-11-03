import { Link } from 'react-router-dom';

export default function WelcomeScreen({ onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-xl mx-auto mb-6 animate-scale">
            <span className="text-white font-bold text-5xl">₹</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">SmartSpend</h1>
          <p className="text-xl text-gray-600">Your Intelligent Financial Companion</p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Take Control of Your Finances</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Track Expenses</h3>
              <p className="text-sm text-gray-600">Monitor your spending with detailed analytics and insights</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-sm text-gray-600">Get personalized financial advice powered by AI</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Smart Budgeting</h3>
              <p className="text-sm text-gray-600">Plan and stick to your budget with intelligent tracking</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold text-indigo-900">SmartSpend</span> helps you understand your spending habits, 
              identify savings opportunities, and make smarter financial decisions. 
              Get started in less than 2 minutes!
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Started →
          </button>
          <Link
            to="/login"
            className="px-8 py-4 bg-white text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg border border-gray-200"
          >
            Sign In
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

