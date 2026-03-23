import { useState, useEffect } from 'react';
import { PerformanceEntry, PlayerStats } from '../types/performance';
import { Player } from '../types/player';

export function usePerformanceData(category: string) {
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
  const [players, setPlayers] = useState<string[]>(['J. Doe']);

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`premier-select-${category}`);
    if (stored) {
      setEntries(JSON.parse(stored));
    }
    
    // Load Player objects and extract names
    const storedPlayers = localStorage.getItem('premier-select-players');
    if (storedPlayers) {
      try {
        const playerObjects: Player[] = JSON.parse(storedPlayers);
        // Extract just the names from the Player objects
        const playerNames = playerObjects.map(p => p.name);
        setPlayers(playerNames.length > 0 ? playerNames : ['J. Doe']);
      } catch (e) {
        console.error('Error loading players:', e);
        setPlayers(['J. Doe']);
      }
    }
  }, [category]);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`premier-select-${category}`, JSON.stringify(entries));
  }, [entries, category]);

  const addEntry = (entry: Omit<PerformanceEntry, 'id'>) => {
    const newEntry: PerformanceEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random()}`,
    };
    setEntries([newEntry, ...entries]);
  };
  
  const addEntries = (newEntries: Omit<PerformanceEntry, 'id'>[]) => {
    const timestamp = Date.now();
    const entriesToAdd: PerformanceEntry[] = newEntries.map((entry, idx) => ({
      ...entry,
      id: `${timestamp + idx}-${Math.random()}`,
    }));
    
    // Use functional update to avoid stale state
    setEntries(prevEntries => [...entriesToAdd, ...prevEntries]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getPlayerStats = (playerId: string, metricType: string): PlayerStats | null => {
    const playerEntries = entries.filter(
      e => e.playerId === playerId && e.metricType === metricType
    );

    if (playerEntries.length === 0) return null;

    const allReps = playerEntries.flatMap(e => e.reps).filter(r => r > 0);
    const personalRecord = Math.max(...allReps);
    const averageValue = allReps.reduce((a, b) => a + b, 0) / allReps.length;

    return {
      playerId,
      playerName: playerEntries[0].playerName,
      ageGroup: playerEntries[0].ageGroup,
      category,
      metricType,
      personalRecord,
      averageValue,
      goal: null,
      allTimeEntries: playerEntries,
    };
  };

  const addPlayer = (playerName: string) => {
    // No longer save to localStorage here
    // This is now handled by usePlayerData hook
    const updatedPlayers = [...players, playerName];
    setPlayers(updatedPlayers);
    // DO NOT save to localStorage - let usePlayerData handle it
  };

  return {
    entries,
    players,
    addEntry,
    addEntries,
    deleteEntry,
    getPlayerStats,
    addPlayer,
  };
}