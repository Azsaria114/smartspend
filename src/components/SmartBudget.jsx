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

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧮</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Smart Budgeting</h3>
          <p className="text-xs text-gray-600">Set income and category allocations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income (₹)</label>
          <input
            type="number"
            min="0"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="e.g., 50000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
          />

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-800">Category Allocations</span>
              <span className={`text-xs font-semibold ${totalAllocPercent > 100 ? 'text-red-600' : totalAllocPercent < 100 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {totalAllocPercent.toFixed(0)}%
              </span>
            </div>
            <div className="space-y-2">
              {DEFAULT_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="w-24 text-xs text-gray-700">{cat}</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={allocations[cat] ?? 0}
                    onChange={(e) => handleAllocChange(cat, e.target.value)}
                    className="w-20 px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-gray-600">
              Tip: Aim for ~100% total allocation
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEFAULT_CATEGORIES.map((cat, idx) => {
              const target = (monthlyIncomeNumber * (Number(allocations[cat] || 0) / 100));
              const spent = spendByCategory[cat] || 0;
              const pct = progress(spent, target);
              return (
                <div key={cat} className="p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded flex items-center justify-center text-xs text-white ${['bg-indigo-600','bg-purple-600','bg-pink-600','bg-blue-600','bg-emerald-600','bg-amber-600','bg-gray-600'][idx % 7]}`}>{cat[0]}</div>
                      <span className="font-semibold text-gray-900 text-sm">{cat}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">₹{spent.toFixed(0)} / ₹{target.toFixed(0)}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, pct).toFixed(0)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{pct.toFixed(0)}% of budget</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
