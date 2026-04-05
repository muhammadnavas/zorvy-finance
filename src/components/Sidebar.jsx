import { BarChart3, LayoutDashboard, Lightbulb, ArrowLeftRight, Sun, Moon, User, X, Bot } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb },
  { id: 'aichat',       label: 'Zorvy AI',     icon: Bot },
];

export const Sidebar = ({ onNavigate, onClose, isMobile }) => {
  const { role, setRole, theme, toggleTheme, activeView, setActiveView } = useFinance();

  const handleNav = (id) => {
    setActiveView(id);
    if (onNavigate) onNavigate();
  };

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      position: 'relative',
      zIndex: 50,
    }}>
      
      {/* Logo + close button (mobile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 24px 16px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon.svg" alt="Zorvy" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -0.5 }}>
            ZorvyFinance
          </span>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 8, color: 'var(--text-muted)',
          }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 12px' }}>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNav(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', borderRadius: 12,
                fontSize: 14, fontWeight: 500,
                cursor: 'pointer', width: '100%', textAlign: 'left',
                border: 'none',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = isActive ? 'var(--accent-light)' : 'transparent'; }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Role Switcher */}
        <div style={{ borderRadius: 12, padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, color: 'var(--text-muted)' }}>
            Role
          </p>
          <div style={{ display: 'flex', gap: 4, borderRadius: 8, padding: 4, background: 'var(--bg-base)' }}>
            <button
              id="role-admin"
              onClick={() => setRole('admin')}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: 'none', transition: 'all 0.2s',
                background: role === 'admin' ? 'var(--accent)' : 'transparent',
                color: role === 'admin' ? '#fff' : 'var(--text-muted)',
              }}
            >
              ◉ admin
            </button>
            <button
              id="role-viewer"
              onClick={() => setRole('viewer')}
              style={{
                flex: 1, padding: '6px 0', borderRadius: 6,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: 'none', transition: 'all 0.2s',
                background: role === 'viewer' ? 'var(--accent)' : 'transparent',
                color: role === 'viewer' ? '#fff' : 'var(--text-muted)',
              }}
            >
              ◎ viewer
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 12,
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          Switch to {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        {/* User Profile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 12,
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #34d399, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={16} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>User</p>
            <p style={{ fontSize: 12, textTransform: 'capitalize', color: 'var(--accent)' }}>{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
