import './App.css';
import { Dashboard } from './components/Dashboard';
import { FinanceProvider } from './context/FinanceContext';
import './dashboard.css';
import FloatingLines from './FloatingLines';

function App() {
  return (
    <FinanceProvider>
      <div className="app-wrapper">
        {/* Floating Lines Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <FloatingLines 
            enabledWaves={["top","middle","bottom"]}
            lineCount={3}
            lineDistance={8}
            bendRadius={5}
            bendStrength={-0.5}
            interactive={true}
            parallax={true}
            linesGradient={["rgba(255, 255, 255, 0.05)"]}
          />
        </div>

        {/* Dashboard Content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Dashboard />
        </div>
      </div>
    </FinanceProvider>
  )
}

export default App
