import { useState, useEffect } from 'react';
import { GameStats } from '../types/gameStats';

export function useGameStats() {
  const [gameStats, setGameStats] = useState<GameStats[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('premier-select-game-stats');
    if (stored) {
      setGameStats(JSON.parse(stored));
    }
  }, []);

  const saveGameStats = (newStats: GameStats[]) => {
    setGameStats(newStats);
    localStorage.setItem('premier-select-game-stats', JSON.stringify(newStats));
  };

  const addGameStats = (stats: Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const now = Date.now();
    const newStats: GameStats[] = stats.map((stat, idx) => ({
      ...stat,
      id: `game-stats-${now + idx}-${Math.random()}`, // Add index for unique IDs
      createdAt: new Date(now + idx).toISOString(),
      updatedAt: new Date(now + idx).toISOString(),
    }));
    
    // Use functional update to avoid stale state
    setGameStats(prevStats => {
      const updated = [...prevStats, ...newStats];
      localStorage.setItem('premier-select-game-stats', JSON.stringify(updated));
      return updated;
    });
    
    return newStats;
  };

  const getStatsByPlayerId = (playerId: string) => {
    return gameStats.filter(s => s.playerId === playerId);
  };

  const getStatsBySeason = (season: string) => {
    return gameStats.filter(s => s.season === season);
  };

  const deleteGameStats = (id: string) => {
    saveGameStats(gameStats.filter(s => s.id !== id));
  };

  return {
    gameStats,
    addGameStats,
    getStatsByPlayerId,
    getStatsBySeason,
    deleteGameStats,
  };
}