import { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export const TransactionsList = () => {
  const { transactions, filters, setFilters, role, deleteTransaction } = useFinance();
  const [editingId, setEditingId] = useState(null);

  const categories = ['all', 'Salary', 'Freelance', 'Groceries', 'Utilities', 'Dining', 'Entertainment', 'Transport', 'Shopping'];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === 'all' || t.category === filters.category;
      const matchType = filters.type === 'all' || t.type === filters.type;
      return matchSearch && matchCategory && matchType;
    });
  }, [transactions, filters]);

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="transactions-section">
      <h2>Transactions</h2>

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="filter-input"
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <div className="transaction-main">
                <div className="transaction-info">
                  <p className="transaction-description">{transaction.description}</p>
                  <p className="transaction-meta">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
                <div className="transaction-amount">
                  <span className={`amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}₹${Math.abs(transaction.amount)}
                  </span>
                  {role === 'admin' && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(transaction.id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
