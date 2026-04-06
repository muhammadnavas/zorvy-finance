import React from 'react';
import { LayoutDashboard, Lightbulb, ArrowLeftRight, Bot, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Overview',     icon: LayoutDashboard },
  { id: 'transactions', label: 'Txns',         icon: ArrowLeftRight },
  { id: 'debts',        label: 'Debts',        icon: CreditCard },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb },
  { id: 'aichat',       label: 'Zorvy AI',     icon: Bot },
];

export const BottomBar = () => {
  const { activeView, setActiveView } = useFinance();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'var(--bg-sidebar)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 4px calc(8px + env(safe-area-inset-bottom))',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
    }}>
      {NAV_ITEMS.map(item => {
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
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              padding: '6px 0',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: 12,
                  background: 'var(--accent-light)',
                  opacity: 0.5,
                  zIndex: -1,
                  transform: 'scale(1.1)',
                }} />
              )}
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ 
              fontSize: 10, 
              fontWeight: isActive ? 700 : 500,
              letterSpacing: isActive ? '0.01em' : '0',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
