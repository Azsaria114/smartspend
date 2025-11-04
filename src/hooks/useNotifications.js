import { useState, useEffect } from 'react';

export function useNotifications(expenses, monthlyIncome, budget = null) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newNotifications = [];
    const now = new Date();
    const thisMonth = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisMonthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);

    // Budget alerts
    if (budget && monthlyIncome > 0) {
      const percentSum = Object.values(budget.allocations || {}).reduce((a, b) => a + Number(b || 0), 0);
      const monthlyBudgetTotal = (monthlyIncome * percentSum) / 100;
      const budgetProgress = monthlyBudgetTotal > 0 ? (thisMonthTotal / monthlyBudgetTotal) * 100 : 0;

      if (budgetProgress >= 100) {
        newNotifications.push({
          id: 'budget-exceeded',
          type: 'danger',
          title: 'Budget Exceeded!',
          message: `You've exceeded your monthly budget by ₹${(thisMonthTotal - monthlyBudgetTotal).toFixed(2)}`,
          timestamp: new Date(),
          read: false,
        });
      } else if (budgetProgress >= 80) {
        newNotifications.push({
          id: 'budget-warning',
          type: 'warning',
          title: 'Budget Warning',
          message: `You've used ${budgetProgress.toFixed(0)}% of your monthly budget. Consider reducing expenses.`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    // Spending nudge (if spending too much on single category)
    const categoryTotals = {};
    thisMonth.forEach(e => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + e.amount;
    });
    
    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (topCategory && thisMonthTotal > 0) {
      const categoryPercentage = (topCategory[1] / thisMonthTotal) * 100;
      if (categoryPercentage > 50 && thisMonthTotal > 5000) {
        newNotifications.push({
          id: 'category-spending',
          type: 'info',
          title: 'Spending Insight',
          message: `${topCategory[0]} accounts for ${categoryPercentage.toFixed(0)}% of your spending this month. Consider diversifying your expenses.`,
          timestamp: new Date(),
          read: false,
        });
      }
    }

    // Bill reminder (check for recurring expenses)
    const lastWeek = expenses.filter(e => {
      const d = new Date(e.date);
      return (now - d) / (1000 * 60 * 60 * 24) <= 7;
    });
    
    const billCategories = ['Bills'];
    const recentBills = lastWeek.filter(e => billCategories.includes(e.category));
    if (recentBills.length === 0 && thisMonth.length > 5) {
      newNotifications.push({
        id: 'bill-reminder',
        type: 'info',
        title: 'Bill Reminder',
        message: 'No bills recorded this week. Make sure all your bills are paid!',
        timestamp: new Date(),
        read: false,
      });
    }

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.filter(n => !n.read).length);
  }, [expenses, monthlyIncome, budget]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}

