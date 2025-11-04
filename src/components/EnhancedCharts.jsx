import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6366f1',
  categories: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#6b7280']
};

export default function EnhancedCharts({ expenses }) {
  const [expandedChart, setExpandedChart] = useState('pie'); // 'pie', 'line', 'bar', null

  const categoryData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }));
  }, [expenses]);

  // Monthly trend data
  const monthlyData = useMemo(() => {
    const monthlyTotals = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthLabel, amount: 0, count: 0 };
      }
      acc[monthKey].amount += expense.amount;
      acc[monthKey].count += 1;
      return acc;
    }, {});

    return Object.values(monthlyTotals)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  }, [expenses]);

  // Daily trend (last 30 days)
  const dailyData = useMemo(() => {
    const now = new Date();
    const dailyTotals = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays < 30) {
        const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyTotals[dateKey]) {
          dailyTotals[dateKey] = 0;
        }
        dailyTotals[dateKey] += expense.amount;
      }
    });

    return Object.entries(dailyTotals)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2))
      }));
  }, [expenses]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 text-center">
        <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📊</span>
        </div>
        <p className="text-gray-300 text-sm">Add expenses to see analytics</p>
      </div>
    );
  }

  const ChartSection = ({ title, icon, children, chartType }) => {
    const isExpanded = expandedChart === chartType;
    
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/30 transition-colors"
          onClick={() => setExpandedChart(isExpanded ? null : chartType)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h3 className="text-base font-semibold text-white">{title}</h3>
          </div>
          <button className="text-gray-400 hover:text-gray-300">
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        {isExpanded && (
          <div className="p-4 border-t border-gray-700/50">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Category Breakdown Pie Chart */}
      <ChartSection title="Expenses by Category" icon="📊" chartType="pie">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                color: '#f3f4f6'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartSection>

      {/* Monthly Trend Line Chart */}
      {monthlyData.length > 0 && (
        <ChartSection title="Monthly Spending Trend" icon="📈" chartType="line">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#f3f4f6'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke={COLORS.positive} 
                fill={COLORS.positive}
                fillOpacity={0.2}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke={COLORS.positive} 
                strokeWidth={2}
                dot={{ fill: COLORS.positive, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartSection>
      )}

      {/* Daily Expenses Bar Chart */}
      {dailyData.length > 0 && (
        <ChartSection title="Daily Expenses (Last 30 Days)" icon="📅" chartType="bar">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
              />
              <Tooltip 
                formatter={(value) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#f3f4f6'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill={COLORS.neutral}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
      )}

      {/* Summary Stats */}
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-lg font-bold text-white">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Transactions</p>
            <p className="text-lg font-bold text-white">{expenses.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Avg. Transaction</p>
            <p className="text-lg font-bold text-white">
              ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

