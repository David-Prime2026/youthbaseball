import { useState, useEffect } from 'react';
import { PerformanceEntry, PlayerStats } from '../types/performance';
import { Player } from '../types/player';
import { supabase } from '../../supabaseClient';

export function usePerformanceData(category: string) {
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
    fetchPlayers();
  }, [category]);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('performance_entries')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching performance entries:', error);
      const stored = localStorage.getItem('premier-select-' + category);
      if (stored) setEntries(JSON.parse(stored));
    } else if (data) {
      const mapped: PerformanceEntry[] = data.map((row: any) => ({
        id: row.id,
        playerName: row.player_name,
        playerId: row.player_id || '',
        ageGroup: row.age_group || '12U',
        date: row.date,
        season: row.season || '',
        drill: row.drill || '',
        reps: row.reps || [],
        notes: row.notes || '',
        category: row.category,
        metricType: row.metric_type,
        createdAt: row.created_at,
      }));
      setEntries(mapped);
    }
    setLoading(false);
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('name')
      .order('name');

    if (error) {
      console.error('Error fetching players:', error);
      setPlayers(['J. Doe']);
    } else if (data) {
      const names = data.map((p: any) => p.name);
      setPlayers(names.length > 0 ? names : ['J. Doe']);
    }
  };

  const addEntry = async (entry: Omit<PerformanceEntry, 'id'>) => {
    const { data, error } = await supabase
      .from('performance_entries')
      .insert([{
        player_id: entry.playerId || null,
        player_name: entry.playerName,
        age_group: entry.ageGroup || '12U',
        category: entry.category || category,
        metric_type: entry.metricType,
        drill: entry.drill || null,
        reps: entry.reps || [],
        notes: entry.notes || null,
        date: entry.date,
        season: entry.season || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding entry:', error);
      return;
    }

    if (data) {
      const newEntry: PerformanceEntry = {
        id: data.id,
        playerName: data.player_name,
        playerId: data.player_id || '',
        ageGroup: data.age_group || '12U',
        date: data.date,
        season: data.season || '',
        drill: data.drill || '',
        reps: data.reps || [],
        notes: data.notes || '',
        category: data.category,
        metricType: data.metric_type,
        createdAt: data.created_at,
      };
      setEntries(prev => [newEntry, ...prev]);
    }
  };

  const addEntries = async (newEntries: Omit<PerformanceEntry, 'id'>[]) => {
    const rows = newEntries.map(e => ({
      player_id: e.playerId || null,
      player_name: e.playerName,
      age_group: e.ageGroup || '12U',
      category: e.category || category,
      metric_type: e.metricType,
      drill: e.drill || null,
      reps: e.reps || [],
      notes: e.notes || null,
      date: e.date,
      season: e.season || null,
    }));

    const { data, error } = await supabase
      .from('performance_entries')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error adding entries:', error);
      return;
    }

    if (data) {
      const mapped: PerformanceEntry[] = data.map((row: any) => ({
        id: row.id,
        playerName: row.player_name,
        playerId: row.player_id || '',
        ageGroup: row.age_group || '12U',
        date: row.date,
        season: row.season || '',
        drill: row.drill || '',
        reps: row.reps || [],
        notes: row.notes || '',
        category: row.category,
        metricType: row.metric_type,
        createdAt: row.created_at,
      }));
      setEntries(prev => [...mapped, ...prev]);
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('performance_entries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting entry:', error);
    } else {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
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
    setPlayers(prev => [...prev, playerName]);
  };

  return {
    entries,
    players,
    loading,
    addEntry,
    addEntries,
    deleteEntry,
    getPlayerStats,
    addPlayer,
    refreshEntries: fetchEntries,
  };
}
