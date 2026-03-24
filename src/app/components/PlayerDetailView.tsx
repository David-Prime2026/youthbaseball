import { useState, useEffect } from 'react';
import { Player } from '../types/player';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Calendar, Users, TrendingUp, Camera, Edit2, Mail, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useGameStats } from '../hooks/useGameStats';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { PerformanceEntry } from '../types/performance';
import { supabase } from '../../supabaseClient';
import { CoachObservations } from './CoachObservations';
import { TrainingPlan } from './TrainingPlan';
import { useObservations } from '../hooks/useObservations';

interface PlayerDetailViewProps {
  player: Player;
  onClose: () => void;
  onEdit: () => void;
}

export function PlayerDetailView({ player, onClose, onEdit }: PlayerDetailViewProps) {
  const { gameStats } = useGameStats();
  const battingPerf = usePerformanceData('batting');
  const pitchingPerf = usePerformanceData('pitching');
  const runningPerf = usePerformanceData('running');
  const strengthPerf = usePerformanceData('strength');

  const { observations: playerObservations } = useObservations(player.id);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const playerGameStats = gameStats.filter(s => s.playerId === player.id);
  const gp = playerGameStats.reduce((sum: number, s: any) => sum + (s.gamesPlayed || 0), 0);
  const totalAB = playerGameStats.reduce((sum: number, s: any) => sum + (s.atBats || 0), 0);
  const totalHitsAll = playerGameStats.reduce((sum: number, s: any) => sum + (s.hits || 0), 0);
  const totalRuns = playerGameStats.reduce((sum: number, s: any) => sum + (s.runs || 0), 0);
  const totalRBI = playerGameStats.reduce((sum: number, s: any) => sum + (s.rbi || 0), 0);
  const totalSB = playerGameStats.reduce((sum: number, s: any) => sum + (s.stolenBases || 0), 0);
  const totalBB = playerGameStats.reduce((sum: number, s: any) => sum + (s.walks || 0), 0);
  const totalK = playerGameStats.reduce((sum: number, s: any) => sum + (s.strikeouts || 0), 0);
  const totalHR = playerGameStats.reduce((sum: number, s: any) => sum + (s.homeRuns || 0), 0);
  const total2B = playerGameStats.reduce((sum: number, s: any) => sum + (s.doubles || 0), 0);
  const seasonAvg = totalAB > 0 ? totalHitsAll / totalAB : 0;
  const seasonOBP = (totalAB + totalBB) > 0 ? (totalHitsAll + totalBB) / (totalAB + totalBB) : 0;
  const seasonSLG = totalAB > 0 ? (totalHitsAll + total2B + (totalHR * 3)) / totalAB : 0;
  const battingData = battingPerf.entries.filter(e => e.playerId === player.id);
  const pitchingData = pitchingPerf.entries.filter(e => e.playerId === player.id);
  const runningData = runningPerf.entries.filter(e => e.playerId === player.id);
  const strengthData = strengthPerf.entries.filter(e => e.playerId === player.id);
  const allPlayerData = [...battingData, ...pitchingData, ...runningData, ...strengthData];

  const getMetricAverage = (data: PerformanceEntry[], metricType: string) => {
    const filtered = data.filter(e => e.metricType === metricType);
    const allReps = filtered.flatMap(e => e.reps).filter(r => r > 0);
    return allReps.length > 0 ? allReps.reduce((a, b) => a + b, 0) / allReps.length : 0;
  };

  const exitVelocityAvg = getMetricAverage(battingData, 'Exit Velocity');
  const batSpeedAvg = getMetricAverage(battingData, 'Bat Speed');
  const runningSpeedAvg = getMetricAverage(runningData, '60-Yard Dash');
  const pitchVelocityAvg = getMetricAverage(pitchingData, 'Throwing Velocity');

  const gameAvgHits = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.hits || 0), 0) / playerGameStats.length : 0;
  const gameAvgRuns = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.runs || 0), 0) / playerGameStats.length : 0;
  const gameAvgRBI = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.rbi || 0), 0) / playerGameStats.length : 0;
  const gameAvgAtBats = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.atBats || 0), 0) / playerGameStats.length : 0;
  const gameAvgSteals = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.stolenBases || 0), 0) / playerGameStats.length : 0;
  const gameAvg = playerGameStats.length > 0 ? playerGameStats.reduce((sum, s) => sum + (s.average || 0), 0) / playerGameStats.length : 0;

  const age = player.dateOfBirth ? Math.floor((new Date().getTime() - new Date(player.dateOfBirth).getTime()) / 31536000000) : null;

  const generateAIInsights = async () => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          performanceData: allPlayerData.slice(0, 20),
          gameStats: playerGameStats.slice(0, 15),
          playerName: player.name,
          category: 'Player Profile',
          observations: playerObservations.map(o => ({ category: o.category, content: o.content, rating: o.rating, date: o.date })),
        },
      });
      if (error) throw error;
      if (data?.insights && Array.isArray(data.insights)) {
        setAiInsights(data.insights);
      }
    } catch (error) {
      console.error('AI Insights error:', error);
      setAiInsights([{ type: 'neutral', title: 'Analysis Unavailable', description: 'Could not generate insights right now.' }]);
    } finally {
      setAiLoading(false);
      setAiGenerated(true);
      setAiCollapsed(false);
    }
  };

  const handleEmailSummary = () => {
    if (!player.contactEmail) {
      alert('No email address on file. Please add one in the player profile editor.');
      return;
    }
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const totalHits = playerGameStats.reduce((sum, s) => sum + (s.hits || 0), 0);
    const totalAtBats = playerGameStats.reduce((sum, s) => sum + (s.atBats || 0), 0);
    const seasonAvg = totalAtBats > 0 ? (totalHits / totalAtBats).toFixed(3) : '.000';
    const totalRuns = playerGameStats.reduce((sum, s) => sum + (s.runs || 0), 0);
    const totalRBI = playerGameStats.reduce((sum, s) => sum + (s.rbi || 0), 0);
    const totalSB = playerGameStats.reduce((sum, s) => sum + (s.stolenBases || 0), 0);

    const body = [
      'Hi!',
      '',
      player.name + "'s Performance Summary - " + date,
      '================================',
      '',
      'GAME STATISTICS (' + playerGameStats.length + ' games)',
      '--------------------------------',
      'Batting Average: ' + seasonAvg,
      'Total Hits: ' + totalHits,
      'Total Runs: ' + totalRuns,
      'Total RBI: ' + totalRBI,
      'Stolen Bases: ' + totalSB,
      '',
      'TRAINING METRICS',
      '--------------------------------',
      exitVelocityAvg > 0 ? 'Exit Velocity: ' + exitVelocityAvg.toFixed(1) + ' mph' : '',
      batSpeedAvg > 0 ? 'Bat Speed: ' + batSpeedAvg.toFixed(1) + ' mph' : '',
      pitchVelocityAvg > 0 ? 'Throwing Velocity: ' + pitchVelocityAvg.toFixed(1) + ' mph' : '',
      runningSpeedAvg > 0 ? '60-Yard Dash: ' + runningSpeedAvg.toFixed(2) + ' sec' : '',
      '',
      'Total Training Sessions: ' + allPlayerData.length,
      '',
      'Keep up the great work!',
      '',
      '- Premier Select Coaching Staff',
      'Tracked with Premier Select Performance System',
    ].filter(line => line !== '').join('\n');

    const subject = encodeURIComponent(player.name + ' - Performance Summary (' + new Date().toLocaleDateString() + ')');
    const encodedBody = encodeURIComponent(body);
    window.location.href = 'mailto:' + player.contactEmail + '?subject=' + subject + '&body=' + encodedBody;
  };

  const insightColors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]' },
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6 max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#1e293b]">
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-lg bg-[#1e293b] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center flex-shrink-0">
              {player.photo ? (<img src={player.photo} alt={player.name} className="w-full h-full object-cover" />) : (<Camera className="h-10 w-10 text-[#64748b]" />)}
            </div>
            <div className="flex-1">
              <h2 className="text-[20px] font-semibold text-[#f1f5f9] mb-2">{(() => { const stat = playerGameStats[0]; const num = stat?.playerNumber; return num && num !== "N/A" ? "#" + num + " " + player.name : player.name; })()}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-[#1e293b] px-3 py-2 rounded"><span className="text-[#64748b]">Age Group</span><p className="text-[#e2e8f0] font-medium">{player.ageGroup}</p></div>
                {age && (<div className="bg-[#1e293b] px-3 py-2 rounded"><span className="text-[#64748b]">Age</span><p className="text-[#e2e8f0] font-medium">{age} years</p></div>)}
                <div className="bg-[#1e293b] px-3 py-2 rounded"><span className="text-[#64748b]">Throws / Bats</span><p className="text-[#e2e8f0] font-medium">{player.throwingHand[0]} / {player.battingHand[0]}</p></div>
                <div className="bg-[#1e293b] px-3 py-2 rounded"><span className="text-[#64748b]">Positions</span><p className="text-[#e2e8f0] font-medium">{player.positions.length > 0 ? player.positions.join(', ') : 'None'}</p></div>
              </div>
              {player.dateOfBirth && (<div className="mt-2 text-[10px] text-[#64748b] flex items-center gap-1"><Calendar className="h-3 w-3" />DOB: {new Date(player.dateOfBirth).toLocaleDateString()}</div>)}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEmailSummary} size="sm" className="bg-[#10b981] text-white hover:bg-[#059669]"><Mail className="h-3 w-3 mr-1" />Email</Button>
            <Button onClick={onEdit} size="sm" className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"><Edit2 className="h-3 w-3 mr-1" />Edit</Button>
            <Button onClick={onClose} size="sm" variant="outline" className="border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]"><X className="h-4 w-4" /></Button>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-[#38bdf8]/10 to-[#0ea5e9]/5 border-[#38bdf8]/30 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => aiGenerated && setAiCollapsed(!aiCollapsed)} className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#38bdf8]" /><h3 className="text-[13px] font-semibold text-[#38bdf8]">AI Player Insights</h3>{aiGenerated && (aiCollapsed ? <ChevronDown className="h-4 w-4 text-[#64748b]" /> : <ChevronUp className="h-4 w-4 text-[#64748b]" />)}</button>
            <Button onClick={generateAIInsights} disabled={aiLoading} size="sm" className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]">
              {aiLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>) : aiGenerated ? 'Refresh' : 'Generate Insights'}
            </Button>
          </div>
          {aiCollapsed ? null : aiLoading && (<div className="text-center py-4"><Loader2 className="h-6 w-6 text-[#38bdf8] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Analyzing {player.name}'s data...</p></div>)}
          {aiCollapsed ? null : aiGenerated && !aiLoading && (
            <div className="space-y-2">
              {aiInsights.map((insight, i) => {
                const style = insightColors[insight.type] || insightColors.neutral;
                return (<div key={i} className={style.bg + ' ' + style.border + ' border p-3 rounded-lg'}><h4 className={'text-[12px] font-medium ' + style.text + ' mb-1'}>{insight.title}</h4><p className="text-[11px] text-[#94a3b8]">{insight.description}</p></div>);
              })}
            </div>
          )}
          {aiCollapsed ? null : !aiGenerated && !aiLoading && (<p className="text-[11px] text-[#64748b] text-center py-2">Click "Generate Insights" for personalized AI analysis</p>)}
        </Card>

        <CoachObservations playerId={player.id} playerName={player.name} />

        <TrainingPlan playerName={player.name} playerId={player.id} gameStats={playerGameStats} performanceData={allPlayerData} mode="player" />

        <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4"><h3 className="text-[12px] font-medium text-[#38bdf8] mb-3">Training Performance Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Exit Velocity</div><div className="text-[18px] font-semibold text-[#10b981]">{exitVelocityAvg > 0 ? exitVelocityAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Bat Speed</div><div className="text-[18px] font-semibold text-[#38bdf8]">{batSpeedAvg > 0 ? batSpeedAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">60-Yard Dash</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{runningSpeedAvg > 0 ? runningSpeedAvg.toFixed(2) : '--'}<span className="text-[10px] text-[#64748b] ml-1">sec</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Pitch Velocity</div><div className="text-[18px] font-semibold text-[#f59e0b]">{pitchVelocityAvg > 0 ? pitchVelocityAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
          <h3 className="text-[12px] font-medium text-[#38bdf8] mb-3">Season Stats ({gp} games)</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG</div><div className="text-[18px] font-semibold text-[#10b981]">{seasonAvg > 0 ? seasonAvg.toFixed(3) : '.000'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">OBP</div><div className="text-[18px] font-semibold text-[#38bdf8]">{seasonOBP > 0 ? seasonOBP.toFixed(3) : '.000'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">SLG</div><div className="text-[18px] font-semibold text-[#f59e0b]">{seasonSLG > 0 ? seasonSLG.toFixed(3) : '.000'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">OPS</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{(seasonOBP + seasonSLG) > 0 ? (seasonOBP + seasonSLG).toFixed(3) : '.000'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">GP</div><div className="text-[18px] font-semibold text-[#e2e8f0]">{gp}</div></div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">H</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{totalHits}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">R</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{totalRuns}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">RBI</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{totalRBI}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">2B</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{total2B}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">HR</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{totalHR}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">SB</div><div className="text-[16px] font-semibold text-[#e2e8f0]">{totalSB}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">K</div><div className="text-[16px] font-semibold text-[#ef4444]">{totalK}</div></div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Total Sessions</div><div className="text-[18px] font-semibold text-[#38bdf8]">{allPlayerData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Batting</div><div className="text-[18px] font-semibold text-[#10b981]">{battingData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Pitching</div><div className="text-[18px] font-semibold text-[#f59e0b]">{pitchingData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Running</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{runningData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Game Stats</div><div className="text-[18px] font-semibold text-[#06b6d4]">{playerGameStats.reduce((sum: number, s: any) => sum + (s.gamesPlayed || 0), 0)}</div></Card>
        </div>

        <Tabs defaultValue="batting" className="w-full">
          <TabsList className="bg-[#1e293b] border-[#334155] mb-4">
            <TabsTrigger value="batting" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Batting</TabsTrigger>
            <TabsTrigger value="pitching" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Pitching</TabsTrigger>
            <TabsTrigger value="running" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Running</TabsTrigger>
            <TabsTrigger value="strength" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Strength</TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-[#38bdf8] data-[state=active]:text-[#0a0f1a]">Game Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="batting"><MetricsCategoryView data={battingData} category="Batting" /></TabsContent>
          <TabsContent value="pitching"><MetricsCategoryView data={pitchingData} category="Pitching" /></TabsContent>
          <TabsContent value="running"><MetricsCategoryView data={runningData} category="Running" /></TabsContent>
          <TabsContent value="strength"><MetricsCategoryView data={strengthData} category="Strength" /></TabsContent>
          <TabsContent value="games"><GameStatsView stats={playerGameStats} /></TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function MetricsCategoryView({ data, category }: { data: any[]; category: string }) {
  if (data.length === 0) {
    return (<Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><TrendingUp className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No {category.toLowerCase()} data yet</p></Card>);
  }
  const drillGroups = data.reduce((acc: any, item: any) => { if (!acc[item.drill]) acc[item.drill] = []; acc[item.drill].push(item); return acc; }, {} as Record<string, any[]>);
  return (
    <div className="space-y-4">
      {Object.entries(drillGroups).map(([drill, drillData]: [string, any]) => (
        <Card key={drill} className="bg-[#1e293b] border-[#334155] p-4">
          <h4 className="text-[13px] font-medium text-[#38bdf8] mb-3">{drill}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="text-[10px] text-[#64748b] mb-2">Recent Sessions</p>
              <div className="space-y-2">{drillData.slice(0, 5).map((session: any, idx: number) => (<div key={idx} className="bg-[#0f172a] p-2 rounded text-[11px]"><div className="flex justify-between items-center mb-1"><span className="text-[#94a3b8]">{new Date(session.date).toLocaleDateString()}</span><span className="text-[#10b981] font-medium">{session.reps && session.reps.length > 0 ? (session.reps.reduce((a: number, b: number) => a + b, 0) / session.reps.length).toFixed(2) : 'N/A'}</span></div><div className="text-[10px] text-[#64748b]">{session.reps?.length || 0} reps</div></div>))}</div>
            </div>
            <div><p className="text-[10px] text-[#64748b] mb-2">Performance Summary</p>
              <div className="bg-[#0f172a] p-3 rounded space-y-2 text-[11px]">
                <div className="flex justify-between"><span className="text-[#94a3b8]">Total Sessions:</span><span className="text-[#e2e8f0] font-medium">{drillData.length}</span></div>
                <div className="flex justify-between"><span className="text-[#94a3b8]">Personal Record:</span><span className="text-[#f59e0b] font-medium">{Math.max(...drillData.flatMap((d: any) => d.reps || [])).toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-[#94a3b8]">Total Reps:</span><span className="text-[#e2e8f0] font-medium">{drillData.reduce((sum: number, d: any) => sum + (d.reps?.length || 0), 0)}</span></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function GameStatsView({ stats }: { stats: any[] }) {
  if (stats.length === 0) {
    return (<Card className="bg-[#1e293b] border-[#334155] p-8 text-center"><Users className="h-12 w-12 text-[#334155] mx-auto mb-3" /><p className="text-[12px] text-[#64748b]">No game stats yet</p></Card>);
  }
  const SV = ({ label, value }: { label: string; value: any }) => { const d = value === undefined || value === null || value === "" ? "--" : String(value); return (<div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">{label}</div><div className="text-[13px] text-[#f1f5f9] font-medium">{d}</div></div>); };
  return (
    <div className="space-y-4">
      {stats.map((stat: any, idx: number) => {
        const rb = stat.rawBatting || {};
        const rp = stat.rawPitching || {};
        const rf = stat.rawFielding || {};
        return (
          <div key={idx} className="space-y-4">
            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h4 className="text-[13px] font-medium text-[#38bdf8] mb-3">{stat.season} - Batting ({stat.gamesPlayed || 0} games)</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                <SV label="AVG" value={stat.average ? Number(stat.average).toFixed(3) : ".000"} />
                <SV label="OBP" value={stat.onBasePercentage ? Number(stat.onBasePercentage).toFixed(3) : ".000"} />
                <SV label="SLG" value={stat.sluggingPercentage ? Number(stat.sluggingPercentage).toFixed(3) : ".000"} />
                <SV label="OPS" value={stat.onBasePlusSlugging ? Number(stat.onBasePlusSlugging).toFixed(3) : ".000"} />
                <SV label="AB" value={stat.atBats} />
                <SV label="PA" value={stat.plateAppearances} />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                <SV label="H" value={stat.hits} />
                <SV label="R" value={stat.runs} />
                <SV label="RBI" value={stat.rbi} />
                <SV label="2B" value={stat.doubles} />
                <SV label="3B" value={stat.triples} />
                <SV label="HR" value={stat.homeRuns} />
                <SV label="BB" value={stat.walks} />
                <SV label="K" value={stat.strikeouts} />
                <SV label="SB" value={stat.stolenBases} />
                <SV label="CS" value={stat.caughtStealing} />
              </div>
              {Object.keys(rb).length > 0 && (
                <details className="mt-3"><summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Advanced Batting</summary>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {rb["QAB"] !== undefined && <SV label="QAB" value={rb["QAB"]} />}
                    {rb["QAB%"] !== undefined && <SV label="QAB%" value={rb["QAB%"]} />}
                    {rb["C%"] !== undefined && <SV label="Contact%" value={rb["C%"]} />}
                    {rb["BABIP"] !== undefined && <SV label="BABIP" value={rb["BABIP"]} />}
                    {rb["BA/RISP"] !== undefined && <SV label="BA/RISP" value={rb["BA/RISP"]} />}
                    {rb["HHB"] !== undefined && <SV label="HHB" value={rb["HHB"]} />}
                    {rb["LD%"] !== undefined && <SV label="LD%" value={rb["LD%"]} />}
                    {rb["FB%"] !== undefined && <SV label="FB%" value={rb["FB%"]} />}
                    {rb["GB%"] !== undefined && <SV label="GB%" value={rb["GB%"]} />}
                    {rb["XBH"] !== undefined && <SV label="XBH" value={rb["XBH"]} />}
                    {rb["TB"] !== undefined && <SV label="TB" value={rb["TB"]} />}
                    {rb["PS"] !== undefined && <SV label="Pitches Seen" value={rb["PS"]} />}
                    {rb["PS/PA"] !== undefined && <SV label="PS/PA" value={rb["PS/PA"]} />}
                    {rb["BB/K"] !== undefined && <SV label="BB/K" value={rb["BB/K"]} />}
                    {rb["LOB"] !== undefined && <SV label="LOB" value={rb["LOB"]} />}
                    {rb["2OUTRBI"] !== undefined && <SV label="2OUT RBI" value={rb["2OUTRBI"]} />}
                  </div>
                </details>
              )}
            </Card>

            {stat.inningsPitched && stat.inningsPitched > 0 && (
              <Card className="bg-[#1e293b] border-[#334155] p-4">
                <h4 className="text-[13px] font-medium text-[#38bdf8] mb-3">Pitching</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-3">
                  <SV label="IP" value={stat.inningsPitched} />
                  <SV label="ERA" value={stat.era ? Number(stat.era).toFixed(2) : "0.00"} />
                  <SV label="WHIP" value={stat.whip ? Number(stat.whip).toFixed(2) : "0.00"} />
                  <SV label="K" value={stat.strikeoutsPitching} />
                  <SV label="BB" value={stat.walksPitching} />
                  <SV label="H" value={stat.hitsAllowed} />
                  <SV label="ER" value={stat.earnedRuns} />
                  <SV label="W" value={stat.wins} />
                  <SV label="L" value={stat.losses} />
                  <SV label="BF" value={stat.battersFaced} />
                  <SV label="#P" value={stat.pitchCount} />
                </div>
                {Object.keys(rp).length > 0 && (
                  <details className="mt-3"><summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Advanced Pitching</summary>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                      {rp["FIP"] !== undefined && <SV label="FIP" value={rp["FIP"]} />}
                      {rp["S%"] !== undefined && <SV label="Strike%" value={rp["S%"]} />}
                      {rp["FPS%"] !== undefined && <SV label="FPS%" value={rp["FPS%"]} />}
                      {rp["BAA"] !== undefined && <SV label="BAA" value={rp["BAA"]} />}
                      {rp["K/BF"] !== undefined && <SV label="K/BF" value={rp["K/BF"]} />}
                      {rp["K/BB"] !== undefined && <SV label="K/BB" value={rp["K/BB"]} />}
                      {rp["BB/INN"] !== undefined && <SV label="BB/INN" value={rp["BB/INN"]} />}
                      {rp["P/IP"] !== undefined && <SV label="P/IP" value={rp["P/IP"]} />}
                      {rp["SM%"] !== undefined && <SV label="SwgMiss%" value={rp["SM%"]} />}
                      {rp["WEAK%"] !== undefined && <SV label="Weak%" value={rp["WEAK%"]} />}
                      {rp["HHB%"] !== undefined && <SV label="HHB%" value={rp["HHB%"]} />}
                      {rp["GO/AO"] !== undefined && <SV label="GO/AO" value={rp["GO/AO"]} />}
                      {rp["0BBINN"] !== undefined && <SV label="0BB Inn" value={rp["0BBINN"]} />}
                      {rp["123INN"] !== undefined && <SV label="1-2-3 Inn" value={rp["123INN"]} />}
                    </div>
                  </details>
                )}
              </Card>
            )}

            <Card className="bg-[#1e293b] border-[#334155] p-4">
              <h4 className="text-[13px] font-medium text-[#38bdf8] mb-3">Fielding</h4>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
                <SV label="FPCT" value={stat.fieldingPercentage ? Number(stat.fieldingPercentage).toFixed(3) : ".000"} />
                <SV label="TC" value={stat.totalChances} />
                <SV label="PO" value={stat.putouts} />
                <SV label="A" value={stat.assists} />
                <SV label="E" value={stat.errors} />
              </div>
              {Object.keys(rf).length > 0 && (
                <details className="mt-3"><summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Position Innings</summary>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                    {rf["P"] !== undefined && <SV label="P" value={rf["P"]} />}
                    {rf["C"] !== undefined && <SV label="C" value={rf["C"]} />}
                    {rf["1B"] !== undefined && <SV label="1B" value={rf["1B"]} />}
                    {rf["2B"] !== undefined && <SV label="2B" value={rf["2B"]} />}
                    {rf["3B"] !== undefined && <SV label="3B" value={rf["3B"]} />}
                    {rf["SS"] !== undefined && <SV label="SS" value={rf["SS"]} />}
                    {rf["LF"] !== undefined && <SV label="LF" value={rf["LF"]} />}
                    {rf["CF"] !== undefined && <SV label="CF" value={rf["CF"]} />}
                    {rf["RF"] !== undefined && <SV label="RF" value={rf["RF"]} />}
                    {rf["Total"] !== undefined && <SV label="Total" value={rf["Total"]} />}
                  </div>
                </details>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
}















