import { useState, useEffect } from 'react';
import { Player } from '../types/player';

export function usePlayerData() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('premier-select-players');
    if (stored) {
      setPlayers(JSON.parse(stored));
    }
  }, []);

  const savePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
    localStorage.setItem('premier-select-players', JSON.stringify(newPlayers));
  };

  const addPlayer = (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPlayer: Player = {
      ...player,
      photoHistory: player.photoHistory || [],
      id: `player-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Use functional update to avoid stale state issues
    setPlayers(prevPlayers => {
      const updated = [...prevPlayers, newPlayer];
      localStorage.setItem('premier-select-players', JSON.stringify(updated));
      return updated;
    });
    
    return newPlayer;
  };
  
  const addPlayers = (playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const now = Date.now();
    const newPlayers: Player[] = playerData.map((player, idx) => ({
      ...player,
      photoHistory: player.photoHistory || [],
      id: `player-${now + idx}-${Math.random()}`, // Add index to ensure unique timestamps
      createdAt: new Date(now + idx).toISOString(),
      updatedAt: new Date(now + idx).toISOString(),
    }));
    
    setPlayers(prevPlayers => {
      const updated = [...prevPlayers, ...newPlayers];
      localStorage.setItem('premier-select-players', JSON.stringify(updated));
      return updated;
    });
    
    return newPlayers;
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    const updatedPlayers = players.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    savePlayers(updatedPlayers);
  };

  const deletePlayer = (id: string) => {
    savePlayers(players.filter(p => p.id !== id));
  };

  const getPlayerById = (id: string) => {
    return players.find(p => p.id === id);
  };

  return {
    players,
    addPlayer,
    addPlayers,
    updatePlayer,
    deletePlayer,
    getPlayerById,
  };
}