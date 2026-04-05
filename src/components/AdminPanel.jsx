import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const categories = [
  'Salary', 'Freelance', 'Investment', 'Rent', 'Food & Dining', 'Shopping',
  'Entertainment', 'Utilities', 'Transport', 'Health', 'Education',
];

const inputStyle = {
  padding: '10px 12px', borderRadius: 12, fontSize: 14, outline: 'none',
  width: '100%', transition: 'border-color 0.2s',
  background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)',
};

const labelStyle = {
  fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
  color: 'var(--text-secondary)', margin: '0 0 6px',
};

export const AdminPanel = ({ isOpen, onClose }) => {
  const { addTransaction } = useFinance();
  const [formData, setFormData] = useState({
    description: '', amount: '', category: 'Salary', type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description && formData.amount) {
      addTransaction({
        ...formData,
        amount: formData.type === 'income' ? parseFloat(formData.amount) : -parseFloat(formData.amount),
      });
      setFormData({ description: '', amount: '', category: 'Salary', type: 'expense', date: new Date().toISOString().split('T')[0] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: '100%', maxWidth: 440, borderRadius: 16, overflow: 'hidden',
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Add Transaction</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 8, color: 'var(--text-muted)',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={labelStyle}>Description</p>
            <input id="form-description" type="text" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Transaction description" required style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={labelStyle}>Type</p>
              <select id="form-type" value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <p style={labelStyle}>Amount (₹)</p>
              <input id="form-amount" type="number" step="0.01" value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00" required style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={labelStyle}>Category</p>
              <select id="form-category" value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <p style={labelStyle}>Date</p>
              <input id="form-date" type="date" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)',
            }}>
              Cancel
            </button>
            <button type="submit" style={{
              flex: 1, padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', background: '#10b981', color: '#fff', border: 'none',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
            }}>
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
