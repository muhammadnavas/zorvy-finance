import React, { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react';

const FinanceContext = createContext();

// ── Seed data ───────────────────────────────────────────────
const SEED_TRANSACTIONS = [
  { id: 1,  date: '2026-06-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 2,  date: '2026-06-22', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 3,  date: '2026-06-20', amount: -2800,  category: 'Entertainment', type: 'expense', description: 'Movie & Dinner' },
  { id: 4,  date: '2026-06-18', amount: -800,   category: 'Health',        type: 'expense', description: 'Pharmacy' },
  { id: 5,  date: '2026-06-14', amount: -4200,  category: 'Shopping',      type: 'expense', description: 'Monsoon Shopping' },
  { id: 6,  date: '2026-06-12', amount: -2800,  category: 'Utilities',     type: 'expense', description: 'Electricity Bill' },
  { id: 7,  date: '2026-06-10', amount: 35000,  category: 'Freelance',     type: 'income',  description: 'Freelance Project' },
  { id: 8,  date: '2026-05-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 9,  date: '2026-05-20', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 10, date: '2026-05-18', amount: -15000, category: 'Rent',          type: 'expense', description: 'House Rent' },
  { id: 11, date: '2026-05-15', amount: -3500,  category: 'Food & Dining', type: 'expense', description: 'Restaurant Dinners' },
  { id: 12, date: '2026-05-12', amount: -2000,  category: 'Transport',     type: 'expense', description: 'Cab & Metro' },
  { id: 13, date: '2026-05-08', amount: 25000,  category: 'Freelance',     type: 'income',  description: 'UI Design Project' },
  { id: 14, date: '2026-04-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 15, date: '2026-04-22', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 16, date: '2026-04-18', amount: -15000, category: 'Rent',          type: 'expense', description: 'House Rent' },
  { id: 17, date: '2026-04-15', amount: -6000,  category: 'Shopping',      type: 'expense', description: 'Summer Clothes' },
  { id: 18, date: '2026-04-10', amount: -4500,  category: 'Food & Dining', type: 'expense', description: 'Groceries & Dining' },
  { id: 19, date: '2026-04-05', amount: -1200,  category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
  { id: 20, date: '2026-03-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 21, date: '2026-03-20', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 22, date: '2026-03-18', amount: -15000, category: 'Rent',          type: 'expense', description: 'House Rent' },
  { id: 23, date: '2026-03-12', amount: -8500,  category: 'Shopping',      type: 'expense', description: 'Electronics' },
  { id: 24, date: '2026-03-08', amount: -3200,  category: 'Food & Dining', type: 'expense', description: 'Weekend Dining' },
  { id: 25, date: '2026-03-05', amount: 15000,  category: 'Freelance',     type: 'income',  description: 'Blog Writing' },
  { id: 26, date: '2026-02-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 27, date: '2026-02-20', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 28, date: '2026-02-18', amount: -15000, category: 'Rent',          type: 'expense', description: 'House Rent' },
  { id: 29, date: '2026-02-14', amount: -5500,  category: 'Shopping',      type: 'expense', description: "Valentine's Gift" },
  { id: 30, date: '2026-02-10', amount: -2500,  category: 'Health',        type: 'expense', description: 'Doctor Checkup' },
  { id: 31, date: '2026-01-25', amount: 120000, category: 'Salary',        type: 'income',  description: 'Monthly Salary' },
  { id: 32, date: '2026-01-20', amount: -10000, category: 'Investment',    type: 'expense', description: 'Mutual Fund SIP' },
  { id: 33, date: '2026-01-18', amount: -15000, category: 'Rent',          type: 'expense', description: 'House Rent' },
  { id: 34, date: '2026-01-12', amount: -7000,  category: 'Shopping',      type: 'expense', description: 'Winter Sale Shopping' },
  { id: 35, date: '2026-01-05', amount: -1800,  category: 'Transport',     type: 'expense', description: 'Train Tickets' },
  { id: 36, date: '2026-01-02', amount: 20000,  category: 'Freelance',     type: 'income',  description: 'New Year Project' },
];

const SEED_DEBTS = [
  { id: 1, name: 'Home Loan',     totalAmount: 4500000, currentBalance: 3850000, interestRate: 8.5, type: 'loan',        dueDate: 5,  emi: 35000 },
  { id: 2, name: 'HDFC Regalia',  totalAmount: 500000,  currentBalance: 42000,   interestRate: 36,  type: 'credit_card', dueDate: 20, emi: 0 },
  { id: 3, name: 'Personal Loan', totalAmount: 200000,  currentBalance: 85000,   interestRate: 12,  type: 'loan',        dueDate: 10, emi: 8500 },
];

// ── Reducer ─────────────────────────────────────────────────
const transactionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.payload;
    case 'ADD_TRANSACTION':
      return [{ id: Math.max(...state.map(t => t.id), 0) + 1, ...action.payload }, ...state];
    case 'EDIT_TRANSACTION':
      return state.map(t => t.id === action.payload.id ? { ...t, ...action.payload.updates } : t);
    case 'DELETE_TRANSACTION':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

const debtReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_DEBT':
      return [...state, { id: Math.max(...state.map(d => d.id), 0) + 1, ...action.payload }];
    case 'UPDATE_DEBT':
      return state.map(d => d.id === action.payload.id ? { ...d, ...action.payload.updates } : d);
    case 'DELETE_DEBT':
      return state.filter(d => d.id !== action.payload);
    case 'RECORD_PAYMENT':
      return state.map(d => d.id === action.payload.id 
        ? { ...d, currentBalance: Math.max(0, d.currentBalance - action.payload.amount) } 
        : d);
    default:
      return state;
  }
};

// ── Helpers ─────────────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// ── Provider ────────────────────────────────────────────────
export const FinanceProvider = ({ children }) => {
  const [transactions, dispatch] = useReducer(
    transactionReducer,
    SEED_TRANSACTIONS,
    (initial) => loadFromStorage('zf_transactions', initial)
  );

  const [debts, debtDispatch] = useReducer(
    debtReducer,
    SEED_DEBTS,
    (initial) => loadFromStorage('zf_debts', initial)
  );

  const [role, setRole] = useState(() => loadFromStorage('zf_role', 'admin'));
  const [theme, setTheme] = useState(() => loadFromStorage('zf_theme', 'dark'));
  const [activeView, setActiveView] = useState('dashboard');
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    startDate: null,
    endDate: null,
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('zf_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('zf_debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('zf_role', JSON.stringify(role)); }, [role]);
  useEffect(() => { localStorage.setItem('zf_theme', JSON.stringify(theme)); }, [theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  // ── Actions ─────────────────────────────────────────────
  const addTransaction = useCallback((transaction) => {
    if (role === 'admin') dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  }, [role]);

  const editTransaction = useCallback((id, updates) => {
    if (role === 'admin') dispatch({ type: 'EDIT_TRANSACTION', payload: { id, updates } });
  }, [role]);

  const deleteTransaction = useCallback((id) => {
    if (role === 'admin') dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }, [role]);

  // ── Debt Actions ─────────────────────────────────────────
  const addDebt = useCallback((debt) => {
    if (role === 'admin') debtDispatch({ type: 'ADD_DEBT', payload: debt });
  }, [role]);

  const updateDebt = useCallback((id, updates) => {
    if (role === 'admin') debtDispatch({ type: 'UPDATE_DEBT', payload: { id, updates } });
  }, [role]);

  const deleteDebt = useCallback((id) => {
    if (role === 'admin') debtDispatch({ type: 'DELETE_DEBT', payload: id });
  }, [role]);

  const recordDebtPayment = useCallback(( debtId, amount, description ) => {
    if (role !== 'admin') return;
    
    // 1. Update debt balance
    debtDispatch({ type: 'RECORD_PAYMENT', payload: { id: debtId, amount } });
    
    // 2. Create a corresponding expense transaction
    const debt = debts.find(d => d.id === debtId);
    addTransaction({
      date: new Date().toISOString().split('T')[0],
      amount: -amount,
      category: 'Debt Repayment',
      type: 'expense',
      description: description || `Payment towards ${debt?.name || 'Loan'}`,
    });
  }, [role, debts, addTransaction]);

  // ── Computed values ─────────────────────────────────────
  const computed = useMemo(() => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Monthly data for charts
    const monthlyMap = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expenses: 0 };
      if (t.type === 'income') monthlyMap[key].income += t.amount;
      else monthlyMap[key].expenses += Math.abs(t.amount);
    });
    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(m => ({
        ...m,
        label: new Date(m.month + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        netBalance: m.income - m.expenses,
      }));

    // Category data for donut
    const categoryMap = {};
    expenseTransactions.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
    });
    const categoryData = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    // Debt stats
    const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
    const totalEmi = debts.reduce((sum, d) => sum + (d.emi || 0), 0);
    const totalDebtLimit = debts.reduce((sum, d) => sum + (d.totalAmount || 0), 0);
    const debtPaidPercent = totalDebtLimit > 0 ? Math.round(((totalDebtLimit - totalDebt) / totalDebtLimit) * 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
      monthlyData,
      categoryData,
      totalDebt,
      totalEmi,
      debtPaidPercent,
    };
  }, [transactions, debts]);

  const value = {
    transactions,
    debts,
    role, setRole,
    theme, toggleTheme,
    activeView, setActiveView,
    filters, setFilters,
    addTransaction, editTransaction, deleteTransaction,
    addDebt, updateDebt, deleteDebt, recordDebtPayment,
    computed,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = React.useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
