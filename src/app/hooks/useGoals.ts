import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export interface Goal {
  id: string;
  playerId: string;
  metricType: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*');

    if (error) {
      console.error('Error fetching goals:', error);
      const stored = localStorage.getItem('premier-select-goals');
      if (stored) setGoals(JSON.parse(stored));
    } else if (data) {
      const mapped: Goal[] = data.map((row: any) => ({
        id: row.id,
        playerId: row.player_id || 'all',
        metricType: row.metric_key || '',
        value: row.value,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      setGoals(mapped);
    }
  };

  const setGoal = async (playerId: string, metricType: string, value: number) => {
    const { data, error } = await supabase
      .from('goals')
      .upsert({
        player_id: playerId === 'all' ? null : playerId,
        metric_key: metricType,
        value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'player_id,metric_key',
      })
      .select()
      .single();

    if (error) {
      console.error('Error setting goal:', error);
    } else if (data) {
      const newGoal: Goal = {
        id: data.id,
        playerId: data.player_id || 'all',
        metricType: data.metric_key,
        value: data.value,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setGoals(prev => {
        const filtered = prev.filter(g => g.id !== newGoal.id);
        return [...filtered, newGoal];
      });
    }
  };

  const getGoal = (playerId: string, metricType: string): number | undefined => {
    const goal = goals.find(
      g => g.playerId === playerId && g.metricType === metricType
    );
    return goal?.value;
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting goal:', error);
    } else {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  return {
    goals,
    setGoal,
    getGoal,
    deleteGoal,
  };
}
