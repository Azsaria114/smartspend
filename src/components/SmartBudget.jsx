import { useEffect, useMemo, useState } from 'react';

const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Other',
];

const STORAGE_KEY = 'smartBudget.settings.v1';

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export default function SmartBudget({ expenses }) {
  const existing = loadSettings();
  const [monthlyIncome, setMonthlyIncome] = useState(existing?.monthlyIncome || '');
  const [allocations, setAllocations] = useState(() => {
    const base = existing?.allocations;
    if (base) return base;
    // 50/30/20 baseline split across categories (editable)
    const defaults = {
      Savings: 20,
      Essentials: 50,
      Discretionary: 30,
    };
    // Map categories to buckets
    const categoryToBucket = {
      Food: 'Essentials',
      Transport: 'Essentials',
      Shopping: 'Discretionary',
      Bills: 'Essentials',
      Entertainment: 'Discretionary',
      Health: 'Essentials',
      Other: 'Discretionary',
    };
    const result = {};
    DEFAULT_CATEGORIES.forEach((c) => {
      const bucket = categoryToBucket[c] || 'Discretionary';
      const bucketShare = defaults[bucket] / 100;
      // Distribute bucket share evenly among its categories at start
      const countInBucket = DEFAULT_CATEGORIES.filter((cat) => (categoryToBucket[cat] || 'Discretionary') === bucket).length;
      const percent = (bucketShare / Math.max(1, countInBucket)) * 100;
      result[c] = parseFloat(percent.toFixed(2));
    });
    // Savings bucket kept as virtual (not a category here)
    return result;
  });

  // Aggregate spend by category
  const spendByCategory = useMemo(() => {
    const sums = {};
    DEFAULT_CATEGORIES.forEach((c) => (sums[c] = 0));
    for (const e of expenses) {
      const cat = e.category || 'Other';
      sums[cat] = (sums[cat] || 0) + (Number(e.amount) || 0);
    }
    return sums;
  }, [expenses]);

  // Total allocation percent (only visible categories)
  const totalAllocPercent = useMemo(() => {
    return Object.values(allocations).reduce((a, b) => a + Number(b || 0), 0);
  }, [allocations]);

  const monthlyIncomeNumber = Number(monthlyIncome) || 0;

  useEffect(() => {
    saveSettings({ monthlyIncome: monthlyIncomeNumber, allocations });
  }, [monthlyIncomeNumber, allocations]);

  const handleAllocChange = (cat, value) => {
    const num = Math.max(0, Math.min(100, Number(value)));
    setAllocations((prev) => ({ ...prev, [cat]: num }));
  };

  const progress = (spent, budget) => {
    if (budget <= 0) return 0;
    return Math.max(0, Math.min(100, (spent / budget) * 100));
  };

  const categoryColors = [
    'from-orange-500 to-red-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-red-500 to-rose-500',
    'from-pink-500 to-fuchsia-500',
    'from-green-500 to-emerald-500',
    'from-gray-500 to-slate-500',
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Smart Budgeting</h3>
          <p className="text-sm text-gray-400">Set income and category allocations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-gray-700/50 rounded-lg border border-gray-600 p-5">
          <label className="block text-sm font-semibold text-gray-200 mb-3">Monthly Income (₹)</label>
          <input
            type="number"
            min="0"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm text-white placeholder-gray-400"
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-200">Category Allocations</span>
              <span className={`text-sm font-bold ${
                totalAllocPercent > 100 ? 'text-red-400' : 
                totalAllocPercent < 100 ? 'text-yellow-400' : 
                'text-green-400'
              }`}>
                {totalAllocPercent.toFixed(0)}%
              </span>
            </div>
            <div className="space-y-3">
              {DEFAULT_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-24 text-xs text-gray-300 font-medium">{cat}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={allocations[cat] ?? 0}
                    onChange={(e) => handleAllocChange(cat, e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-xs text-gray-400 w-8">%</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-400 bg-gray-600/50 p-3 rounded-lg border border-gray-500">
              💡 Tip: Aim for ~100% total allocation
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-700/50 rounded-lg border border-gray-600 p-5">
          <h4 className="text-sm font-semibold text-gray-200 mb-4">Budget Progress by Category</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_CATEGORIES.map((cat, idx) => {
              const target = (monthlyIncomeNumber * (Number(allocations[cat] || 0) / 100));
              const spent = spendByCategory[cat] || 0;
              const pct = progress(spent, target);
              const colorClass = categoryColors[idx % categoryColors.length];
              return (
                <div key={cat} className="p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-sm font-bold`}>
                        {cat[0]}
                      </div>
                      <span className="font-semibold text-white text-sm">{cat}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      <span className="text-xs text-gray-500">/ ₹{target.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-gray-600 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${colorClass} ${
                        pct >= 100 ? 'from-red-500 to-red-600' : 
                        pct >= 80 ? 'from-yellow-500 to-yellow-600' : 
                        ''
                      }`}
                      style={{ width: `${Math.min(100, pct).toFixed(0)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{pct.toFixed(0)}% of budget</span>
                    {pct >= 100 && (
                      <span className="text-xs text-red-400 font-medium">⚠️ Over budget</span>
                    )}
                    {pct >= 80 && pct < 100 && (
                      <span className="text-xs text-yellow-400 font-medium">⚠️ Near limit</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
