import { useState } from 'react';

export default function ExpenseFilters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onFilterChange({ search: value, category: selectedCategory, dateRange });
  };

  const handleCategoryChange = (category) => {
    const newCategory = selectedCategory === category ? '' : category;
    setSelectedCategory(newCategory);
    onFilterChange({ search: searchTerm, category: newCategory, dateRange });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onFilterChange({ search: searchTerm, category: selectedCategory, dateRange: range });
  };

  const categoryIcons = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '💳',
    Entertainment: '🎬',
    Health: '💊',
    Other: '📦'
  };

  return (
    <div className="relative space-y-3">
      {/* Background Design - Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none rounded-lg opacity-50"></div>
      
      <div className="relative z-10 space-y-3">
        {/* Search Bar with Filter Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none text-sm transition-all"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border ${
              showFilters || selectedCategory || dateRange !== 'all'
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-gray-900/50 text-gray-400 border-gray-600/50 hover:bg-gray-800/50 hover:text-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">Filter</span>
            {(selectedCategory || dateRange !== 'all') && (
              <span className="w-2 h-2 bg-white rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Options - Collapsible */}
        {showFilters && (
          <div className="space-y-3 pt-2 border-t border-gray-700/50 animate-fade-in">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Category</label>
              <div className="flex gap-1.5 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-sm">{categoryIcons[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Time Period</label>
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { value: 'all', label: 'All Time', icon: '📅' },
                  { value: 'month', label: 'This Month', icon: '📆' },
                  { value: 'week', label: 'Last Week', icon: '📊' },
                  { value: 'today', label: 'Today', icon: '🔔' }
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => handleDateRangeChange(value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1.5 ${
                      dateRange === value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
