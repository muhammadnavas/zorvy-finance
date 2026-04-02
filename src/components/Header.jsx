import { useFinance } from '../context/FinanceContext';
import { AdminPanel } from './AdminPanel';

export const Header = () => {
  const { role, setRole } = useFinance();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <h1>💰 Finance Dashboard</h1>
          <p>Track and manage your financial activity</p>
        </div>

        <div className="header-actions">
          <div className="role-selector">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">👁️ Viewer</option>
              <option value="admin">🔐 Admin</option>
            </select>
          </div>

          <AdminPanel />
        </div>
      </div>
    </header>
  );
};
