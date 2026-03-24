import { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('players');
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('all');
  const { players, getPlayerById } = usePlayerData();

  const { entries: battingEntries } = usePerformanceData('batting');
  const { entries: pitchingEntries } = usePerformanceData('pitching');
  const { entries: runningEntries } = usePerformanceData('running');
  const { entries: strengthEntries } = usePerformanceData('strength');
  const { entries: exerciseEntries } = usePerformanceData('exercise');
  const { gameStats } = useGameStats();

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

  const activeTabInfo = tabs.find(t => t.value === activeTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

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

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-foreground">
      <OfflineSyncIndicator />

      <div
        className="border-b border-[#1e293b] px-4 md:px-6 py-4 md:py-8"
        style={{ backgroundImage: 'linear-gradient(171.921deg, rgb(12, 25, 41) 0%, rgb(30, 41, 59) 100%)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#38bdf8] tracking-[1.5px] uppercase mb-1">Youth Performance Tracking System</p>
              <h1 className="text-[18px] md:text-[22px] font-bold text-[#f1f5f9] mb-1">PREMIER SELECT</h1>
              <p className="text-[11px] md:text-[12px] text-[#64748b] hidden md:block">Track baseball player KPIs, benchmarks, and goals across all performance dimensions</p>
            </div>
            <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline" className="md:hidden border-[#38bdf8] text-[#38bdf8] hover:bg-[#0c4a6e]">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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
              {tabs.map(tab => (
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
            {tabs.map(tab => (
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
              <AIInsights
                key={activeTab + "-" + selectedPlayerId}
                performanceEntries={aiInsightsData.entries}
                gameStats={aiInsightsData.gameStats}
                playerName={aiInsightsData.playerName}
                category={activeTab}
              />
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




