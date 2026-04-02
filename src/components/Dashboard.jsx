import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Charts } from './Charts';
import { Header } from './Header';
import { Insights } from './Insights';
import { SummaryCard } from './SummaryCard';
import { TransactionsList } from './TransactionsList';

export const Dashboard = () => {
  const { transactions } = useFinance();

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const balance = income - expenses;

    return {
      balance: balance.toFixed(2),
      income: income.toFixed(2),
      expenses: expenses.toFixed(2),
    };
  }, [transactions]);

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-main">
        {/* Summary Cards */}
        <section className="summary-section">
          <SummaryCard
            title="Total Balance"
            amount={`₹${summary.balance}`}
            icon="💳"
            trend={{ direction: 'up', value: 12 }}
          />
          <SummaryCard
            title="Total Income"
            amount={`₹${summary.income}`}
            icon="📈"
          />
          <SummaryCard
            title="Total Expenses"
            amount={`-₹${summary.expenses}`}
            icon="📉"
          />
        </section>

        {/* Charts */}
        <Charts />

        {/* Insights */}
        <Insights />

        {/* Transactions */}
        <TransactionsList />
      </main>
    </div>
  );
};
