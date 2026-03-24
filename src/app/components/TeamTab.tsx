import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePlayerData } from '../hooks/usePlayerData';
import { useGameStats } from '../hooks/useGameStats';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { Users, TrendingUp, Target, Award, Zap, AlertCircle, BarChart3, Activity, Trophy } from 'lucide-react';
import { TrainingPlan } from './TrainingPlan';

export function TeamTab() {
  const { players } = usePlayerData();
  const { gameStats } = useGameStats();
  const battingData = usePerformanceData('batting');
  const pitchingData = usePerformanceData('pitching');
  const runningData = usePerformanceData('running');

  const [viewMode, setViewMode] = useState<'team' | 'player'>('team');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');

  const teamBattingStats = useMemo(() => {
    if (gameStats.length === 0) return null;
    const totalAtBats = gameStats.reduce((sum, s) => sum + (s.atBats || 0), 0);
    const totalHits = gameStats.reduce((sum, s) => sum + (s.hits || 0), 0);
    const totalRuns = gameStats.reduce((sum, s) => sum + (s.runs || 0), 0);
    const totalRBI = gameStats.reduce((sum, s) => sum + (s.rbi || 0), 0);
    const totalDoubles = gameStats.reduce((sum, s) => sum + (s.doubles || 0), 0);
    const totalTriples = gameStats.reduce((sum, s) => sum + (s.triples || 0), 0);
    const totalHomeRuns = gameStats.reduce((sum, s) => sum + (s.homeRuns || 0), 0);
    const totalWalks = gameStats.reduce((sum, s) => sum + (s.walks || 0), 0);
    const totalStrikeouts = gameStats.reduce((sum, s) => sum + (s.strikeouts || 0), 0);
    const totalStolenBases = gameStats.reduce((sum, s) => sum + (s.stolenBases || 0), 0);
    const teamAvg = totalAtBats > 0 ? totalHits / totalAtBats : 0;
    const obp = (totalAtBats + totalWalks) > 0 ? (totalHits + totalWalks) / (totalAtBats + totalWalks) : 0;
    const totalBases = totalHits + totalDoubles + (totalTriples * 2) + (totalHomeRuns * 3);
    const slg = totalAtBats > 0 ? totalBases / totalAtBats : 0;
    return { totalGames: gameStats.length, totalAtBats, totalHits, totalRuns, totalRBI, totalDoubles, totalTriples, totalHomeRuns, totalWalks, totalStrikeouts, totalStolenBases, teamAvg, obp, slg, ops: obp + slg };
  }, [gameStats]);

  const teamPitchingStats = useMemo(() => {
    const pitchingGames = gameStats.filter(s => s.inningsPitched && s.inningsPitched > 0);
    if (pitchingGames.length === 0) return null;
    const totalInnings = pitchingGames.reduce((sum, s) => sum + (s.inningsPitched || 0), 0);
    const totalEarnedRuns = pitchingGames.reduce((sum, s) => sum + (s.earnedRuns || 0), 0);
    const totalStrikeouts = pitchingGames.reduce((sum, s) => sum + (s.strikeoutsPitching || 0), 0);
    const totalWalks = pitchingGames.reduce((sum, s) => sum + (s.walksPitching || 0), 0);
    const totalHits = pitchingGames.reduce((sum, s) => sum + (s.hitsAllowed || 0), 0);
    const teamERA = totalInnings > 0 ? (totalEarnedRuns / totalInnings) * 6 : 0;
    const whip = totalInnings > 0 ? (totalWalks + totalHits) / totalInnings : 0;
    return { totalGames: pitchingGames.length, totalInnings, totalEarnedRuns, totalStrikeouts, totalWalks, totalHits, teamERA, whip };
  }, [gameStats]);

  const teamFieldingStats = useMemo(() => {
    const fieldingGames = gameStats.filter(s => s.putouts !== undefined || s.assists !== undefined);
    if (fieldingGames.length === 0) return null;
    const totalPutouts = fieldingGames.reduce((sum, s) => sum + (s.putouts || 0), 0);
    const totalAssists = fieldingGames.reduce((sum, s) => sum + (s.assists || 0), 0);
    const totalErrors = fieldingGames.reduce((sum, s) => sum + (s.errors || 0), 0);
    const totalChances = totalPutouts + totalAssists + totalErrors;
    const fieldingPct = totalChances > 0 ? (totalPutouts + totalAssists) / totalChances : 0;
    return { totalGames: fieldingGames.length, totalPutouts, totalAssists, totalErrors, fieldingPct };
  }, [gameStats]);

  const playerRankings = useMemo(() => {
    return players.map(player => {
      const playerGameStats = gameStats.filter(s => s.playerId === player.id);
      const playerBatting = battingData.entries.filter(e => e.playerId === player.id);
      const playerPitching = pitchingData.entries.filter(e => e.playerId === player.id);
      const playerRunning = runningData.entries.filter(e => e.playerId === player.id);
      const gamesPlayed = playerGameStats.reduce((sum, s) => sum + (s.gamesPlayed || 0), 0);
      const atBats = playerGameStats.reduce((sum, s) => sum + (s.atBats || 0), 0);
      const hits = playerGameStats.reduce((sum, s) => sum + (s.hits || 0), 0);
      const runs = playerGameStats.reduce((sum, s) => sum + (s.runs || 0), 0);
      const rbi = playerGameStats.reduce((sum, s) => sum + (s.rbi || 0), 0);
      const avg = atBats > 0 ? hits / atBats : 0;
      const exitVeloData = playerBatting.filter(e => e.metricType === 'Exit Velocity');
      const exitVelocityAvg = exitVeloData.length > 0 ? exitVeloData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / exitVeloData.flatMap(e => e.reps).length : 0;
      const pitchVeloData = playerPitching.filter(e => e.metricType === 'Throwing Velocity');
      const pitchVelocityAvg = pitchVeloData.length > 0 ? pitchVeloData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / pitchVeloData.flatMap(e => e.reps).length : 0;
      const dashData = playerRunning.filter(e => e.metricType === '60-Yard Dash');
      const dashAvg = dashData.length > 0 ? dashData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / dashData.flatMap(e => e.reps).length : 0;
      const productivityScore = (avg * 100) + (rbi * 2) + (runs * 1.5) + (exitVelocityAvg * 0.1);
      return { player, gamesPlayed, atBats, hits, runs, rbi, avg, exitVelocityAvg, pitchVelocityAvg, dashAvg, productivityScore };
    }).filter(p => p.gamesPlayed > 0 || p.atBats > 0);
  }, [players, gameStats, battingData.entries, pitchingData.entries, runningData.entries]);

  const suggestedLineup = useMemo(() => {
    const lineup = [...playerRankings].sort((a, b) => b.productivityScore - a.productivityScore);
    const reordered: any[] = [];
    const leadoff = lineup.filter(p => p.dashAvg > 0).sort((a, b) => b.avg - a.avg)[0] || lineup[0];
    if (leadoff) reordered.push({ ...leadoff, spot: 1, role: 'Leadoff - Get on base' });
    const second = lineup.filter(p => p !== leadoff && p.avg > 0.250).sort((a, b) => b.avg - a.avg)[0] || lineup[1];
    if (second) reordered.push({ ...second, spot: 2, role: 'Contact - Move runners' });
    const third = lineup.filter(p => p !== leadoff && p !== second).sort((a, b) => b.productivityScore - a.productivityScore)[0] || lineup[2];
    if (third) reordered.push({ ...third, spot: 3, role: 'Best hitter - Drive in runs' });
    const cleanup = lineup.filter(p => ![leadoff, second, third].includes(p) && p.exitVelocityAvg > 0).sort((a, b) => b.exitVelocityAvg - a.exitVelocityAvg)[0] || lineup[3];
    if (cleanup) reordered.push({ ...cleanup, spot: 4, role: 'Cleanup - Power' });
    const remaining = lineup.filter(p => ![leadoff, second, third, cleanup].includes(p));
    remaining.forEach((p, i) => { reordered.push({ ...p, spot: i + 5, role: i === 0 ? 'RBI threat' : i === remaining.length - 1 ? 'Speed/Defense' : 'Depth' }); });
    return reordered.slice(0, 9);
  }, [playerRankings]);

  const aiInsights = useMemo(() => {
    const insights: { type: string; message: string }[] = [];
    if (teamBattingStats) {
      if (teamBattingStats.teamAvg > 0.350) insights.push({ type: 'success', message: 'Team batting average of ' + teamBattingStats.teamAvg.toFixed(3) + ' is elite! Keep the bats hot.' });
      else if (teamBattingStats.teamAvg < 0.250) insights.push({ type: 'warning', message: 'Team batting average is ' + teamBattingStats.teamAvg.toFixed(3) + '. Focus on contact drills and tee work.' });
      if (teamBattingStats.totalStrikeouts > teamBattingStats.totalHits) insights.push({ type: 'warning', message: 'More strikeouts (' + teamBattingStats.totalStrikeouts + ') than hits (' + teamBattingStats.totalHits + '). Work on plate discipline.' });
      if (teamBattingStats.ops > 0.800) insights.push({ type: 'success', message: 'OPS of ' + teamBattingStats.ops.toFixed(3) + ' shows strong offensive production!' });
    }
    if (teamPitchingStats) {
      if (teamPitchingStats.teamERA < 3.0) insights.push({ type: 'success', message: 'Team ERA of ' + teamPitchingStats.teamERA.toFixed(2) + ' is dominant!' });
      else if (teamPitchingStats.teamERA > 5.0) insights.push({ type: 'warning', message: 'ERA of ' + teamPitchingStats.teamERA.toFixed(2) + ' is high. Focus on strike percentage.' });
      if (teamPitchingStats.whip < 1.2) insights.push({ type: 'success', message: 'WHIP of ' + teamPitchingStats.whip.toFixed(2) + ' shows excellent command!' });
    }
    return insights;
  }, [teamBattingStats, teamPitchingStats]);

  const selectedPlayerData = playerRankings.find(p => p.player.id === selectedPlayerId);

  return (
    <div className="space-y-6">
      {aiInsights.length > 0 && (
        <Card className="bg-gradient-to-br from-[#38bdf8]/10 to-[#0ea5e9]/5 border-[#38bdf8]/30 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#38bdf8] p-2 rounded"><Zap className="h-5 w-5 text-[#0a0f1a]" /></div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-2">AI Team Insights</h3>
              <div className="space-y-2">
                {aiInsights.map((insight, i) => (
                  <div key={i} className={'text-[11px] ' + (insight.type === 'success' ? 'text-[#10b981]' : 'text-[#f59e0b]')}>{insight.message}</div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <TrainingPlan mode="team" gameStats={gameStats} performanceData={[...battingData.entries, ...pitchingData.entries, ...runningData.entries]} />

      <div className="flex gap-3 items-center">
        <Label className="text-[11px] text-[#94a3b8]">View:</Label>
        <div className="flex gap-2">
          <Button onClick={() => setViewMode('team')} size="sm" className={viewMode === 'team' ? 'bg-[#38bdf8] text-[#0a0f1a]' : 'bg-[#1e293b] text-[#94a3b8]'}><Users className="h-3 w-3 mr-1" />Team</Button>
          <Button onClick={() => setViewMode('player')} size="sm" className={viewMode === 'player' ? 'bg-[#38bdf8] text-[#0a0f1a]' : 'bg-[#1e293b] text-[#94a3b8]'}><Award className="h-3 w-3 mr-1" />Player</Button>
        </div>
        {viewMode === 'player' && (
          <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
            <SelectTrigger className="w-[200px] bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8"><SelectValue placeholder="Select player..." /></SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              {playerRankings.map(p => (<SelectItem key={p.player.id} value={p.player.id} className="text-[#e2e8f0]">{p.player.name}</SelectItem>))}
            </SelectContent>
          </Select>
        )}
      </div>

      {viewMode === 'team' ? (
        <Tabs defaultValue="batting" className="w-full">
          <TabsList className="bg-[#1e293b] border-[#334155]">
            <TabsTrigger value="batting" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Batting</TabsTrigger>
            <TabsTrigger value="pitching" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Pitching</TabsTrigger>
            <TabsTrigger value="fielding" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Fielding</TabsTrigger>
            <TabsTrigger value="lineup" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]"><Trophy className="h-3 w-3 mr-1" />Lineup</TabsTrigger>
          </TabsList>

          <TabsContent value="batting">
            {teamBattingStats ? (
              <div className="space-y-4">
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Batting Aggregates</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Games</div><div className="text-[18px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalGames}</div></div>
                    <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Team AVG</div><div className="text-[18px] font-semibold text-[#10b981]">{teamBattingStats.teamAvg.toFixed(3)}</div></div>
                    <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">OBP</div><div className="text-[18px] font-semibold text-[#38bdf8]">{teamBattingStats.obp.toFixed(3)}</div></div>
                    <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">SLG</div><div className="text-[18px] font-semibold text-[#f59e0b]">{teamBattingStats.slg.toFixed(3)}</div></div>
                    <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">OPS</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{teamBattingStats.ops.toFixed(3)}</div></div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Hits</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalHits}</div></div>
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Runs</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalRuns}</div></div>
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">RBI</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalRBI}</div></div>
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">2B</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalDoubles}</div></div>
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">HR</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalHomeRuns}</div></div>
                    <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">SB</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamBattingStats.totalStolenBases}</div></div>
                  </div>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Player Batting Leaders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead><tr className="text-[#64748b] border-b border-[#334155]"><th className="text-left py-2 px-2">Player</th><th className="text-center py-2 px-2">GP</th><th className="text-center py-2 px-2">AB</th><th className="text-center py-2 px-2">H</th><th className="text-center py-2 px-2">R</th><th className="text-center py-2 px-2">RBI</th><th className="text-center py-2 px-2">AVG</th><th className="text-center py-2 px-2">Exit Velo</th></tr></thead>
                      <tbody className="text-[#e2e8f0]">
                        {[...playerRankings].sort((a, b) => b.avg - a.avg).map((p) => (
                          <tr key={p.player.id} className="border-b border-[#334155]/30 hover:bg-[#1e293b]">
                            <td className="py-2 px-2 font-medium">{p.player.name}</td>
                            <td className="text-center py-2 px-2">{p.gamesPlayed}</td>
                            <td className="text-center py-2 px-2">{p.atBats}</td>
                            <td className="text-center py-2 px-2">{p.hits}</td>
                            <td className="text-center py-2 px-2">{p.runs}</td>
                            <td className="text-center py-2 px-2">{p.rbi}</td>
                            <td className="text-center py-2 px-2 font-semibold text-[#10b981]">{p.avg.toFixed(3)}</td>
                            <td className="text-center py-2 px-2 text-[#38bdf8]">{p.exitVelocityAvg > 0 ? p.exitVelocityAvg.toFixed(1) + ' mph' : '--'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><BarChart3 className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No batting data yet. Import game stats to see team aggregates.</p></Card>
            )}
          </TabsContent>

          <TabsContent value="pitching">
            {teamPitchingStats ? (
              <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Pitching Aggregates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Games</div><div className="text-[18px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalGames}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Team ERA</div><div className="text-[18px] font-semibold text-[#10b981]">{teamPitchingStats.teamERA.toFixed(2)}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">WHIP</div><div className="text-[18px] font-semibold text-[#38bdf8]">{teamPitchingStats.whip.toFixed(2)}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">K/BB</div><div className="text-[18px] font-semibold text-[#f59e0b]">{teamPitchingStats.totalWalks > 0 ? (teamPitchingStats.totalStrikeouts / teamPitchingStats.totalWalks).toFixed(2) : String(teamPitchingStats.totalStrikeouts)}</div></div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Innings</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalInnings.toFixed(1)}</div></div>
                  <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">K</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalStrikeouts}</div></div>
                  <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">BB</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalWalks}</div></div>
                  <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">H</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalHits}</div></div>
                  <div className="bg-[#1e293b] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">ER</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{teamPitchingStats.totalEarnedRuns}</div></div>
                </div>
              </Card>
            ) : (
              <Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Activity className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No pitching data yet. Import game stats with pitching metrics.</p></Card>
            )}
          </TabsContent>

          <TabsContent value="fielding">
            {teamFieldingStats ? (
              <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Fielding Aggregates</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Games</div><div className="text-[18px] font-semibold text-[#e2e8f0]">{teamFieldingStats.totalGames}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Fielding %</div><div className="text-[18px] font-semibold text-[#10b981]">{teamFieldingStats.fieldingPct.toFixed(3)}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Putouts</div><div className="text-[18px] font-semibold text-[#38bdf8]">{teamFieldingStats.totalPutouts}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Assists</div><div className="text-[18px] font-semibold text-[#f59e0b]">{teamFieldingStats.totalAssists}</div></div>
                  <div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Errors</div><div className="text-[18px] font-semibold text-[#ef4444]">{teamFieldingStats.totalErrors}</div></div>
                </div>
              </Card>
            ) : (
              <Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Target className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No fielding data yet.</p></Card>
            )}
          </TabsContent>

          <TabsContent value="lineup">
            <Card className="bg-gradient-to-br from-[#f59e0b]/10 to-[#f97316]/5 border-[#f59e0b]/30 p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#f59e0b] p-2 rounded"><Trophy className="h-5 w-5 text-[#0a0f1a]" /></div>
                <div className="flex-1">
                  <h3 className="text-[13px] font-semibold text-[#f59e0b] mb-2">AI-Optimized Batting Lineup</h3>
                  <p className="text-[11px] text-[#94a3b8]">Based on batting average, RBI production, exit velocity, and speed metrics.</p>
                </div>
              </div>
            </Card>
            <Card className="bg-[#0f172a] border-[#1e293b] p-4">
              <div className="space-y-3">
                {suggestedLineup.map((p, idx) => (
                  <div key={p.player.id} className={'bg-[#1e293b] p-4 rounded-lg border-l-4 ' + (idx === 0 ? 'border-[#10b981]' : idx === 2 ? 'border-[#f59e0b]' : idx === 3 ? 'border-[#ef4444]' : 'border-[#38bdf8]')}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-[20px] font-bold text-[#38bdf8] w-8">{p.spot}</div>
                        <div><div className="text-[13px] font-semibold text-[#e2e8f0]">{p.player.name}</div><div className="text-[10px] text-[#64748b]">{p.role}</div></div>
                      </div>
                      <div className="text-right"><div className="text-[16px] font-semibold text-[#10b981]">{p.avg.toFixed(3)}</div><div className="text-[10px] text-[#64748b]">AVG</div></div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-[#334155]">
                      <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.hits}</div><div className="text-[9px] text-[#64748b]">Hits</div></div>
                      <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.rbi}</div><div className="text-[9px] text-[#64748b]">RBI</div></div>
                      <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.exitVelocityAvg > 0 ? p.exitVelocityAvg.toFixed(0) : '--'}</div><div className="text-[9px] text-[#64748b]">Exit V</div></div>
                      <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.productivityScore.toFixed(0)}</div><div className="text-[9px] text-[#64748b]">Score</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        selectedPlayerData ? (
          <Card className="bg-[#0f172a] border-[#1e293b] p-6">
            <h3 className="text-[16px] font-semibold text-[#38bdf8] mb-4">{selectedPlayerData.player.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#1e293b] p-4 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Games</div><div className="text-[20px] font-semibold text-[#e2e8f0]">{selectedPlayerData.gamesPlayed}</div></div>
              <div className="bg-[#1e293b] p-4 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Batting AVG</div><div className="text-[20px] font-semibold text-[#10b981]">{selectedPlayerData.avg.toFixed(3)}</div></div>
              <div className="bg-[#1e293b] p-4 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">RBI</div><div className="text-[20px] font-semibold text-[#f59e0b]">{selectedPlayerData.rbi}</div></div>
              <div className="bg-[#1e293b] p-4 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Exit Velocity</div><div className="text-[20px] font-semibold text-[#38bdf8]">{selectedPlayerData.exitVelocityAvg > 0 ? selectedPlayerData.exitVelocityAvg.toFixed(1) : '--'}</div></div>
            </div>
          </Card>
        ) : (
          <Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Award className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">Select a player to view their stats</p></Card>
        )
      )}
    </div>
  );
}



