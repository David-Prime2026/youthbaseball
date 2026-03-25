import { useState, useEffect } from 'react';
import { BattingTab } from './components/BattingTab';
import { PitchingTab } from './components/PitchingTab';
import { RunningTab } from './components/RunningTab';
import { StrengthTab } from './components/StrengthTab';
import { ExerciseTab } from './components/ExerciseTab';
import { PlayersTab } from './components/PlayersTab';
import { TeamTab } from './components/TeamTab';
import { GameStatsTab } from './components/GameStatsTab';
import { OfflineSyncIndicator } from './components/OfflineSyncIndicator';
import { AIInsights } from './components/AIInsights';
import { TrendingUp, Users, Activity, User, FileSpreadsheet, Menu, X, Camera } from 'lucide-react';
import { Button } from './components/ui/button';
import { usePlayerData } from './hooks/usePlayerData';
import { usePerformanceData } from './hooks/usePerformanceData';
import { useGameStats } from './hooks/useGameStats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { supabase } from '../supabaseClient';

export default function App({ userRole = 'head_coach', linkedPlayerId = null, userEmail = '' }: { userRole?: string; linkedPlayerId?: string | null; userEmail?: string }) {
  const [activeTab, setActiveTab] = useState('players');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
  const [parentPlayerIds, setParentPlayerIds] = useState<string[]>([]);
  const { players, getPlayerById } = usePlayerData();
  const { entries: battingEntries } = usePerformanceData('batting');
  const { entries: pitchingEntries } = usePerformanceData('pitching');
  const { entries: runningEntries } = usePerformanceData('running');
  const { entries: strengthEntries } = usePerformanceData('strength');
  const { entries: exerciseEntries } = usePerformanceData('exercise');
  const { gameStats } = useGameStats();

  useEffect(() => {
    if (userRole === 'parent' && userEmail) {
      supabase.from('parent_player_links').select('player_id').eq('parent_email', userEmail.toLowerCase())
        .then(({ data }) => { if (data) setParentPlayerIds(data.map((d: any) => d.player_id)); });
    }
  }, [userRole, userEmail]);

  const selectedPlayer = selectedPlayerId !== 'all' ? getPlayerById(selectedPlayerId) : null;

  const tabs = [
    { value: 'players', label: 'Players', icon: User, needsPlayer: false },
    { value: 'team', label: 'Coaching', icon: Users, needsPlayer: false },
    { value: 'batting', label: 'Batting', icon: TrendingUp, needsPlayer: true },
    { value: 'pitching', label: 'Pitching', icon: TrendingUp, needsPlayer: true },
    { value: 'running', label: 'Running', icon: TrendingUp, needsPlayer: true },
    { value: 'strength', label: 'Strength', icon: TrendingUp, needsPlayer: true },
    { value: 'exercise', label: 'Exercise', icon: Activity, needsPlayer: true },
    { value: 'gamestats', label: 'Game Stats', icon: FileSpreadsheet, needsPlayer: false },
  ];

  const visibleTabs = tabs.filter(tab => {
    if (userRole === 'head_coach') return true;
    if (userRole === 'assistant_coach') return true;
    if (userRole === 'stats_coordinator') return ['players', 'batting', 'pitching', 'running', 'strength', 'exercise', 'gamestats'].includes(tab.value);
    if (userRole === 'parent') return ['players'].includes(tab.value);
    return true;
  });

  const activeTabInfo = visibleTabs.find(t => t.value === activeTab) || visibleTabs[0];

  const handleTabChange = (tab: string) => { setActiveTab(tab); setMenuOpen(false); };

  const getAIInsightsData = () => {
    const playerName = selectedPlayer?.name;
    const filterByPlayer = (entries: any[]) => {
      if (selectedPlayerId === 'all') return entries;
      return entries.filter(e => e.playerId === selectedPlayerId);
    };
    switch (activeTab) {
      case 'batting': return { entries: filterByPlayer(battingEntries), gameStats: filterByPlayer(gameStats as any[]) as any, playerName };
      case 'pitching': return { entries: filterByPlayer(pitchingEntries), gameStats: filterByPlayer(gameStats as any[]) as any, playerName };
      case 'running': return { entries: filterByPlayer(runningEntries), gameStats: [], playerName };
      case 'strength': return { entries: filterByPlayer(strengthEntries), gameStats: [], playerName };
      case 'exercise': return { entries: filterByPlayer(exerciseEntries), gameStats: [], playerName };
      case 'gamestats': return { entries: [], gameStats, playerName };
      default: return null;
    }
  };

  const aiInsightsData = getAIInsightsData();

  // Parent portal view
  if (userRole === 'parent') {
    const parentPlayers = players.filter(p => parentPlayerIds.includes(p.id) || p.id === linkedPlayerId);
    const allBatting = battingEntries;
    const allPitching = pitchingEntries;
    const allRunning = runningEntries;
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-foreground">
        <div className="border-b border-[#1e293b] px-4 py-4" style={{ backgroundImage: 'linear-gradient(171.921deg, rgb(12, 25, 41) 0%, rgb(30, 41, 59) 100%)' }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#38bdf8] tracking-[1.5px] uppercase mb-1">Youth Performance Tracking System</p>
              <h1 className="text-[18px] font-bold text-[#f1f5f9]">PREMIER SELECT</h1>
              <p className="text-[11px] text-[#64748b]">Parent Portal</p>
            </div>
            <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="text-[11px] text-[#94a3b8] hover:text-[#ef4444] px-3 py-1 border border-[#334155] rounded">Sign Out</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {parentPlayers.length === 0 ? (
            <div className="text-center py-12"><p className="text-[#94a3b8]">No players linked to your account. Contact your coach.</p></div>
          ) : (
            <div className="space-y-6">
              {parentPlayers.map(p => {
                const pgs = gameStats.filter(s => s.playerId === p.id);
                const gp = pgs.reduce((s, g) => s + (g.gamesPlayed || 0), 0);
                const ab = pgs.reduce((s, g) => s + (g.atBats || 0), 0);
                const h = pgs.reduce((s, g) => s + (g.hits || 0), 0);
                const r = pgs.reduce((s, g) => s + (g.runs || 0), 0);
                const rbi = pgs.reduce((s, g) => s + (g.rbi || 0), 0);
                const hr = pgs.reduce((s, g) => s + (g.homeRuns || 0), 0);
                const sb = pgs.reduce((s, g) => s + (g.stolenBases || 0), 0);
                const avg = ab > 0 ? (h / ab).toFixed(3) : '.000';
                const S = ({ l, v, c }: { l: string; v: any; c?: string }) => (<div className="bg-[#1e293b] p-3 rounded text-center"><div className="text-[10px] text-[#64748b] mb-1">{l}</div><div className={'text-[18px] font-semibold ' + (c || 'text-[#e2e8f0]')}>{v}</div></div>);
                return (
                  <div key={p.id} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-16 h-16 rounded-lg bg-[#1e293b] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center">
                        {p.photo ? <img src={p.photo} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-[20px] text-[#38bdf8]">{p.name?.split(' ').map((n: string) => n[0]).join('')}</span>}
                      </div>
                      <div>
                        <h2 className="text-[18px] font-semibold text-[#f1f5f9] mb-1">{p.name}</h2>
                        <p className="text-[11px] text-[#64748b]">{p.ageGroup} - {p.positions?.join(', ') || 'No positions'}</p>
                      </div>
                    </div>
                    <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-3">Season Stats ({gp} games)</h3>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <S l="AVG" v={avg} c="text-[#10b981]" /><S l="GP" v={gp} /><S l="AB" v={ab} /><S l="H" v={h} />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <S l="R" v={r} /><S l="RBI" v={rbi} /><S l="HR" v={hr} /><S l="SB" v={sb} />
                    </div>
                    {(() => {
                      const bb = pgs.reduce((s: number, g: any) => s + (g.walks || 0), 0);
                      const k = pgs.reduce((s: number, g: any) => s + (g.strikeouts || 0), 0);
                      const d2 = pgs.reduce((s: number, g: any) => s + (g.doubles || 0), 0);
                      const obp = (ab + bb) > 0 ? ((h + bb) / (ab + bb)).toFixed(3) : ".000";
                      const slg = ab > 0 ? ((h + d2 + (hr * 3)) / ab).toFixed(3) : ".000";
                      const ops = (parseFloat(obp) + parseFloat(slg)).toFixed(3);
                      return (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          <S l="OBP" v={obp} c="text-[#38bdf8]" /><S l="SLG" v={slg} c="text-[#f59e0b]" /><S l="OPS" v={ops} c="text-[#8b5cf6]" /><S l="K" v={k} c="text-[#ef4444]" />
                        </div>
                      );
                    })()}
                    {(() => {
                      const ip = pgs.reduce((s: number, g: any) => s + (g.inningsPitched || 0), 0);
                      if (ip === 0) return null;
                      const era = pgs.reduce((s: number, g: any) => s + (g.era || 0), 0);
                      const kp = pgs.reduce((s: number, g: any) => s + (g.strikeoutsPitching || 0), 0);
                      const w = pgs.reduce((s: number, g: any) => s + (g.wins || 0), 0);
                      const l = pgs.reduce((s: number, g: any) => s + (g.losses || 0), 0);
                      const whip = pgs.length > 0 ? pgs[0].whip : 0;
                      return (
                        <>
                          <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-3 mt-4">Pitching</h3>
                          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                            <S l="IP" v={ip.toFixed(1)} /><S l="ERA" v={era > 0 ? era.toFixed(2) : "0.00"} c="text-[#10b981]" /><S l="WHIP" v={whip ? Number(whip).toFixed(2) : "--"} c="text-[#38bdf8]" /><S l="K" v={kp} /><S l="W-L" v={w + "-" + l} />
                          </div>
                        </>
                      );
                    })()}
                    <div className="mt-4 pt-4 border-t border-[#1e293b]">
                      <h3 className="text-[13px] font-semibold text-[#38bdf8] mb-3">Training Metrics</h3>
                      {(() => {
                        const pb = allBatting.filter((e: any) => e.playerId === p.id);
                        const pp = allPitching.filter((e: any) => e.playerId === p.id);
                        const pr = allRunning.filter((e: any) => e.playerId === p.id);
                        const getAvg = (data: any[], metric: string) => { const f = data.filter((e: any) => e.metricType === metric); const reps = f.flatMap((e: any) => e.reps).filter((r: number) => r > 0); return reps.length > 0 ? reps.reduce((a: number, b: number) => a + b, 0) / reps.length : 0; };
                        const ev = getAvg(pb, "Exit Velocity");
                        const bs = getAvg(pb, "Bat Speed");
                        const pv = getAvg(pp, "Throwing Velocity");
                        const dash = getAvg(pr, "60-Yard Dash");
                        return (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            <S l="Exit Velo" v={ev > 0 ? ev.toFixed(1) + " mph" : "No data"} c="text-[#10b981]" />
                            <S l="Bat Speed" v={bs > 0 ? bs.toFixed(1) + " mph" : "No data"} c="text-[#38bdf8]" />
                            <S l="Pitch Velo" v={pv > 0 ? pv.toFixed(1) + " mph" : "No data"} c="text-[#f59e0b]" />
                            <S l="60yd Dash" v={dash > 0 ? dash.toFixed(2) + "s" : "No data"} c="text-[#8b5cf6]" />
                          </div>
                        );
                      })()}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#1e293b]">
                      <ParentPublishedPlan playerId={p.id} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#1e293b]">
                      <ParentAIInsights playerId={p.id} playerName={p.name} gameStats={pgs} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-foreground">
      <OfflineSyncIndicator />
      <div className="border-b border-[#1e293b] px-4 md:px-6 py-4 md:py-8" style={{ backgroundImage: 'linear-gradient(171.921deg, rgb(12, 25, 41) 0%, rgb(30, 41, 59) 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#38bdf8] tracking-[1.5px] uppercase mb-1">Youth Performance Tracking System</p>
              <h1 className="text-[18px] md:text-[22px] font-bold text-[#f1f5f9] mb-1">PREMIER SELECT</h1>
              <p className="text-[11px] md:text-[12px] text-[#64748b] hidden md:block">Track baseball player KPIs, benchmarks, and goals across all performance dimensions</p>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="text-[10px] text-[#64748b] hover:text-[#ef4444] mt-1 cursor-pointer">Sign Out</button>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }} className="text-[11px] text-[#94a3b8] hover:text-[#ef4444] px-3 py-1 border border-[#334155] rounded hover:border-[#ef4444] transition-colors">Sign Out</button>
              <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline" className="md:hidden border-[#38bdf8] text-[#38bdf8] hover:bg-[#0c4a6e]">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button></div>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="bg-[#0f172a] w-72 h-full border-r border-[#1e293b] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[14px] font-semibold text-[#38bdf8]">Navigation</h2>
              <Button onClick={() => setMenuOpen(false)} variant="ghost" size="sm"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {visibleTabs.map(tab => (
                <button key={tab.value} onClick={() => handleTabChange(tab.value)} className={'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ' + (activeTab === tab.value ? 'bg-[#0c4a6e] text-[#38bdf8] border border-[#38bdf8]' : 'text-[#94a3b8] hover:bg-[#1e293b]')}>
                  <tab.icon className="h-4 w-4" /><span className="text-[13px]">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="hidden md:flex flex-wrap gap-2">
            {visibleTabs.map(tab => (
              <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ' + (activeTab === tab.value ? 'bg-[#0c4a6e] text-[#38bdf8] border border-[#38bdf8]' : 'text-[#94a3b8] hover:bg-[#1e293b]')}>
                <tab.icon className="h-4 w-4" /><span className="text-[13px]">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#0f172a] border border-[#1e293b] rounded-lg">
            {activeTabInfo && (<><activeTabInfo.icon className="h-5 w-5 text-[#38bdf8]" /><span className="text-[14px] font-medium text-[#f1f5f9]">{activeTabInfo.label}</span></>)}
          </div>
          {activeTabInfo?.needsPlayer && (
            <div className="flex-1 md:flex-initial md:w-72">
              <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
                <SelectTrigger className="bg-[#0f172a] border-[#334155] text-[#e2e8f0]">
                  <SelectValue>{selectedPlayer ? (<div className="flex items-center gap-2">{selectedPlayer.photo ? (<img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-6 h-6 rounded-full object-cover" />) : (<div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center"><Camera className="h-3 w-3 text-[#64748b]" /></div>)}<span>{selectedPlayer.name}</span></div>) : ('All Players')}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#0f172a] border-[#334155]">
                  <SelectItem value="all">All Players</SelectItem>
                  {players.map(player => (<SelectItem key={player.id} value={player.id}><div className="flex items-center gap-2">{player.photo ? (<img src={player.photo} alt={player.name} className="w-6 h-6 rounded-full object-cover" />) : (<div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center"><Camera className="h-3 w-3 text-[#64748b]" /></div>)}<span>{player.name}</span></div></SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div>
          {aiInsightsData && (
            <div className="mb-6">
              <AIInsights key={activeTab + '-' + selectedPlayerId} performanceEntries={aiInsightsData.entries} gameStats={aiInsightsData.gameStats} playerName={aiInsightsData.playerName} category={activeTab} />
            </div>
          )}
          {activeTab === 'players' && <PlayersTab />}
          {activeTab === 'team' && <TeamTab />}
          {activeTab === 'batting' && <BattingTab />}
          {activeTab === 'pitching' && <PitchingTab />}
          {activeTab === 'running' && <RunningTab />}
          {activeTab === 'strength' && <StrengthTab />}
          {activeTab === 'exercise' && <ExerciseTab />}
          {activeTab === 'gamestats' && <GameStatsTab />}
        </div>
      </div>
    </div>
  );
}








function ParentAIInsights({ playerId, playerName, gameStats: pgs }: { playerId: string; playerName: string; gameStats: any[] }) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: { performanceData: [], gameStats: pgs.slice(0, 5), playerName, category: 'Parent Report' },
      });
      if (error) throw error;
      if (data?.insights) setInsights(data.insights);
    } catch (err) {
      setInsights([{ type: 'neutral', title: 'Unavailable', description: 'Could not generate insights.' }]);
    } finally { setLoading(false); setGenerated(true); setCollapsed(false); }
  };

  const colors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => generated && setCollapsed(!collapsed)} className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold text-[#10b981]">Development Insights</h3>
          {generated && <span className="text-[#64748b] text-[10px]">{collapsed ? '(show)' : '(hide)'}</span>}
        </button>
        <button onClick={generate} disabled={loading} className="text-[11px] bg-[#10b981] text-white px-3 py-1 rounded hover:bg-[#059669] disabled:opacity-50">
          {loading ? 'Analyzing...' : generated ? 'Refresh' : 'Get Insights'}
        </button>
      </div>
      {!collapsed && generated && !loading && (
        <div className="space-y-2">{insights.map((ins: any, i: number) => {
          const s = colors[ins.type] || colors.neutral;
          return <div key={i} className={s.bg + ' ' + s.border + ' border p-3 rounded-lg'}><h4 className={'text-[12px] font-medium ' + s.text + ' mb-1'}>{ins.title}</h4><p className="text-[11px] text-[#94a3b8]">{ins.description}</p></div>;
        })}</div>
      )}
      {loading && <div className="text-center py-3"><p className="text-[11px] text-[#94a3b8]">Analyzing {playerName}'s performance...</p></div>}
      {!generated && !loading && <p className="text-[11px] text-[#64748b]">Click "Get Insights" for AI-powered development feedback on your player.</p>}
    </div>
  );
}



function ParentPublishedPlan({ playerId }: { playerId: string }) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    supabase.from('published_plans').select('*').eq('player_id', playerId).order('published_at', { ascending: false }).limit(1)
      .then(({ data }) => { if (data && data.length > 0) setPlan(data[0]); setLoading(false); });
  }, [playerId]);

  if (loading) return <p className="text-[11px] text-[#64748b]">Loading development plan...</p>;
  if (!plan) return <div className="text-center py-3"><p className="text-[11px] text-[#64748b]">No development plan published yet. Your coach will share one soon.</p></div>;

  const items = plan.plan_data || [];
  const colors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2">
          <h3 className="text-[13px] font-semibold text-[#f59e0b]">Coach Development Plan</h3>
          <span className="text-[#64748b] text-[10px]">{collapsed ? '(show)' : '(hide)'}</span>
        </button>
        <span className="text-[10px] text-[#64748b]">Published {new Date(plan.published_at).toLocaleDateString()}</span>
      </div>
      {plan.coach_notes && <p className="text-[11px] text-[#94a3b8] mb-3 italic">Coach: {plan.coach_notes}</p>}
      {!collapsed && (
        <div className="space-y-2">{items.map((item: any, i: number) => {
          const s = colors[item.type] || colors.neutral;
          return <div key={i} className={s.bg + ' ' + s.border + ' border p-3 rounded-lg'}><h4 className={'text-[12px] font-medium ' + s.text + ' mb-1'}>{item.title}</h4><p className="text-[11px] text-[#94a3b8]">{item.description}</p></div>;
        })}</div>
      )}
    </div>
  );
}
