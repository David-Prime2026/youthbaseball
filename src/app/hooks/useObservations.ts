import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

export interface Observation {
  id: string;
  playerId: string;
  category: string;
  date: string;
  observationType: string;
  content: string;
  rating: number | null;
  createdAt: string;
}

export function useObservations(playerId?: string) {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObservations();
  }, [playerId]);

  const fetchObservations = async () => {
    setLoading(true);
    let query = supabase.from('observations').select('*').order('created_at', { ascending: false });
    if (playerId) query = query.eq('player_id', playerId);
    const { data, error } = await query;
    if (error) console.error('Error fetching observations:', error);
    else if (data) {
      setObservations(data.map((r: any) => ({
        id: r.id,
        playerId: r.player_id || '',
        category: r.category || '',
        date: r.date || '',
        observationType: r.observation_type || '',
        content: r.content || '',
        rating: r.rating,
        createdAt: r.created_at,
      })));
    }
    setLoading(false);
  };

  const addObservation = async (obs: Omit<Observation, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.from('observations').insert([{
      player_id: obs.playerId || null,
      category: obs.category,
      date: obs.date || new Date().toISOString().split('T')[0],
      observation_type: obs.observationType || null,
      content: obs.content,
      rating: obs.rating || null,
    }]).select().single();
    if (error) console.error('Error adding observation:', error);
    else if (data) {
      const newObs: Observation = { id: data.id, playerId: data.player_id || '', category: data.category, date: data.date, observationType: data.observation_type || '', content: data.content, rating: data.rating, createdAt: data.created_at };
      setObservations(prev => [newObs, ...prev]);
      return newObs;
    }
    return null;
  };

  const deleteObservation = async (id: string) => {
    const { error } = await supabase.from('observations').delete().eq('id', id);
    if (!error) setObservations(prev => prev.filter(o => o.id !== id));
  };

  return { observations, loading, addObservation, deleteObservation, refreshObservations: fetchObservations };
}
