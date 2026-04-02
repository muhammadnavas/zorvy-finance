import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

export const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categorySpending = {};
    
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + Math.abs(t.amount);
    });

    const highest = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
    const totalExpenses = Object.values(categorySpending).reduce((a, b) => a + b, 0);
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const avgExpense = expenses.length > 0 ? (totalExpenses / expenses.length).toFixed(2) : 0;

    return {
      highest,
      totalExpenses,
      totalIncome,
      avgExpense,
      expenseCount: expenses.length,
    };
  }, [transactions]);

  return (
    <div className="insights-section">
      <h2>Financial Insights</h2>
      
      <div className="insights-grid">
        <div className="insight-card">
          <p className="insight-label">Highest Spending Category</p>
          <p className="insight-value">
            {insights.highest ? `${insights.highest[0]} (₹${insights.highest[1].toFixed(2)})` : 'No data'}
          </p>
        </div>

        <div className="insight-card">
          <p className="insight-label">Average Expense</p>
          <p className="insight-value">₹${insights.avgExpense}</p>
        </div>

        <div className="insight-card">
          <p className="insight-label">Total Income (Shown)</p>
          <p className="insight-value insight-income">₹${insights.totalIncome.toFixed(2)}</p>
        </div>

        <div className="insight-card">
          <p className="insight-label">Total Expenses (Shown)</p>
          <p className="insight-value insight-expense">₹${insights.totalExpenses.toFixed(2)}</p>
        </div>
      </div>

      <div className="insight-note">
        <p>💡 Try to maintain a balance between income and expenses. Monitor your highest spending categories to optimize your budget.</p>
      </div>
    </div>
  );
};
