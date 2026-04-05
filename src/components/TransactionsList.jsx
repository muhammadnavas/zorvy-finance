import { useCallback, useMemo, useState } from 'react';
import { Search, SortAsc, SortDesc, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CategoryIcon } from './CategoryIcon';

const selectStyle = {
  padding: '10px 12px', borderRadius: 12, fontSize: 13,
  cursor: 'pointer', outline: 'none',
  background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)',
};

export const TransactionsList = ({ onOpenAddModal, isMobile }) => {
  const { transactions, filters, setFilters, deleteTransaction, editTransaction, role } = useFinance();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
      const matchesSearch =
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || t.category === filters.category;
      const matchesType = filters.type === 'all' || t.type === filters.type;
      return matchesSearch && matchesCategory && matchesType;
    });
    filtered.sort((a, b) => {
      let aVal = a[sortBy], bVal = b[sortBy];
      if (sortBy === 'date') { aVal = new Date(aVal); bVal = new Date(bVal); }
      else if (sortBy === 'amount') { aVal = Math.abs(Number(aVal)); bVal = Math.abs(Number(bVal)); }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    return filtered;
  }, [transactions, filters, sortBy, sortOrder]);

  const categories = useMemo(() => ['all', ...new Set(transactions.map(t => t.category))], [transactions]);

  const handleEditClick = useCallback((transaction) => {
    setEditingId(transaction.id);
    setEditValues({ ...transaction });
  }, []);

  const handleSaveEdit = useCallback((id) => {
    editTransaction(id, editValues);
    setEditingId(null);
  }, [editValues, editTransaction]);

  const handleDelete = useCallback((id) => {
    if (confirm('Delete this transaction?')) deleteTransaction(id);
  }, [deleteTransaction]);

  const pad = isMobile ? 16 : 32;

  // ── Mobile card view ────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ padding: pad, maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Transactions</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>{filteredTransactions.length} records</p>
          </div>
          {role === 'admin' && (
            <button onClick={onOpenAddModal} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer',
            }}>
              <Plus size={15} /> Add
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input type="text" placeholder="Search..." value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9, borderRadius: 10, fontSize: 13, outline: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              style={{ ...selectStyle, flex: 1, fontSize: 12, padding: '8px 10px' }}>
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All' : cat}</option>)}
            </select>
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={{ ...selectStyle, flex: 1, fontSize: 12, padding: '8px 10px' }}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {/* Card List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
            <div key={t.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 14, background: 'var(--bg-surface)', border: '1px solid var(--border)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: t.type === 'income' ? 'var(--accent-light)' : 'var(--danger-light)',
              }}>
                <CategoryIcon category={t.category} type={t.type} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {t.category}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)' }}>
                  {t.type === 'income' ? '+' : '−'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                </p>
                {role === 'admin' && (
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button onClick={() => handleEditClick(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}>
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#ef4444' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14 }}>No transactions found</p>
          )}
        </div>
      </div>
    );
  }

  // ── Desktop table view ──────────────────────────────────
  const thStyle = {
    padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)',
  };
  const tdStyle = { padding: '12px 16px', fontSize: 13, color: 'var(--text-primary)' };

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Transactions</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>{filteredTransactions.length} records found</p>
        </div>
        {role === 'admin' && (
          <button onClick={onOpenAddModal} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
          }}>
            <Plus size={16} /> Add Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input type="text" placeholder="Search by name or category..." value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 12, fontSize: 13, outline: 'none', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} style={selectStyle}>
          {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} style={selectStyle}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </select>
        <button onClick={() => setSortOrder(s => s === 'asc' ? 'desc' : 'asc')}
          style={{ ...selectStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
        </button>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-hover)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ ...thStyle, width: 50 }}>Icon</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Date</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                {role === 'admin' && <th style={{ ...thStyle, textAlign: 'center', width: 100 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = t.type === 'income' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={tdStyle}><CategoryIcon category={t.category} type={t.type} size={18} /></td>
                  <td style={tdStyle}>
                    {editingId === t.id ? (
                      <input type="text" value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                        style={{ padding: '4px 8px', borderRadius: 8, fontSize: 13, outline: 'none', width: '100%', background: 'var(--bg-base)', border: '1px solid var(--accent)', color: 'var(--text-primary)' }} />
                    ) : <span style={{ fontWeight: 500 }}>{t.description}</span>}
                  </td>
                  <td style={tdStyle}>
                    {editingId === t.id ? (
                      <input type="text" value={editValues.category} onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                        style={{ padding: '4px 8px', borderRadius: 8, fontSize: 13, outline: 'none', width: 120, background: 'var(--bg-base)', border: '1px solid var(--accent)', color: 'var(--text-primary)' }} />
                    ) : (
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: 'var(--bg-surface-hover)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                        {t.category}
                      </span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>
                    {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {editingId === t.id ? (
                      <input type="number" value={editValues.amount} onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) })}
                        style={{ padding: '4px 8px', borderRadius: 8, fontSize: 13, outline: 'none', width: 120, textAlign: 'right', background: 'var(--bg-base)', border: '1px solid var(--accent)', color: 'var(--text-primary)' }} />
                    ) : (
                      <span style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--accent)' : 'var(--danger)' }}>
                        {t.type === 'income' ? '+' : '−'}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  {role === 'admin' && (
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      {editingId === t.id ? (
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button onClick={() => handleSaveEdit(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#10b981' }}><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)' }}><X size={14} /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button onClick={() => handleEditClick(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: 'var(--text-muted)' }}><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#ef4444' }}><Trash2 size={14} /></button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan={role === 'admin' ? 6 : 5} style={{ ...tdStyle, textAlign: 'center', padding: '64px 16px', color: 'var(--text-muted)' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
