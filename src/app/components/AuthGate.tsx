import { useState, useEffect } from 'react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('premier-select-auth');
    if (stored === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_APP_PASSWORD;

    if (password === correctPassword) {
      sessionStorage.setItem('premier-select-auth', 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 16px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#38bdf8',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Youth Performance Tracking System
        </p>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#f1f5f9',
          marginBottom: '32px',
        }}>
          PREMIER SELECT
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '14px',
              marginBottom: '16px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          {error && (
            <p style={{
              color: '#f87171',
              fontSize: '12px',
              marginBottom: '12px',
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#38bdf8',
              color: '#0a0f1a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
