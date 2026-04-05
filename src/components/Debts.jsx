import { useState, useMemo } from 'react';
import { CreditCard, Landmark, Calendar, Percent, Plus, Trash2, ArrowUpRight, TrendingDown, Wallet, X, Check } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const formatFullCurrency = (val) => `₹${Math.abs(val).toLocaleString('en-IN')}`;

const Card = ({ children, style = {} }) => (
  <div style={{
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: 20, boxShadow: 'var(--card-shadow)',
    ...style,
  }}>
    {children}
  </div>
);

export const Debts = ({ isMobile }) => {
  const { debts, addDebt, deleteDebt, recordDebtPayment, role, computed } = useFinance();
  const { totalDebt, totalEmi, debtPaidPercent } = computed;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(null); // stores debt object
  const [payAmount, setPayAmount] = useState('');
  
  const [newDebt, setNewDebt] = useState({
    name: '',
    totalAmount: '',
    currentBalance: '',
    interestRate: '',
    type: 'loan',
    dueDate: '',
    emi: '',
  });

  const handleAddDebt = (e) => {
    e.preventDefault();
    addDebt({
      ...newDebt,
      totalAmount: parseFloat(newDebt.totalAmount),
      currentBalance: parseFloat(newDebt.currentBalance),
      interestRate: parseFloat(newDebt.interestRate),
      dueDate: parseInt(newDebt.dueDate),
      emi: parseFloat(newDebt.emi || 0),
    });
    setShowAddModal(false);
    setNewDebt({ name: '', totalAmount: '', currentBalance: '', interestRate: '', type: 'loan', dueDate: '', emi: '' });
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!payAmount || isNaN(payAmount)) return;
    recordDebtPayment(showPayModal.id, parseFloat(payAmount), `Payment to ${showPayModal.name}`);
    setShowPayModal(null);
    setPayAmount('');
  };

  const pad = isMobile ? 16 : 32;

  return (
    <div style={{ padding: pad, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Debts & Loans</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Manage your liabilities and repayments</p>
        </div>
        {role === 'admin' && (
          <button onClick={() => setShowAddModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
            fontSize: 14, fontWeight: 600, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}>
            <Plus size={16} /> Add Debt
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 32,
      }}>
        <Card style={{ borderLeft: '4px solid #ef4444' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Total Debt</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{formatFullCurrency(totalDebt)}</h2>
            <TrendingDown size={18} color="#ef4444" />
          </div>
        </Card>
        <Card style={{ borderLeft: '4px solid var(--accent)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Monthly EMI</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{formatFullCurrency(totalEmi)}</h2>
        </Card>
        <Card style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Overall Progress</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{debtPaidPercent}%</h2>
            <div style={{ flex: 1, height: 8, background: 'var(--bg-surface-hover)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${debtPaidPercent}%`, height: '100%', background: '#10b981', transition: 'width 1s ease-out' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Debts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: 20,
      }}>
        {debts.map(debt => {
          const progress = Math.round(((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100);
          return (
            <Card key={debt.id} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: debt.type === 'loan' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: debt.type === 'loan' ? 'var(--accent)' : '#8b5cf6'
                  }}>
                    {debt.type === 'loan' ? <Landmark size={22} /> : <CreditCard size={22} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{debt.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0', textTransform: 'capitalize' }}>{debt.type.replace('_', ' ')}</p>
                  </div>
                </div>
                {role === 'admin' && (
                  <button onClick={() => deleteDebt(debt.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                    <Trash2 size={16} onMouseEnter={e => e.currentTarget.style.color = '#ef4444'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'} />
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Progress: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{progress}% paid</span></span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatFullCurrency(debt.currentBalance)} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>left</span></span>
                </div>
                <div style={{ height: 10, background: 'var(--bg-base)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    background: `linear-gradient(90deg, ${debt.type === 'loan' ? '#3b82f6' : '#8b5cf6'}, ${debt.type === 'loan' ? '#60a5fa' : '#a78bfa'})`,
                    borderRadius: 5,
                    transition: 'width 0.8s ease-in-out'
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Percent size={14} color="var(--text-muted)" />
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>Interest Rate</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{debt.interestRate}% <span style={{ fontSize: 9 }}>p.a.</span></p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  <div>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>Next Due Date</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{debt.dueDate}<span style={{ fontSize: 10 }}>th of month</span></p>
                  </div>
                </div>
                {debt.type === 'loan' && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <Wallet size={14} color="var(--text-muted)" />
                   <div>
                     <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>Monthly EMI</p>
                     <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{formatFullCurrency(debt.emi)}</p>
                   </div>
                 </div>
                )}
              </div>

              {role === 'admin' && (
                <button 
                  onClick={() => setShowPayModal(debt)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12, border: `1px solid ${debt.type === 'loan' ? 'var(--accent)' : '#8b5cf6'}`,
                    background: 'transparent', color: debt.type === 'loan' ? 'var(--accent)' : '#8b5cf6',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = debt.type === 'loan' ? 'var(--accent)' : '#8b5cf6';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = debt.type === 'loan' ? 'var(--accent)' : '#8b5cf6';
                  }}
                >
                  <ArrowUpRight size={16} /> Record Payment
                </button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Add Debt Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <Card style={{ width: '100%', maxWidth: 450, position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add New Debt</h2>
            <form onSubmit={handleAddDebt} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Debt Name</label>
                <input required type="text" placeholder="e.g. Home Loan" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Type</label>
                  <select value={newDebt.type} onChange={e => setNewDebt({...newDebt, type: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }}>
                    <option value="loan">Personal Loan</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Interest Rate (%)</label>
                  <input required type="number" step="0.1" placeholder="8.5" value={newDebt.interestRate} onChange={e => setNewDebt({...newDebt, interestRate: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Total Amount</label>
                  <input required type="number" placeholder="500000" value={newDebt.totalAmount} onChange={e => setNewDebt({...newDebt, totalAmount: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Current Balance</label>
                  <input required type="number" placeholder="450000" value={newDebt.currentBalance} onChange={e => setNewDebt({...newDebt, currentBalance: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Monthly EMI (optional)</label>
                  <input type="number" placeholder="15000" value={newDebt.emi} onChange={e => setNewDebt({...newDebt, emi: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Due Date (Day)</label>
                  <input required type="number" min="1" max="31" placeholder="10" value={newDebt.dueDate} onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'var(--bg-base)', border: '1px solid var(--border)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <button type="submit" style={{ marginTop: 8, padding: '12px', borderRadius: 12, background: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Create Debt</button>
            </form>
          </Card>
        </div>
      )}

      {/* Pay Debt Modal */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 }}>
          <Card style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
            <button onClick={() => setShowPayModal(null)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Record Payment</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Paying towards <strong>{showPayModal.name}</strong></p>
            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Repayment Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-primary)' }}>₹</span>
                  <input required autoFocus type="number" placeholder={showPayModal.emi || '0'} value={payAmount} onChange={e => setPayAmount(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: 12, background: 'var(--bg-base)', border: '1px solid var(--accent)', color: 'var(--text-primary)', outline: 'none', fontSize: 18, fontWeight: 700 }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>This will also be recorded as an expense transaction.</p>
              </div>
              <button type="submit" style={{ padding: '12px', borderRadius: 12, background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Check size={18} /> Confirm Payment
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
