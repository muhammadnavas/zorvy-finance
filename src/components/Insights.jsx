import { useMemo } from 'react';
import { Trophy, PiggyBank, BarChart3, TrendingUp, Wallet, Target } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Insights = ({ isMobile }) => {
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
    { Icon: Trophy, iconColor: '#f59e0b', iconBg: 'rgba(245,158,11,0.12)', label: 'TOP SPENDING CATEGORY', value: insights.topCategory?.name || 'N/A', description: insights.topCategory ? `₹${insights.topCategory.amount.toLocaleString('en-IN')} spent` : 'No data' },
    { Icon: PiggyBank, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)', label: 'SAVINGS RATE', value: `${insights.savingsRate}%`, description: insights.savingsRate >= 20 ? "Above 20% threshold" : 'Below 20% target' },
    { Icon: BarChart3, iconColor: '#8b5cf6', iconBg: 'rgba(139,92,246,0.12)', label: 'MOM EXPENSES', value: `${insights.monthChange >= 0 ? '+' : ''}${insights.monthChange}%`, description: `vs ${insights.prevMonthName}` },
    { Icon: TrendingUp, iconColor: '#3b82f6', iconBg: 'rgba(59,130,246,0.12)', label: 'AVG MONTHLY INCOME', value: `₹${insights.avgMonthlyIncome.toLocaleString('en-IN')}`, description: 'Across all months' },
    { Icon: Wallet, iconColor: '#10b981', iconBg: 'rgba(16,185,129,0.12)', label: 'NET SAVINGS (ALL TIME)', value: `₹${insights.netSavings.toLocaleString('en-IN')}`, description: `₹${insights.totalIncome.toLocaleString('en-IN')} − ₹${insights.totalExpenses.toLocaleString('en-IN')}` },
    { Icon: Target, iconColor: '#ef4444', iconBg: 'rgba(239,68,68,0.12)', label: 'MOST ACTIVE MONTH', value: insights.mostActive, description: 'Highest transaction count' },
  ];

  const pad = isMobile ? 16 : 32;

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: isMobile ? 20 : 32 }}>
        <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Financial Insights</h1>
        <p style={{ fontSize: 14, marginTop: 4, color: 'var(--text-muted)' }}>Key observations from your data</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? 10 : 16,
      }}>
        {cards.map((card) => (
          <div key={card.label} style={{
            display: 'flex', gap: isMobile ? 12 : 16, padding: isMobile ? 16 : 20, borderRadius: 16,
            background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)',
          }}>
            <div style={{
              width: isMobile ? 42 : 48, height: isMobile ? 42 : 48, borderRadius: 12, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: card.iconBg,
            }}>
              <card.Icon size={isMobile ? 20 : 22} color={card.iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase' }}>
                {card.label}
              </p>
              <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                {card.value}
              </p>
              <p style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--text-secondary)', margin: 0 }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
