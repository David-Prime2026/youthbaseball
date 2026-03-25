import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { AuthGate } from './app/components/AuthGate.tsx';
import './styles/index.css';

function Root() {
  const [userRole, setUserRole] = useState<string>('head_coach');
  const [linkedPlayerId, setLinkedPlayerId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  const handleRole = (role: string, playerId: string | null, email?: string) => {
    setUserRole(role);
    setLinkedPlayerId(playerId);
    if (email) setUserEmail(email);
  };

  return (
    <AuthGate onRole={handleRole}>
      <App userRole={userRole} linkedPlayerId={linkedPlayerId} userEmail={userEmail} />
    </AuthGate>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
