import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useAuth } from '../contexts/AuthContext';

// Helper function to save expenses locally when user is not logged in
function saveExpensesLocally(expenses, key) {
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  localStorage.setItem(key, JSON.stringify([...existing, ...expenses]));
}

export default function ImportData({ onNext, onBack, onSkip }) {
  const { currentUser } = useAuth();
  const { addExpense } = useExpenses(currentUser?.uid);
  const [importMethod, setImportMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  // Generate sample expenses
  const generateSampleData = () => {
    const sampleExpenses = [
      { description: 'Groceries', amount: 2500, category: 'Food', daysAgo: 1 },
      { description: 'Uber Ride', amount: 350, category: 'Transport', daysAgo: 2 },
      { description: 'Netflix Subscription', amount: 499, category: 'Entertainment', daysAgo: 5 },
      { description: 'Electricity Bill', amount: 1200, category: 'Bills', daysAgo: 7 },
      { description: 'Restaurant Dinner', amount: 1800, category: 'Food', daysAgo: 3 },
      { description: 'Coffee Shop', amount: 150, category: 'Food', daysAgo: 1 },
      { description: 'Online Shopping', amount: 3200, category: 'Shopping', daysAgo: 4 },
      { description: 'Gym Membership', amount: 800, category: 'Health', daysAgo: 10 },
    ];

    return sampleExpenses.map(exp => {
      const date = new Date();
      date.setDate(date.getDate() - exp.daysAgo);
      return {
        description: exp.description,
        amount: exp.amount,
        category: exp.category,
        date: date.toISOString().split('T')[0]
      };
    });
  };

  const handleImportSample = async () => {
    setLoading(true);
    try {
      const sampleData = generateSampleData();
      
      if (currentUser) {
        // Add expenses to Firebase
        for (const expense of sampleData) {
          await addExpense(expense);
        }
      } else {
        // Store in localStorage for later when user signs up
        saveExpensesLocally(sampleData, 'smartspend.sampleExpenses');
      }
      
      setTimeout(() => {
        setLoading(false);
        onNext();
      }, 1000);
    } catch (error) {
      console.error('Error importing sample data:', error);
      setLoading(false);
      alert('Failed to import sample data. Please try again.');
    }
  };

  const handleCSVImport = async () => {
    if (!csvFile) {
      alert('Please select a CSV file');
      return;
    }

    setLoading(true);
    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers: description, amount, category, date (optional)
      const expenses = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const descriptionIdx = headers.indexOf('description');
        const amountIdx = headers.indexOf('amount');
        const categoryIdx = headers.indexOf('category');
        const dateIdx = headers.indexOf('date');
        
        if (descriptionIdx >= 0 && amountIdx >= 0) {
          const expense = {
            description: values[descriptionIdx] || '',
            amount: parseFloat(values[amountIdx]) || 0,
            category: values[categoryIdx] || 'Other',
            date: values[dateIdx] || new Date().toISOString().split('T')[0]
          };
          expenses.push(expense);
        }
      }

      if (currentUser) {
        for (const expense of expenses) {
          await addExpense(expense);
        }
      } else {
        saveExpensesLocally(expenses, 'smartspend.csvExpenses');
      }

      setTimeout(() => {
        setLoading(false);
        setCsvFile(null);
        onNext();
      }, 1000);
    } catch (error) {
      console.error('Error importing CSV:', error);
      setLoading(false);
      alert('Failed to import CSV. Please check the format and try again.');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('smartspend.onboarding.completed', 'true');
    onSkip();
  };

  if (importMethod === 'sample') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {loading ? (
              <>
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Importing sample data...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-gray-600 font-medium mb-4">Sample data imported successfully!</p>
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Continue to Dashboard →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (importMethod === 'csv') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import from CSV</h2>
            <p className="text-gray-600">Upload a CSV file with your expense data</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CSV File Format
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-2">Required columns:</p>
                <code className="text-xs text-gray-800">description, amount, category, date</code>
                <p className="text-xs text-gray-500 mt-3">Example:</p>
                <pre className="text-xs text-gray-700 mt-1">
{`description, amount, category, date
Groceries, 2500, Food, 2024-01-15
Uber Ride, 350, Transport, 2024-01-14`}
                </pre>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setImportMethod(null)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleCSVImport}
                disabled={loading || !csvFile}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Importing...' : 'Import CSV'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Import Your Data</h1>
          <p className="text-gray-600">Get started quickly by importing your existing expense data</p>
        </div>

        {/* Options Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Sample Data */}
            <button
              onClick={handleImportSample}
              disabled={loading}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sample Data</h3>
              <p className="text-xs text-gray-600">Try the app with example expenses</p>
            </button>

            {/* CSV Import */}
            <button
              onClick={() => setImportMethod('csv')}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">📁</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">CSV Import</h3>
              <p className="text-xs text-gray-600">Upload your expense data</p>
            </button>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-center group"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-3xl">⏭️</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Skip</h3>
              <p className="text-xs text-gray-600">Start from scratch</p>
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            ← Back
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

