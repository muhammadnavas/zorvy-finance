import { useFinance } from '../context/FinanceContext';
import { AdminPanel } from './AdminPanel';

export const Header = () => {
  const { role, setRole } = useFinance();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <img src="/favicon.svg" alt="Zorvy Finance Logo" className="logo" />
          <h1>Zorvy Finance</h1>
        </div>

        <div className="header-actions">
          <div className="role-selector">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <AdminPanel />
        </div>
      </div>
    </header>
  );
};
