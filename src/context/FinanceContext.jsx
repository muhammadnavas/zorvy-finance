import React, { createContext, useCallback, useState } from 'react';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [role, setRole] = useState('viewer'); // 'viewer' or 'admin'
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-04-01', amount: 2500, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: 2, date: '2026-03-28', amount: -150, category: 'Groceries', type: 'expense', description: 'Weekly groceries' },
    { id: 3, date: '2026-03-25', amount: -45, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
    { id: 4, date: '2026-03-20', amount: -200, category: 'Utilities', type: 'expense', description: 'Electric bill' },
    { id: 5, date: '2026-03-18', amount: -120, category: 'Dining', type: 'expense', description: 'Restaurant' },
    { id: 6, date: '2026-03-15', amount: -80, category: 'Transport', type: 'expense', description: 'Gas' },
    { id: 7, date: '2026-03-12', amount: 1200, category: 'Freelance', type: 'income', description: 'Project payment' },
    { id: 8, date: '2026-03-10', amount: -300, category: 'Shopping', type: 'expense', description: 'Clothes' },
    { id: 9, date: '2026-03-08', amount: -50, category: 'Groceries', type: 'expense', description: 'Shopping' },
    { id: 10, date: '2026-03-05', amount: -180, category: 'Entertainment', type: 'expense', description: 'Concert' },
  ]);

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    startDate: null,
    endDate: null,
  });

  const addTransaction = useCallback((transaction) => {
    if (role === 'admin') {
      setTransactions(prev => [{
        id: Math.max(...prev.map(t => t.id), 0) + 1,
        ...transaction,
      }, ...prev]);
    }
  }, [role]);

  const editTransaction = useCallback((id, updates) => {
    if (role === 'admin') {
      setTransactions(prev =>
        prev.map(t => t.id === id ? { ...t, ...updates } : t)
      );
    }
  }, [role]);

  const deleteTransaction = useCallback((id) => {
    if (role === 'admin') {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, [role]);

  const value = {
    role,
    setRole,
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    filters,
    setFilters,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = React.useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
