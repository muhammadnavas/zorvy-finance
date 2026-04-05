import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import { TrendingUp, TrendingDown, PiggyBank, Star, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryIcon } from './CategoryIcon';

const DONUT_COLORS = ['#ef4444', '#8b5cf6', '#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];



const formatCurrency = (val) => {
  if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (Math.abs(val) >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const formatFullCurrency = (val) => `₹${Math.abs(val).toLocaleString('en-IN')}`;

// ── Custom Recharts Tooltip ──────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      color: 'var(--text-primary)', borderRadius: 8, padding: '8px 12px',
      fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {formatFullCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

// ── Card wrapper ─────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--card-shadow)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ...style,
  }}>
    {children}
  </div>
);

export const Dashboard = () => {
  const { transactions, computed, setActiveView } = useFinance();
  const { totalIncome, totalExpenses, netSavings, savingsRate, incomeCount, expenseCount, monthlyData, categoryData } = computed;

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);
  }, [transactions]);

  const totalExpenseForDonut = categoryData.reduce((s, c) => s + c.value, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const summaryCards = [
    { title: 'TOTAL INCOME',   value: formatFullCurrency(totalIncome),   sub: `${incomeCount} transactions`,  Icon: TrendingUp,   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { title: 'TOTAL EXPENSES', value: formatFullCurrency(totalExpenses), sub: `${expenseCount} transactions`, Icon: TrendingDown,  color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { title: 'NET SAVINGS',    value: formatFullCurrency(netSavings),    sub: `${savingsRate}% of income`,    Icon: PiggyBank,     color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { title: 'CIVIL SCORE',    value: '100',                             sub: 'Based on spending habits',     Icon: Star,          color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ];

  return (
    <div style={{ padding: '32px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {greeting}, User
        </h1>
        <p style={{ fontSize: 14, marginTop: 4, color: 'var(--text-muted)' }}>
          Here's your financial overview
        </p>
      </div>

      {/* ── Summary Cards ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: 'var(--text-muted)', margin: 0 }}>
                {card.title}
              </p>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <card.Icon size={18} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              {card.value}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{card.sub}</p>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 32 }}>
        {/* Monthly Cash Flow */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Monthly Cash Flow</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Income vs Expenses over time</p>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2}
                  fillOpacity={1} fill="url(#incomeGrad)" dot={{ r: 3, fill: '#10b981' }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2}
                  fillOpacity={1} fill="url(#expenseGrad)" dot={{ r: 3, fill: '#ef4444' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Breakdown Donut */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Spending Breakdown</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>By category</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Donut */}
            <div style={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} strokeWidth={0}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => formatFullCurrency(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatCurrency(totalExpenseForDonut)}
                </span>
              </div>
            </div>
            {/* Legend */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 160, overflowY: 'auto', paddingRight: 4 }}>
              {categoryData.map((cat, i) => (
                <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0, background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {Math.round((cat.value / totalExpenseForDonut) * 100)}%
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {formatCurrency(cat.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Bottom Row ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Recent Transactions */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Transactions</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Latest activity</p>
            </div>
            <button
              onClick={() => setActiveView('transactions')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 500, color: 'var(--accent)',
              }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentTransactions.map(t => (
              <div key={t.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12, cursor: 'default',
                transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  background: t.type === 'income' ? 'var(--accent-light)' : 'var(--danger-light)',
                }}>
                  <CategoryIcon category={t.category} type={t.type} size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.description}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p style={{
                  fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', margin: 0,
                  color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)',
                }}>
                  {t.type === 'income' ? '+' : '−'}{formatFullCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Net Balance by Month */}
        <Card>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Net Balance by Month</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Monthly savings trend</p>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="netBalance" name="Net Balance" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {monthlyData.map((entry, i) => (
                    <Cell key={i} fill={entry.netBalance >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
