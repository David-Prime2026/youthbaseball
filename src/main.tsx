import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { AuthGate } from './app/components/AuthGate.tsx';
import './styles/index.css';

function Root() {
  const [userRole, setUserRole] = useState<string>('head_coach');
  const [linkedPlayerId, setLinkedPlayerId] = useState<string | null>(null);

  const handleRole = (role: string, playerId: string | null) => {
    setUserRole(role);
    setLinkedPlayerId(playerId);
  };

  return (
    <AuthGate onRole={handleRole}>
      <App userRole={userRole} linkedPlayerId={linkedPlayerId} />
    </AuthGate>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
