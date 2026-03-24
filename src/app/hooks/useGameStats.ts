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
    } else if (data) {
      const mapped: GameStats[] = data.map((row: any) => ({
        id: row.id,
        playerId: row.player_id || '',
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
        rawBatting: row.raw_batting,
        rawPitching: row.raw_pitching,
        rawFielding: row.raw_fielding,
        createdAt: row.created_at,
        updatedAt: row.created_at,
      }));
      setGameStats(mapped);
    }
    setLoading(false);
  };

  const addGameStats = async (stats: any[]) => {
    const batchId = 'batch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const snapshotDate = new Date().toISOString().split('T')[0];

    // Get all players to match by name
    const { data: existingPlayers } = await supabase.from('players').select('id, name, jersey_number');
    const playerMap = new Map<string, { id: string; jerseyNumber: string }>();
    if (existingPlayers) {
      existingPlayers.forEach((p: any) => {
        playerMap.set(p.name.toLowerCase(), { id: p.id, jerseyNumber: p.jersey_number });
      });
    }

    // Create missing players and update jersey numbers
    for (const s of stats) {
      const fullName = (s.firstName + ' ' + s.lastName).toLowerCase();
      const lastNameLower = s.lastName.toLowerCase();
      // Try exact match first, then last name match
      let matched = playerMap.has(fullName);
      if (!matched) {
        for (const [name, info] of playerMap.entries()) {
          if (name.split(' ').pop() === lastNameLower) { playerMap.set(fullName, info); matched = true; break; }
        }
      }
      if (!matched) {
        const { data: created } = await supabase
          .from('players')
          .insert([{ name: s.firstName + ' ' + s.lastName, age_group: '12U', jersey_number: s.playerNumber || null }])
          .select()
          .single();
        if (created) {
          playerMap.set(fullName, { id: created.id, jerseyNumber: created.jersey_number });
        }
      } else {
        // Update jersey number if we have one and player doesn't
        const existing = playerMap.get(fullName);
        if (existing && !existing.jerseyNumber && s.playerNumber && s.playerNumber !== 'N/A') {
          await supabase.from('players').update({ jersey_number: s.playerNumber }).eq('id', existing.id);
        }
      }
    }

    // For each stat, check if player+season exists — update or insert
    for (const s of stats) {
      const fullName = (s.firstName + ' ' + s.lastName).toLowerCase();
      const lastNameLower = s.lastName.toLowerCase();
      const playerInfo = playerMap.get(fullName);
      if (!playerInfo) continue;

      const row: any = {
        player_id: playerInfo.id,
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
        raw_batting: s.rawBatting || null,
        raw_pitching: s.rawPitching || null,
        raw_fielding: s.rawFielding || null,
      };

      // Check if this player+season already exists
      const { data: existing } = await supabase
        .from('game_stats_snapshots')
        .select('id')
        .eq('player_id', playerInfo.id)
        .eq('season', s.season)
        .limit(1);

      if (existing && existing.length > 0) {
        // UPDATE existing record
        console.log('Updating stats for ' + s.firstName + ' ' + s.lastName + ' (' + s.season + ')');
        await supabase
          .from('game_stats_snapshots')
          .update(row)
          .eq('id', existing[0].id);
      } else {
        // INSERT new record
        console.log('Inserting stats for ' + s.firstName + ' ' + s.lastName + ' (' + s.season + ')');
        await supabase
          .from('game_stats_snapshots')
          .insert([row]);
      }
    }

    await fetchGameStats();
    return stats;
  };

  const getStatsByPlayerId = (playerId: string) => {
    return gameStats.filter(s => s.playerId === playerId);
  };

  const getStatsBySeason = (season: string) => {
    return gameStats.filter(s => s.season === season);
  };

  const deleteGameStats = async (id: string) => {
    const { error } = await supabase.from('game_stats_snapshots').delete().eq('id', id);
    if (error) console.error('Error deleting game stat:', error);
    else setGameStats(prev => prev.filter(s => s.id !== id));
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

