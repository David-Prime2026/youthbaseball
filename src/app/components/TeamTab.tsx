import { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePlayerData } from '../hooks/usePlayerData';
import { useGameStats } from '../hooks/useGameStats';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { Users, TrendingUp, Target, Award, Zap, BarChart3, Activity, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { TrainingPlan } from './TrainingPlan';

export function TeamTab() {
  const { players } = usePlayerData();
  const { gameStats } = useGameStats();
  const battingData = usePerformanceData('batting');
  const pitchingData = usePerformanceData('pitching');
  const runningData = usePerformanceData('running');

  const [viewMode, setViewMode] = useState<'team' | 'player'>('team');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [showBattingLeaders, setShowBattingLeaders] = useState(false);
  const [showPitchingLeaders, setShowPitchingLeaders] = useState(false);
  const [showFieldingLeaders, setShowFieldingLeaders] = useState(false);

  const teamBattingStats = useMemo(() => {
    if (gameStats.length === 0) return null;
    const totalGP = gameStats.reduce((max, s) => Math.max(max, s.gamesPlayed || 0), 0);
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
    const totalPA = gameStats.reduce((sum, s) => sum + (s.plateAppearances || 0), 0);
    const teamAvg = totalAtBats > 0 ? totalHits / totalAtBats : 0;
    const obp = (totalAtBats + totalWalks) > 0 ? (totalHits + totalWalks) / (totalAtBats + totalWalks) : 0;
    const totalBases = totalHits + totalDoubles + (totalTriples * 2) + (totalHomeRuns * 3);
    const slg = totalAtBats > 0 ? totalBases / totalAtBats : 0;
    return { totalGP, totalAtBats, totalHits, totalRuns, totalRBI, totalDoubles, totalTriples, totalHomeRuns, totalWalks, totalStrikeouts, totalStolenBases, totalPA, teamAvg, obp, slg, ops: obp + slg, totalBases };
  }, [gameStats]);

  const teamPitchingStats = useMemo(() => {
    const pg = gameStats.filter(s => s.inningsPitched && s.inningsPitched > 0);
    if (pg.length === 0) return null;
    const totalIP = pg.reduce((sum, s) => sum + (s.inningsPitched || 0), 0);
    const totalER = pg.reduce((sum, s) => sum + (s.earnedRuns || 0), 0);
    const totalK = pg.reduce((sum, s) => sum + (s.strikeoutsPitching || 0), 0);
    const totalBB = pg.reduce((sum, s) => sum + (s.walksPitching || 0), 0);
    const totalH = pg.reduce((sum, s) => sum + (s.hitsAllowed || 0), 0);
    const totalBF = pg.reduce((sum, s) => sum + (s.battersFaced || 0), 0);
    const totalPC = pg.reduce((sum, s) => sum + (s.pitchCount || 0), 0);
    const totalW = pg.reduce((sum, s) => sum + (s.wins || 0), 0);
    const totalL = pg.reduce((sum, s) => sum + (s.losses || 0), 0);
    const era = totalIP > 0 ? (totalER / totalIP) * 6 : 0;
    const whip = totalIP > 0 ? (totalBB + totalH) / totalIP : 0;
    return { totalGames: pg.length, totalIP, totalER, totalK, totalBB, totalH, totalBF, totalPC, totalW, totalL, era, whip };
  }, [gameStats]);

  const teamFieldingStats = useMemo(() => {
    const fg = gameStats.filter(s => s.totalChances || s.errors);
    if (fg.length === 0) return null;
    const tc = fg.reduce((sum, s) => sum + (s.totalChances || 0), 0);
    const po = fg.reduce((sum, s) => sum + (s.putouts || 0), 0);
    const a = fg.reduce((sum, s) => sum + (s.assists || 0), 0);
    const e = fg.reduce((sum, s) => sum + (s.errors || 0), 0);
    const pct = tc > 0 ? (po + a) / tc : 0;
    return { tc, po, a, e, pct };
  }, [gameStats]);

  const playerRankings = useMemo(() => {
    return players.map(player => {
      const pgs = gameStats.filter(s => s.playerId === player.id);
      const pb = battingData.entries.filter(e => e.playerId === player.id);
      const pp = pitchingData.entries.filter(e => e.playerId === player.id);
      const pr = runningData.entries.filter(e => e.playerId === player.id);
      const gp = pgs.reduce((sum, s) => sum + (s.gamesPlayed || 0), 0);
      const ab = pgs.reduce((sum, s) => sum + (s.atBats || 0), 0);
      const h = pgs.reduce((sum, s) => sum + (s.hits || 0), 0);
      const r = pgs.reduce((sum, s) => sum + (s.runs || 0), 0);
      const rbi = pgs.reduce((sum, s) => sum + (s.rbi || 0), 0);
      const hr = pgs.reduce((sum, s) => sum + (s.homeRuns || 0), 0);
      const bb = pgs.reduce((sum, s) => sum + (s.walks || 0), 0);
      const k = pgs.reduce((sum, s) => sum + (s.strikeouts || 0), 0);
      const sb = pgs.reduce((sum, s) => sum + (s.stolenBases || 0), 0);
      const doubles = pgs.reduce((sum, s) => sum + (s.doubles || 0), 0);
      const avg = ab > 0 ? h / ab : 0;
      const obp = (ab + bb) > 0 ? (h + bb) / (ab + bb) : 0;
      const tb = h + doubles + (hr * 3);
      const slg = ab > 0 ? tb / ab : 0;
      const ip = pgs.reduce((sum, s) => sum + (s.inningsPitched || 0), 0);
      const era = pgs.length > 0 && ip > 0 ? (pgs.reduce((sum, s) => sum + (s.earnedRuns || 0), 0) / ip) * 6 : 0;
      const whip = pgs.length > 0 && ip > 0 ? (pgs.reduce((sum, s) => sum + (s.walksPitching || 0), 0) + pgs.reduce((sum, s) => sum + (s.hitsAllowed || 0), 0)) / ip : 0;
      const kP = pgs.reduce((sum, s) => sum + (s.strikeoutsPitching || 0), 0);
      const tc = pgs.reduce((sum, s) => sum + (s.totalChances || 0), 0);
      const errors = pgs.reduce((sum, s) => sum + (s.errors || 0), 0);
      const fpct = tc > 0 ? (tc - errors) / tc : 0;
      const evData = pb.filter(e => e.metricType === 'Exit Velocity');
      const evAvg = evData.length > 0 ? evData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / evData.flatMap(e => e.reps).length : 0;
      const pvData = pp.filter(e => e.metricType === 'Throwing Velocity');
      const pvAvg = pvData.length > 0 ? pvData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / pvData.flatMap(e => e.reps).length : 0;
      const dashData = pr.filter(e => e.metricType === '60-Yard Dash' || e.metricType === '30-Yard Dash');
      const dashAvg = dashData.length > 0 ? dashData.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / dashData.flatMap(e => e.reps).length : 0;
      const score = (avg * 100) + (rbi * 2) + (r * 1.5) + (evAvg * 0.1);
      return { player, gp, ab, h, r, rbi, hr, bb, k, sb, doubles, avg, obp, slg, ops: obp + slg, ip, era, whip, kP, tc, errors, fpct, evAvg, pvAvg, dashAvg, score };
    }).filter(p => p.gp > 0 || p.ab > 0);
  }, [players, gameStats, battingData.entries, pitchingData.entries, runningData.entries]);

  const suggestedLineup = useMemo(() => {
    const lineup = [...playerRankings].sort((a, b) => b.score - a.score);
    const r: any[] = [];
    const used: any[] = [];
    const pick = (filter: (p: any) => boolean, fallbackIdx: number) => {
      const p = lineup.filter(x => !used.includes(x) && filter(x))[0] || lineup.filter(x => !used.includes(x))[0];
      if (p) used.push(p);
      return p;
    };
    const l = pick(p => p.dashAvg > 0 && p.avg > 0.250, 0);
    if (l) r.push({ ...l, spot: 1, role: 'Leadoff - Get on base' });
    const s = pick(p => p.avg > 0.250, 1);
    if (s) r.push({ ...s, spot: 2, role: 'Contact - Move runners' });
    const t = pick(p => true, 2);
    if (t) r.push({ ...t, spot: 3, role: 'Best hitter' });
    const c = pick(p => p.evAvg > 0, 3);
    if (c) r.push({ ...c, spot: 4, role: 'Cleanup - Power' });
    const rest = lineup.filter(x => !used.includes(x));
    rest.forEach((p, i) => r.push({ ...p, spot: i + 5, role: i === rest.length - 1 ? 'Speed/Defense' : 'Depth' }));
    return r.slice(0, 9);
  }, [playerRankings]);

  const aiInsights = useMemo(() => {
    const ins: { type: string; message: string }[] = [];
    if (teamBattingStats) {
      if (teamBattingStats.teamAvg > 0.350) ins.push({ type: 's', message: 'Team batting average of ' + teamBattingStats.teamAvg.toFixed(3) + ' is elite!' });
      else if (teamBattingStats.teamAvg < 0.250) ins.push({ type: 'w', message: 'Team batting average is ' + teamBattingStats.teamAvg.toFixed(3) + '. Focus on contact drills.' });
      if (teamBattingStats.totalStrikeouts > teamBattingStats.totalHits) ins.push({ type: 'w', message: 'More K (' + teamBattingStats.totalStrikeouts + ') than H (' + teamBattingStats.totalHits + '). Work plate discipline.' });
      if (teamBattingStats.ops > 0.800) ins.push({ type: 's', message: 'OPS of ' + teamBattingStats.ops.toFixed(3) + ' shows strong offense!' });
    }
    if (teamPitchingStats) {
      if (teamPitchingStats.era < 3.0) ins.push({ type: 's', message: 'Team ERA of ' + teamPitchingStats.era.toFixed(2) + ' is dominant!' });
      else if (teamPitchingStats.era > 5.0) ins.push({ type: 'w', message: 'ERA of ' + teamPitchingStats.era.toFixed(2) + ' is high. Focus on strike %.' });
      if (teamPitchingStats.whip < 1.2) ins.push({ type: 's', message: 'WHIP of ' + teamPitchingStats.whip.toFixed(2) + ' — excellent command!' });
    }
    return ins;
  }, [teamBattingStats, teamPitchingStats]);

  const sel = playerRankings.find(p => p.player.id === selectedPlayerId);

  const SI = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div className="bg-[#1e293b] p-3 rounded text-center">
      <div className="text-[10px] text-[#64748b] mb-1">{label}</div>
      <div className={'text-[18px] font-semibold ' + (color || 'text-[#e2e8f0]')}>{value}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      {aiInsights.length > 0 && (
        <Card className="bg-gradient-to-br from-[#38bdf8]/10 to-[#0ea5e9]/5 border-[#38bdf8]/30 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-[#38bdf8] p-2 rounded"><Zap className="h-5 w-5 text-[#0a0f1a]" /></div>
            <div className="flex-1">
              <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-2">Quick Insights</h3>
              <div className="space-y-1">{aiInsights.map((ins, i) => (<div key={i} className={'text-[11px] ' + (ins.type === 's' ? 'text-[#10b981]' : 'text-[#f59e0b]')}>{ins.message}</div>))}</div>
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
            <SelectContent className="bg-[#1e293b] border-[#334155]">{playerRankings.map(p => (<SelectItem key={p.player.id} value={p.player.id} className="text-[#e2e8f0]">{p.player.name}</SelectItem>))}</SelectContent>
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
                  <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Batting ({teamBattingStats.totalGP} games)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <SI label="AVG" value={teamBattingStats.teamAvg.toFixed(3)} color="text-[#10b981]" />
                    <SI label="OBP" value={teamBattingStats.obp.toFixed(3)} color="text-[#38bdf8]" />
                    <SI label="SLG" value={teamBattingStats.slg.toFixed(3)} color="text-[#f59e0b]" />
                    <SI label="OPS" value={teamBattingStats.ops.toFixed(3)} color="text-[#8b5cf6]" />
                    <SI label="PA" value={teamBattingStats.totalPA} />
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    <SI label="H" value={teamBattingStats.totalHits} />
                    <SI label="R" value={teamBattingStats.totalRuns} />
                    <SI label="RBI" value={teamBattingStats.totalRBI} />
                    <SI label="2B" value={teamBattingStats.totalDoubles} />
                    <SI label="HR" value={teamBattingStats.totalHomeRuns} />
                    <SI label="SB" value={teamBattingStats.totalStolenBases} />
                    <SI label="K" value={teamBattingStats.totalStrikeouts} color="text-[#ef4444]" />
                  </div>
                </Card>

                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <button onClick={() => setShowBattingLeaders(!showBattingLeaders)} className="w-full flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-[#38bdf8]">Player Batting Leaders</h3>
                    {showBattingLeaders ? <ChevronUp className="h-4 w-4 text-[#64748b]" /> : <ChevronDown className="h-4 w-4 text-[#64748b]" />}
                  </button>
                  {showBattingLeaders && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-[11px]">
                        <thead><tr className="text-[#64748b] border-b border-[#334155]"><th className="text-left py-2 px-2">Player</th><th className="text-center py-2 px-1">GP</th><th className="text-center py-2 px-1">AB</th><th className="text-center py-2 px-1">H</th><th className="text-center py-2 px-1">R</th><th className="text-center py-2 px-1">RBI</th><th className="text-center py-2 px-1">2B</th><th className="text-center py-2 px-1">HR</th><th className="text-center py-2 px-1">BB</th><th className="text-center py-2 px-1">K</th><th className="text-center py-2 px-1">SB</th><th className="text-center py-2 px-1">AVG</th><th className="text-center py-2 px-1">OBP</th><th className="text-center py-2 px-1">SLG</th><th className="text-center py-2 px-1">EV</th></tr></thead>
                        <tbody className="text-[#e2e8f0]">{[...playerRankings].sort((a, b) => b.avg - a.avg).map(p => (
                          <tr key={p.player.id} className="border-b border-[#334155]/30 hover:bg-[#1e293b]">
                            <td className="py-2 px-2 font-medium">{p.player.name}</td>
                            <td className="text-center py-2 px-1">{p.gp}</td>
                            <td className="text-center py-2 px-1">{p.ab}</td>
                            <td className="text-center py-2 px-1">{p.h}</td>
                            <td className="text-center py-2 px-1">{p.r}</td>
                            <td className="text-center py-2 px-1">{p.rbi}</td>
                            <td className="text-center py-2 px-1">{p.doubles}</td>
                            <td className="text-center py-2 px-1">{p.hr}</td>
                            <td className="text-center py-2 px-1">{p.bb}</td>
                            <td className="text-center py-2 px-1 text-[#ef4444]">{p.k}</td>
                            <td className="text-center py-2 px-1">{p.sb}</td>
                            <td className="text-center py-2 px-1 font-semibold text-[#10b981]">{p.avg.toFixed(3)}</td>
                            <td className="text-center py-2 px-1 text-[#38bdf8]">{p.obp.toFixed(3)}</td>
                            <td className="text-center py-2 px-1 text-[#f59e0b]">{p.slg.toFixed(3)}</td>
                            <td className="text-center py-2 px-1 text-[#8b5cf6]">{p.evAvg > 0 ? p.evAvg.toFixed(0) : '--'}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            ) : (<Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><BarChart3 className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No batting data. Import game stats first.</p></Card>)}
          </TabsContent>

          <TabsContent value="pitching">
            {teamPitchingStats ? (
              <div className="space-y-4">
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Pitching</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <SI label="ERA" value={teamPitchingStats.era.toFixed(2)} color="text-[#10b981]" />
                    <SI label="WHIP" value={teamPitchingStats.whip.toFixed(2)} color="text-[#38bdf8]" />
                    <SI label="K/BB" value={teamPitchingStats.totalBB > 0 ? (teamPitchingStats.totalK / teamPitchingStats.totalBB).toFixed(2) : String(teamPitchingStats.totalK)} color="text-[#f59e0b]" />
                    <SI label="W-L" value={teamPitchingStats.totalW + '-' + teamPitchingStats.totalL} />
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <SI label="IP" value={teamPitchingStats.totalIP.toFixed(1)} />
                    <SI label="K" value={teamPitchingStats.totalK} />
                    <SI label="BB" value={teamPitchingStats.totalBB} color="text-[#ef4444]" />
                    <SI label="H" value={teamPitchingStats.totalH} />
                    <SI label="ER" value={teamPitchingStats.totalER} />
                    <SI label="BF" value={teamPitchingStats.totalBF} />
                  </div>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <button onClick={() => setShowPitchingLeaders(!showPitchingLeaders)} className="w-full flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-[#38bdf8]">Pitcher Leaders</h3>
                    {showPitchingLeaders ? <ChevronUp className="h-4 w-4 text-[#64748b]" /> : <ChevronDown className="h-4 w-4 text-[#64748b]" />}
                  </button>
                  {showPitchingLeaders && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-[11px]">
                        <thead><tr className="text-[#64748b] border-b border-[#334155]"><th className="text-left py-2 px-2">Player</th><th className="text-center py-2 px-1">IP</th><th className="text-center py-2 px-1">ERA</th><th className="text-center py-2 px-1">WHIP</th><th className="text-center py-2 px-1">K</th><th className="text-center py-2 px-1">BB</th><th className="text-center py-2 px-1">W</th><th className="text-center py-2 px-1">L</th><th className="text-center py-2 px-1">Velo</th></tr></thead>
                        <tbody className="text-[#e2e8f0]">{playerRankings.filter(p => p.ip > 0).sort((a, b) => a.era - b.era).map(p => (
                          <tr key={p.player.id} className="border-b border-[#334155]/30 hover:bg-[#1e293b]">
                            <td className="py-2 px-2 font-medium">{p.player.name}</td>
                            <td className="text-center py-2 px-1">{p.ip.toFixed(1)}</td>
                            <td className="text-center py-2 px-1 font-semibold text-[#10b981]">{p.era.toFixed(2)}</td>
                            <td className="text-center py-2 px-1 text-[#38bdf8]">{p.whip.toFixed(2)}</td>
                            <td className="text-center py-2 px-1">{p.kP}</td>
                            <td className="text-center py-2 px-1 text-[#ef4444]">{p.player.name && playerRankings.find(x => x.player.id === p.player.id) ? gameStats.filter(s => s.playerId === p.player.id).reduce((sum, s) => sum + (s.walksPitching || 0), 0) : 0}</td>
                            <td className="text-center py-2 px-1">{gameStats.filter(s => s.playerId === p.player.id).reduce((sum, s) => sum + (s.wins || 0), 0)}</td>
                            <td className="text-center py-2 px-1">{gameStats.filter(s => s.playerId === p.player.id).reduce((sum, s) => sum + (s.losses || 0), 0)}</td>
                            <td className="text-center py-2 px-1 text-[#8b5cf6]">{p.pvAvg > 0 ? p.pvAvg.toFixed(0) : '--'}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            ) : (<Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Activity className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No pitching data.</p></Card>)}
          </TabsContent>

          <TabsContent value="fielding">
            {teamFieldingStats ? (
              <div className="space-y-4">
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-4">Team Fielding</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <SI label="FPCT" value={teamFieldingStats.pct.toFixed(3)} color="text-[#10b981]" />
                    <SI label="TC" value={teamFieldingStats.tc} />
                    <SI label="PO" value={teamFieldingStats.po} color="text-[#38bdf8]" />
                    <SI label="A" value={teamFieldingStats.a} color="text-[#f59e0b]" />
                    <SI label="E" value={teamFieldingStats.e} color="text-[#ef4444]" />
                  </div>
                </Card>
                <Card className="bg-[#0f172a] border-[#1e293b] p-4">
                  <button onClick={() => setShowFieldingLeaders(!showFieldingLeaders)} className="w-full flex items-center justify-between">
                    <h3 className="text-[13px] font-semibold text-[#38bdf8]">Fielding Leaders</h3>
                    {showFieldingLeaders ? <ChevronUp className="h-4 w-4 text-[#64748b]" /> : <ChevronDown className="h-4 w-4 text-[#64748b]" />}
                  </button>
                  {showFieldingLeaders && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-[11px]">
                        <thead><tr className="text-[#64748b] border-b border-[#334155]"><th className="text-left py-2 px-2">Player</th><th className="text-center py-2 px-1">TC</th><th className="text-center py-2 px-1">PO</th><th className="text-center py-2 px-1">A</th><th className="text-center py-2 px-1">E</th><th className="text-center py-2 px-1">FPCT</th></tr></thead>
                        <tbody className="text-[#e2e8f0]">{playerRankings.filter(p => p.tc > 0).sort((a, b) => b.fpct - a.fpct).map(p => (
                          <tr key={p.player.id} className="border-b border-[#334155]/30 hover:bg-[#1e293b]">
                            <td className="py-2 px-2 font-medium">{p.player.name}</td>
                            <td className="text-center py-2 px-1">{p.tc}</td>
                            <td className="text-center py-2 px-1">{gameStats.filter(s => s.playerId === p.player.id).reduce((sum, s) => sum + (s.putouts || 0), 0)}</td>
                            <td className="text-center py-2 px-1">{gameStats.filter(s => s.playerId === p.player.id).reduce((sum, s) => sum + (s.assists || 0), 0)}</td>
                            <td className="text-center py-2 px-1 text-[#ef4444]">{p.errors}</td>
                            <td className="text-center py-2 px-1 font-semibold text-[#10b981]">{p.fpct.toFixed(3)}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            ) : (<Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Target className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No fielding data.</p></Card>)}
          </TabsContent>

          <TabsContent value="lineup">
            <Card className="bg-gradient-to-br from-[#f59e0b]/10 to-[#f97316]/5 border-[#f59e0b]/30 p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-[#f59e0b] p-2 rounded"><Trophy className="h-5 w-5 text-[#0a0f1a]" /></div>
                <div><h3 className="text-[13px] font-semibold text-[#f59e0b] mb-1">AI-Optimized Lineup</h3><p className="text-[11px] text-[#94a3b8]">Based on AVG, RBI, exit velocity, and speed.</p></div>
              </div>
            </Card>
            <Card className="bg-[#0f172a] border-[#1e293b] p-4">
              <div className="space-y-3">{suggestedLineup.map((p, idx) => (
                <div key={p.player.id} className={'bg-[#1e293b] p-4 rounded-lg border-l-4 ' + (idx === 0 ? 'border-[#10b981]' : idx === 2 ? 'border-[#f59e0b]' : idx === 3 ? 'border-[#ef4444]' : 'border-[#38bdf8]')}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-[20px] font-bold text-[#38bdf8] w-8">{p.spot}</div>
                      <div><div className="text-[13px] font-semibold text-[#e2e8f0]">{p.player.name}</div><div className="text-[10px] text-[#64748b]">{p.role}</div></div>
                    </div>
                    <div className="text-right"><div className="text-[16px] font-semibold text-[#10b981]">{p.avg.toFixed(3)}</div><div className="text-[10px] text-[#64748b]">AVG</div></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#334155]">
                    <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.h}</div><div className="text-[9px] text-[#64748b]">H</div></div>
                    <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.rbi}</div><div className="text-[9px] text-[#64748b]">RBI</div></div>
                    <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.r}</div><div className="text-[9px] text-[#64748b]">R</div></div>
                    <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.evAvg > 0 ? p.evAvg.toFixed(0) : '--'}</div><div className="text-[9px] text-[#64748b]">EV</div></div>
                    <div className="text-center"><div className="text-[11px] font-medium text-[#e2e8f0]">{p.score.toFixed(0)}</div><div className="text-[9px] text-[#64748b]">Score</div></div>
                  </div>
                </div>
              ))}</div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : sel ? (
        <Card className="bg-[#0f172a] border-[#1e293b] p-6">
          <h3 className="text-[16px] font-semibold text-[#38bdf8] mb-4">{sel.player.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <SI label="Games" value={sel.gp} />
            <SI label="AVG" value={sel.avg.toFixed(3)} color="text-[#10b981]" />
            <SI label="OBP" value={sel.obp.toFixed(3)} color="text-[#38bdf8]" />
            <SI label="OPS" value={sel.ops.toFixed(3)} color="text-[#8b5cf6]" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            <SI label="H" value={sel.h} />
            <SI label="R" value={sel.r} />
            <SI label="RBI" value={sel.rbi} />
            <SI label="HR" value={sel.hr} />
            <SI label="SB" value={sel.sb} />
            <SI label="K" value={sel.k} color="text-[#ef4444]" />
          </div>
          {sel.ip > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <SI label="IP" value={sel.ip.toFixed(1)} />
              <SI label="ERA" value={sel.era.toFixed(2)} color="text-[#10b981]" />
              <SI label="WHIP" value={sel.whip.toFixed(2)} color="text-[#38bdf8]" />
              <SI label="K (pitching)" value={sel.kP} />
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SI label="Exit Velo" value={sel.evAvg > 0 ? sel.evAvg.toFixed(1) + ' mph' : '--'} color="text-[#8b5cf6]" />
            <SI label="Pitch Velo" value={sel.pvAvg > 0 ? sel.pvAvg.toFixed(1) + ' mph' : '--'} color="text-[#f59e0b]" />
            <SI label="FPCT" value={sel.fpct.toFixed(3)} color="text-[#10b981]" />
            <SI label="Errors" value={sel.errors} color="text-[#ef4444]" />
          </div>
        </Card>
      ) : (
        <Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Award className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">Select a player to view stats</p></Card>
      )}
    </div>
  );
}
