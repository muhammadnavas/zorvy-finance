import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          textAlign: 'center',
          padding: 20,
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--danger-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24
          }}>
            <AlertCircle size={40} color="var(--danger)" />
          </div>
          
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 400, marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
            An unexpected error occurred. Don't worry, your data is safe. Try refreshing the page or returning home.
          </p>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={this.handleReset}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12,
                background: 'var(--accent)', color: '#fff',
                border: 'none', fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
              }}
            >
              <RefreshCw size={18} /> Reload App
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12,
                background: 'var(--bg-surface)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', fontWeight: 600, cursor: 'pointer'
              }}
            >
              <Home size={18} /> Go Home
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              marginTop: 40, padding: 16, borderRadius: 12, 
              background: '#000', color: '#ff4444', 
              fontSize: 12, textAlign: 'left', maxWidth: '80%', 
              overflow: 'auto', border: '1px solid #333' 
            }}>
              <p style={{ fontWeight: 700, marginBottom: 8 }}>Error Secret:</p>
              <pre>{this.state.error?.toString()}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
