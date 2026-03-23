import { useState, useEffect } from 'react';
import { Player } from '../types/player';
import { supabase } from '../../supabaseClient';

export function usePlayerData() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching players:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('premier-select-players');
      if (stored) setPlayers(JSON.parse(stored));
    } else if (data) {
      const mapped: Player[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        photo: row.photo || undefined,
        photoHistory: [],
        dateOfBirth: row.date_of_birth || '',
        ageGroup: row.age_group || '12U',
        positions: row.positions || [],
        throwingHand: row.throwing_hand || 'Right',
        battingHand: row.batting_hand || 'Right',
        isAmbidextrous: row.is_ambidextrous || false,
        contactEmail: row.contact_email || undefined,
        phoneNumber: row.phone_number || undefined,
        notes: row.notes || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      setPlayers(mapped);
    }
    setLoading(false);
  };

  const savePlayers = (newPlayers: Player[]) => {
    setPlayers(newPlayers);
  };

  const addPlayer = async (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('players')
      .insert([{
        name: player.name,
        date_of_birth: player.dateOfBirth || null,
        age_group: player.ageGroup || '12U',
        positions: player.positions || [],
        throwing_hand: player.throwingHand || 'Right',
        batting_hand: player.battingHand || 'Right',
        is_ambidextrous: player.isAmbidextrous || false,
        contact_email: player.contactEmail || null,
        phone_number: player.phoneNumber || null,
        photo: player.photo || null,
        notes: player.notes || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding player:', error);
      return null;
    }

    if (data) {
      const newPlayer: Player = {
        id: data.id,
        name: data.name,
        photo: data.photo || undefined,
        photoHistory: [],
        dateOfBirth: data.date_of_birth || '',
        ageGroup: data.age_group || '12U',
        positions: data.positions || [],
        throwingHand: data.throwing_hand || 'Right',
        battingHand: data.batting_hand || 'Right',
        isAmbidextrous: data.is_ambidextrous || false,
        contactEmail: data.contact_email || undefined,
        phoneNumber: data.phone_number || undefined,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      setPlayers(prev => [...prev, newPlayer]);
      return newPlayer;
    }
    return null;
  };

  const addPlayers = async (playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const rows = playerData.map(p => ({
      name: p.name,
      date_of_birth: p.dateOfBirth || null,
      age_group: p.ageGroup || '12U',
      positions: p.positions || [],
      throwing_hand: p.throwingHand || 'Right',
      batting_hand: p.battingHand || 'Right',
      is_ambidextrous: p.isAmbidextrous || false,
      contact_email: p.contactEmail || null,
      phone_number: p.phoneNumber || null,
      photo: p.photo || null,
      notes: p.notes || null,
    }));

    const { data, error } = await supabase
      .from('players')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error adding players:', error);
      return [];
    }

    if (data) {
      const newPlayers: Player[] = data.map((row: any) => ({
        id: row.id,
        name: row.name,
        photo: row.photo || undefined,
        photoHistory: [],
        dateOfBirth: row.date_of_birth || '',
        ageGroup: row.age_group || '12U',
        positions: row.positions || [],
        throwingHand: row.throwing_hand || 'Right',
        battingHand: row.batting_hand || 'Right',
        isAmbidextrous: row.is_ambidextrous || false,
        contactEmail: row.contact_email || undefined,
        phoneNumber: row.phone_number || undefined,
        notes: row.notes || undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
      setPlayers(prev => [...prev, ...newPlayers]);
      return newPlayers;
    }
    return [];
  };

  const updatePlayer = async (id: string, updates: Partial<Player>) => {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
    if (updates.ageGroup !== undefined) dbUpdates.age_group = updates.ageGroup;
    if (updates.positions !== undefined) dbUpdates.positions = updates.positions;
    if (updates.throwingHand !== undefined) dbUpdates.throwing_hand = updates.throwingHand;
    if (updates.battingHand !== undefined) dbUpdates.batting_hand = updates.battingHand;
    if (updates.isAmbidextrous !== undefined) dbUpdates.is_ambidextrous = updates.isAmbidextrous;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.phoneNumber !== undefined) dbUpdates.phone_number = updates.phoneNumber;
    if (updates.photo !== undefined) dbUpdates.photo = updates.photo;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    dbUpdates.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('players')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating player:', error);
    } else {
      setPlayers(prev =>
        prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      );
    }
  };

  const deletePlayer = async (id: string) => {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting player:', error);
    } else {
      setPlayers(prev => prev.filter(p => p.id !== id));
    }
  };

  const getPlayerById = (id: string) => {
    return players.find(p => p.id === id);
  };

  return {
    players,
    loading,
    addPlayer,
    addPlayers,
    updatePlayer,
    deletePlayer,
    getPlayerById,
    refreshPlayers: fetchPlayers,
  };
}
