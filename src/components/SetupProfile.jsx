import { useState } from 'react';

export default function SetupProfile({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    displayName: '',
    currency: 'INR',
    enableNotifications: true,
    monthlyIncome: ''
  });

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    // Save to localStorage
    const profile = {
      displayName: formData.displayName,
      currency: formData.currency,
      enableNotifications: formData.enableNotifications,
      monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('smartspend.profile', JSON.stringify(profile));
    onNext(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Set Up Your Profile</h1>
          <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150 text-lg"
                placeholder="Enter your name"
                autoFocus
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, currency: curr.code })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.currency === curr.code
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{curr.symbol}</div>
                    <div className="text-xs text-gray-600">{curr.code}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Income (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                  {currencies.find(c => c.code === formData.currency)?.symbol || '₹'}
                </span>
                <input
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-150 text-lg"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This helps us provide better budget recommendations</p>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Enable Notifications
                </label>
                <p className="text-xs text-gray-500">Get alerts for budgets, bills, and spending insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableNotifications}
                  onChange={(e) => setFormData({ ...formData, enableNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Continue →
              </button>
            </div>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

