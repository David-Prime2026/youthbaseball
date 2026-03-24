import { useState, useEffect } from 'react';
import { Player } from '../types/player';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Calendar, Users, TrendingUp, Camera, Edit2, Mail, Sparkles, Loader2 } from 'lucide-react';
import { useGameStats } from '../hooks/useGameStats';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { PerformanceEntry } from '../types/performance';
import { supabase } from '../../supabaseClient';

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

  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const playerGameStats = gameStats.filter(s => s.playerId === player.id);
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
              <h2 className="text-[20px] font-semibold text-[#f1f5f9] mb-2">{player.name}</h2>
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
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#38bdf8]" /><h3 className="text-[13px] font-semibold text-[#38bdf8]">AI Player Insights</h3></div>
            <Button onClick={generateAIInsights} disabled={aiLoading} size="sm" className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]">
              {aiLoading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>) : aiGenerated ? 'Refresh' : 'Generate Insights'}
            </Button>
          </div>
          {aiLoading && (<div className="text-center py-4"><Loader2 className="h-6 w-6 text-[#38bdf8] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Analyzing {player.name}'s data...</p></div>)}
          {aiGenerated && !aiLoading && (
            <div className="space-y-2">
              {aiInsights.map((insight, i) => {
                const style = insightColors[insight.type] || insightColors.neutral;
                return (<div key={i} className={style.bg + ' ' + style.border + ' border p-3 rounded-lg'}><h4 className={'text-[12px] font-medium ' + style.text + ' mb-1'}>{insight.title}</h4><p className="text-[11px] text-[#94a3b8]">{insight.description}</p></div>);
              })}
            </div>
          )}
          {!aiGenerated && !aiLoading && (<p className="text-[11px] text-[#64748b] text-center py-2">Click "Generate Insights" for personalized AI analysis</p>)}
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
          <h3 className="text-[12px] font-medium text-[#38bdf8] mb-3">Training Performance Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Exit Velocity</div><div className="text-[18px] font-semibold text-[#10b981]">{exitVelocityAvg > 0 ? exitVelocityAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Bat Speed</div><div className="text-[18px] font-semibold text-[#38bdf8]">{batSpeedAvg > 0 ? batSpeedAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">60-Yard Dash</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{runningSpeedAvg > 0 ? runningSpeedAvg.toFixed(2) : '--'}<span className="text-[10px] text-[#64748b] ml-1">sec</span></div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Pitch Velocity</div><div className="text-[18px] font-semibold text-[#f59e0b]">{pitchVelocityAvg > 0 ? pitchVelocityAvg.toFixed(1) : '--'}<span className="text-[10px] text-[#64748b] ml-1">mph</span></div></div>
          </div>
        </Card>

        <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
          <h3 className="text-[12px] font-medium text-[#38bdf8] mb-3">Game Performance Averages</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG AB's</div><div className="text-[18px] font-semibold text-[#e2e8f0]">{gameAvgAtBats > 0 ? gameAvgAtBats.toFixed(1) : '--'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG Hits</div><div className="text-[18px] font-semibold text-[#10b981]">{gameAvgHits > 0 ? gameAvgHits.toFixed(1) : '--'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG Runs</div><div className="text-[18px] font-semibold text-[#38bdf8]">{gameAvgRuns > 0 ? gameAvgRuns.toFixed(1) : '--'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG RBI's</div><div className="text-[18px] font-semibold text-[#f59e0b]">{gameAvgRBI > 0 ? gameAvgRBI.toFixed(1) : '--'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">AVG SB's</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{gameAvgSteals > 0 ? gameAvgSteals.toFixed(1) : '--'}</div></div>
            <div className="bg-[#0f172a] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">Batting AVG</div><div className="text-[18px] font-semibold text-[#10b981]">{gameAvg > 0 ? gameAvg.toFixed(3) : '.000'}</div></div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Total Sessions</div><div className="text-[18px] font-semibold text-[#38bdf8]">{allPlayerData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Batting</div><div className="text-[18px] font-semibold text-[#10b981]">{battingData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Pitching</div><div className="text-[18px] font-semibold text-[#f59e0b]">{pitchingData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Running</div><div className="text-[18px] font-semibold text-[#8b5cf6]">{runningData.length}</div></Card>
          <Card className="bg-[#1e293b] border-[#334155] p-3"><div className="text-[10px] text-[#64748b] mb-1">Game Stats</div><div className="text-[18px] font-semibold text-[#06b6d4]">{playerGameStats.length}</div></Card>
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
  const seasonGroups = stats.reduce((acc: any, stat: any) => { if (!acc[stat.season]) acc[stat.season] = []; acc[stat.season].push(stat); return acc; }, {} as Record<string, any[]>);
  return (
    <div className="space-y-4">
      {Object.entries(seasonGroups).map(([season, seasonStats]: [string, any]) => (
        <Card key={season} className="bg-[#1e293b] border-[#334155] p-4">
          <h4 className="text-[13px] font-medium text-[#38bdf8] mb-3">{season}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]"><thead><tr className="text-[#64748b] border-b border-[#334155]"><th className="text-left py-2 px-2">Date</th><th className="text-center py-2 px-2">AB</th><th className="text-center py-2 px-2">H</th><th className="text-center py-2 px-2">R</th><th className="text-center py-2 px-2">RBI</th><th className="text-center py-2 px-2">HR</th><th className="text-center py-2 px-2">BB</th><th className="text-center py-2 px-2">K</th><th className="text-center py-2 px-2">AVG</th></tr></thead>
              <tbody className="text-[#e2e8f0]">{seasonStats.map((stat: any, idx: number) => (<tr key={idx} className="border-b border-[#334155]/30 hover:bg-[#1e293b]"><td className="py-2 px-2">{stat.gameDate}</td><td className="text-center py-2 px-2">{stat.atBats}</td><td className="text-center py-2 px-2">{stat.hits}</td><td className="text-center py-2 px-2">{stat.runs}</td><td className="text-center py-2 px-2">{stat.rbi}</td><td className="text-center py-2 px-2">{stat.homeRuns}</td><td className="text-center py-2 px-2">{stat.walks}</td><td className="text-center py-2 px-2">{stat.strikeouts}</td><td className="text-center py-2 px-2 font-medium text-[#10b981]">{stat.average?.toFixed(3) || '.000'}</td></tr>))}</tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Games</div><div className="text-[14px] font-semibold text-[#e2e8f0]">{seasonStats.length}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Total H</div><div className="text-[14px] font-semibold text-[#e2e8f0]">{seasonStats.reduce((sum: number, s: any) => sum + (s.hits || 0), 0)}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Total R</div><div className="text-[14px] font-semibold text-[#e2e8f0]">{seasonStats.reduce((sum: number, s: any) => sum + (s.runs || 0), 0)}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Total RBI</div><div className="text-[14px] font-semibold text-[#e2e8f0]">{seasonStats.reduce((sum: number, s: any) => sum + (s.rbi || 0), 0)}</div></div>
            <div className="bg-[#0f172a] p-2 rounded text-center"><div className="text-[10px] text-[#64748b]">Season AVG</div><div className="text-[14px] font-semibold text-[#10b981]">{(() => { const h = seasonStats.reduce((sum: number, s: any) => sum + (s.hits || 0), 0); const ab = seasonStats.reduce((sum: number, s: any) => sum + (s.atBats || 0), 0); return ab > 0 ? (h / ab).toFixed(3) : '.000'; })()}</div></div>
          </div>
        </Card>
      ))}
    </div>
  );
}
