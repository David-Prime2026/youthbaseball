import { useState, useEffect } from 'react';
import { GameStats } from '../types/gameStats';
import { supabase } from '../../supabaseClient';

export function useGameStats() {
  const [gameStats, setGameStats] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGameStats();
  }, []);

  const fetchGameStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('game_stats_snapshots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching game stats:', error);
      const stored = localStorage.getItem('premier-select-game-stats');
      if (stored) setGameStats(JSON.parse(stored));
    } else if (data) {
      const mapped: GameStats[] = data.map((row: any) => ({
        id: row.id,
        playerId: row.player_id || row.first_name?.toLowerCase() + '-' + row.last_name?.toLowerCase(),
        playerNumber: row.player_number || '',
        lastName: row.last_name || '',
        firstName: row.first_name || '',
        season: row.season || '',
        gameDate: row.snapshot_date || '',
        gamesPlayed: row.games_played,
        plateAppearances: row.plate_appearances,
        atBats: row.at_bats,
        average: row.batting_avg,
        onBasePercentage: row.obp,
        onBasePlusSlugging: row.ops,
        sluggingPercentage: row.slg,
        hits: row.hits,
        singles: row.singles,
        doubles: row.doubles,
        triples: row.triples,
        homeRuns: row.home_runs,
        rbi: row.rbi,
        runs: row.runs,
        walks: row.walks,
        strikeouts: row.strikeouts,
        stolenBases: row.stolen_bases,
        caughtStealing: row.caught_stealing,
        inningsPitched: row.ip,
        battersFaced: row.batters_faced,
        pitchCount: row.pitch_count,
        wins: row.wins,
        losses: row.losses,
        saves: row.saves,
        earnedRuns: row.earned_runs,
        era: row.era,
        whip: row.whip,
        strikeoutsPitching: row.k_pitching,
        walksPitching: row.bb_pitching,
        hitsAllowed: row.hits_allowed,
        totalChances: row.total_chances,
        putouts: row.putouts,
        assists: row.assists,
        errors: row.errors,
        fieldingPercentage: row.fielding_pct,
        createdAt: row.created_at,
        updatedAt: row.created_at,
      }));
      setGameStats(mapped);
    }
    setLoading(false);
  };

  const addGameStats = async (stats: Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const batchId = 'batch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const snapshotDate = new Date().toISOString().split('T')[0];

    // First get all players to match by name
    const { data: existingPlayers } = await supabase
      .from('players')
      .select('id, name');

    const playerMap = new Map<string, string>();
    if (existingPlayers) {
      existingPlayers.forEach((p: any) => {
        playerMap.set(p.name.toLowerCase(), p.id);
      });
    }

    // Create any missing players
    const newPlayerNames: string[] = [];
    stats.forEach(s => {
      const fullName = s.firstName + ' ' + s.lastName;
      if (!playerMap.has(fullName.toLowerCase())) {
        newPlayerNames.push(fullName);
      }
    });

    if (newPlayerNames.length > 0) {
      const { data: createdPlayers } = await supabase
        .from('players')
        .insert(newPlayerNames.map(name => ({
          name,
          age_group: '12U',
        })))
        .select();

      if (createdPlayers) {
        createdPlayers.forEach((p: any) => {
          playerMap.set(p.name.toLowerCase(), p.id);
        });
      }
    }

    // Insert game stats with player_id references
    const rows = stats.map(s => {
      const fullName = s.firstName + ' ' + s.lastName;
      const playerId = playerMap.get(fullName.toLowerCase()) || null;

      return {
        player_id: playerId,
        player_number: s.playerNumber || null,
        last_name: s.lastName,
        first_name: s.firstName,
        season: s.season,
        snapshot_date: snapshotDate,
        upload_batch_id: batchId,
        games_played: s.gamesPlayed || null,
        plate_appearances: s.plateAppearances || null,
        at_bats: s.atBats || null,
        batting_avg: s.average || null,
        obp: s.onBasePercentage || null,
        ops: s.onBasePlusSlugging || null,
        slg: s.sluggingPercentage || null,
        hits: s.hits || null,
        singles: s.singles || null,
        doubles: s.doubles || null,
        triples: s.triples || null,
        home_runs: s.homeRuns || null,
        rbi: s.rbi || null,
        runs: s.runs || null,
        walks: s.walks || null,
        strikeouts: s.strikeouts || null,
        stolen_bases: s.stolenBases || null,
        caught_stealing: s.caughtStealing || null,
        ip: s.inningsPitched || null,
        batters_faced: s.battersFaced || null,
        pitch_count: s.pitchCount || null,
        wins: s.wins || null,
        losses: s.losses || null,
        saves: s.saves || null,
        earned_runs: s.earnedRuns || null,
        era: s.era || null,
        whip: s.whip || null,
        k_pitching: s.strikeoutsPitching || null,
        bb_pitching: s.walksPitching || null,
        hits_allowed: s.hitsAllowed || null,
        total_chances: s.totalChances || null,
        assists: s.assists || null,
        putouts: s.putouts || null,
        fielding_pct: s.fieldingPercentage || null,
        errors: s.errors || null,
      };
    });

    const { data, error } = await supabase
      .from('game_stats_snapshots')
      .insert(rows)
      .select();

    if (error) {
      console.error('Error adding game stats:', error);
      return [];
    }

    if (data) {
      await fetchGameStats();
      return data;
    }
    return [];
  };

  const getStatsByPlayerId = (playerId: string) => {
    return gameStats.filter(s => s.playerId === playerId);
  };

  const getStatsBySeason = (season: string) => {
    return gameStats.filter(s => s.season === season);
  };

  const deleteGameStats = async (id: string) => {
    const { error } = await supabase
      .from('game_stats_snapshots')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game stat:', error);
    } else {
      setGameStats(prev => prev.filter(s => s.id !== id));
    }
  };

  return {
    gameStats,
    loading,
    addGameStats,
    getStatsByPlayerId,
    getStatsBySeason,
    deleteGameStats,
    refreshGameStats: fetchGameStats,
  };
}
