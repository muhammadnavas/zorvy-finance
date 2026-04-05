import { useState, useEffect } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TransactionsList } from './components/TransactionsList';
import { Debts } from './components/Debts';
import { Insights } from './components/Insights';
import { AdminPanel } from './components/AdminPanel';
import { AiChat } from './components/AiChat';
import { BottomNav } from './components/BottomNav';
import { useFinance } from './context/FinanceContext';
import { Menu, X } from 'lucide-react';

const SIDEBAR_WIDTH = 256;
const MOBILE_BREAKPOINT = 768;

const AppContent = () => {
  const { activeView } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on navigation (mobile)
  const handleNavigation = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Mobile topbar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', height: 56,
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8, color: 'var(--text-primary)',
            }}
          >
            <Menu size={22} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>ZorvyFinance</span>
        </div>
      )}

      {/* Sidebar overlay (mobile) */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 49,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? 0 : -SIDEBAR_WIDTH - 10) : 0,
        top: 0, zIndex: 50,
        width: SIDEBAR_WIDTH, flexShrink: 0,
        height: '100vh', overflow: 'hidden',
        transition: isMobile ? 'left 0.3s ease' : 'none',
        boxShadow: isMobile && sidebarOpen ? '4px 0 24px rgba(0,0,0,0.3)' : 'none',
      }}>
        <Sidebar onNavigate={handleNavigation} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: isMobile ? 56 : 0,
        paddingBottom: isMobile ? 80 : 0, // Extra space for bottom nav
      }}>
        {activeView === 'dashboard' && <Dashboard isMobile={isMobile} />}
        {activeView === 'transactions' && <TransactionsList onOpenAddModal={() => setShowAddModal(true)} isMobile={isMobile} />}
        {activeView === 'debts' && <Debts isMobile={isMobile} />}
        {activeView === 'insights' && <Insights isMobile={isMobile} />}
        {activeView === 'aichat' && (
          <div style={{
            padding: isMobile ? '12px 10px' : '24px 40px',
            maxWidth: 1000, margin: '0 auto',
            height: isMobile ? 'calc(100vh - 56px)' : '100vh',
            display: 'flex', flexDirection: 'column',
            boxSizing: 'border-box',
            paddingBottom: isMobile ? 80 : 0, // Space for BottomNav
          }}>
            <AiChat isMobile={isMobile} />
          </div>
        )}
      </main>
      
      {isMobile && <BottomNav />}

      <AdminPanel isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
