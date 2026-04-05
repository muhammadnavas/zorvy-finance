import { LayoutDashboard, ArrowLeftRight, CreditCard, Lightbulb, Bot } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { id: 'dashboard',    label: 'Overview',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Transact',  icon: ArrowLeftRight },
  { id: 'debts',        label: 'Debts',        icon: CreditCard },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb },
  { id: 'aichat',       label: 'Zorvy AI',     icon: Bot },
];

export const BottomNav = () => {
  const { activeView, setActiveView } = useFinance();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'var(--bg-sidebar)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 64,
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
    }}>
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              padding: '8px 0',
            }}
          >
            <item.icon 
              size={20} 
              style={{
                strokeWidth: isActive ? 2.5 : 2,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease',
              }} 
            />
            <span style={{ 
              fontSize: 10, 
              fontWeight: isActive ? 700 : 500,
              opacity: isActive ? 1 : 0.8
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: 24,
                height: 3,
                background: 'var(--accent)',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
