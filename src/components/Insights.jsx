import { useMemo } from 'react';
import { Trophy, PiggyBank, BarChart3, TrendingUp, Wallet, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const categorySpending = {};
    expenses.forEach(e => { categorySpending[e.category] = (categorySpending[e.category] || 0) + Math.abs(e.amount); });
    const topCategory = Object.entries(categorySpending).sort(([, a], [, b]) => b - a)[0];

    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const savingsRate = totalIncome > 0 ? Math.round((totalIncome - totalExpenses) / totalIncome * 100) : 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === currentMonth).reduce((s, e) => s + Math.abs(e.amount), 0);
    const lastMonthExpenses = expenses.filter(e => new Date(e.date).getMonth() === lastMonth).reduce((s, e) => s + Math.abs(e.amount), 0);
    const monthChange = lastMonthExpenses > 0 ? Math.round(((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100) : 0;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const months = new Set(transactions.map(t => `${new Date(t.date).getFullYear()}-${new Date(t.date).getMonth()}`));
    const avgMonthlyIncome = months.size > 0 ? Math.round(totalIncome / months.size) : 0;

    const monthActivity = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthActivity[key] = (monthActivity[key] || 0) + 1;
    });
    const mostActive = Object.entries(monthActivity).sort(([, a], [, b]) => b - a)[0];

    return {
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      savingsRate, monthChange, prevMonthName: monthNames[lastMonth],
      avgMonthlyIncome, totalIncome, totalExpenses, netSavings: totalIncome - totalExpenses,
      mostActive: mostActive ? mostActive[0] : 'N/A',
    };
  }, [transactions]);

  const cards = [
    {
      Icon: Trophy, iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)',
      label: 'TOP SPENDING CATEGORY', value: insights.topCategory?.name || 'N/A',
      description: insights.topCategory ? `₹${insights.topCategory.amount.toLocaleString('en-IN')} spent — your biggest expense bucket.` : 'No expense data available',
    },
    {
      Icon: PiggyBank, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)',
      label: 'SAVINGS RATE', value: `${insights.savingsRate}%`,
      description: insights.savingsRate >= 20 ? "Great job! You're saving above the recommended 20% threshold." : 'Try to increase your savings rate to at least 20% of income.',
    },
    {
      Icon: BarChart3, iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)',
      label: 'MONTH-ON-MONTH EXPENSES', value: `${insights.monthChange >= 0 ? '+' : ''}${insights.monthChange}%`,
      description: `Spending change vs ${insights.prevMonthName}. Review discretionary categories.`,
    },
    {
      Icon: TrendingUp, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)',
      label: 'AVG MONTHLY INCOME', value: `₹${insights.avgMonthlyIncome.toLocaleString('en-IN')}`,
      description: 'Average income across all recorded months in your history.',
    },
    {
      Icon: Wallet, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)',
      label: 'NET SAVINGS (ALL TIME)', value: `₹${insights.netSavings.toLocaleString('en-IN')}`,
      description: `Income ₹${insights.totalIncome.toLocaleString('en-IN')} minus expenses ₹${insights.totalExpenses.toLocaleString('en-IN')}.`,
    },
    {
      Icon: Target, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.12)',
      label: 'MOST ACTIVE MONTH', value: insights.mostActive,
      description: 'The month with the highest combined income and expense activity.',
    },
  ];

  return (
    <div style={{ padding: '32px 32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Financial Insights</h1>
        <p style={{ fontSize: 14, marginTop: 4, color: 'var(--text-muted)' }}>Key observations from your data</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            display: 'flex', gap: 16, padding: 20, borderRadius: 16,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)', transition: 'transform 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: card.iconBg,
            }}>
              <card.Icon size={22} color={card.iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>
                {card.label}
              </p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
                {card.value}
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
