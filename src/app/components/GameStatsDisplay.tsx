import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Target, Activity, TrendingUp } from 'lucide-react';
import { GameStats } from '../types/gameStats';
import { Player } from '../types/player';

interface GameStatsDisplayProps {
  gameStats: GameStats[];
  players: Player[];
}

export function GameStatsDisplay({ gameStats, players }: GameStatsDisplayProps) {
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());

  const togglePlayer = (playerId: string) => {
    const newExpanded = new Set(expandedPlayers);
    if (newExpanded.has(playerId)) {
      newExpanded.delete(playerId);
    } else {
      newExpanded.add(playerId);
    }
    setExpandedPlayers(newExpanded);
  };

  // Group stats by player
  const statsByPlayer = gameStats.reduce((acc, stat) => {
    if (!acc[stat.playerId]) {
      acc[stat.playerId] = [];
    }
    acc[stat.playerId].push(stat);
    return acc;
  }, {} as Record<string, GameStats[]>);

  return (
    <div className="space-y-3">
      {Object.entries(statsByPlayer).map(([playerId, playerStats]) => {
        const player = players.find(p => p.id === playerId);
        const latestStat = playerStats[0];
        const playerName = player?.name || `${latestStat.firstName} ${latestStat.lastName}`;
        const isExpanded = expandedPlayers.has(playerId);

        // Calculate aggregates
        const totalGames = playerStats.reduce((sum, s) => sum + (s.gamesPlayed || 0), 0);
        
        // Batting aggregates
        const avgBattingAvg = playerStats.filter(s => s.average).length > 0
          ? playerStats.reduce((sum, s) => sum + (s.average || 0), 0) / playerStats.filter(s => s.average).length
          : 0;
        const totalHits = playerStats.reduce((sum, s) => sum + (s.hits || 0), 0);
        const totalRBI = playerStats.reduce((sum, s) => sum + (s.rbi || 0), 0);
        const totalRuns = playerStats.reduce((sum, s) => sum + (s.runs || 0), 0);
        const totalHR = playerStats.reduce((sum, s) => sum + (s.homeRuns || 0), 0);
        const totalSB = playerStats.reduce((sum, s) => sum + (s.stolenBases || 0), 0);
        const avgOBP = playerStats.filter(s => s.onBasePercentage).length > 0
          ? playerStats.reduce((sum, s) => sum + (s.onBasePercentage || 0), 0) / playerStats.filter(s => s.onBasePercentage).length
          : 0;
        
        // Pitching aggregates
        const totalIP = playerStats.reduce((sum, s) => sum + (s.inningsPitched || 0), 0);
        const avgERA = playerStats.filter(s => s.era).length > 0
          ? playerStats.reduce((sum, s) => sum + (s.era || 0), 0) / playerStats.filter(s => s.era).length
          : 0;
        const totalStrikeoutsPitching = playerStats.reduce((sum, s) => sum + (s.strikeoutsPitching || 0), 0);
        const totalWins = playerStats.reduce((sum, s) => sum + (s.wins || 0), 0);
        const avgWHIP = playerStats.filter(s => s.whip).length > 0
          ? playerStats.reduce((sum, s) => sum + (s.whip || 0), 0) / playerStats.filter(s => s.whip).length
          : 0;
        
        // Fielding aggregates
        const avgFieldingPct = playerStats.filter(s => s.fieldingPercentage).length > 0
          ? playerStats.reduce((sum, s) => sum + (s.fieldingPercentage || 0), 0) / playerStats.filter(s => s.fieldingPercentage).length
          : 0;
        const totalPutouts = playerStats.reduce((sum, s) => sum + (s.putouts || 0), 0);
        const totalAssists = playerStats.reduce((sum, s) => sum + (s.assists || 0), 0);
        const totalErrors = playerStats.reduce((sum, s) => sum + (s.errors || 0), 0);

        return (
          <Card key={playerId} className="bg-[#0f172a] border-[#1e293b]">
            {/* Header - Always Visible */}
            <button
              onClick={() => togglePlayer(playerId)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#1e293b]/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center">
                  {player?.photo ? (
                    <img src={player.photo} alt={playerName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[14px] font-medium text-[#38bdf8]">
                      {playerName.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <h4 className="text-[14px] font-medium text-[#f1f5f9]">{playerName}</h4>
                  <p className="text-[11px] text-[#64748b]">
                    #{latestStat.playerNumber} • {player?.ageGroup || '12U'} • {totalGames} games
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right text-[11px]">
                  <span className="text-[#64748b]">AVG: </span>
                  <span className="text-[#38bdf8] font-medium">{avgBattingAvg.toFixed(3)}</span>
                  <span className="text-[#64748b] ml-3">ERA: </span>
                  <span className="text-[#38bdf8] font-medium">{avgERA.toFixed(2)}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-[#64748b]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#64748b]" />
                )}
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4">
                {/* Batting Stats */}
                <div className="bg-[#1e293b] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="h-4 w-4 text-[#38bdf8]" />
                    <h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">
                      Batting Statistics
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <StatItem label="AVG" value={avgBattingAvg.toFixed(3)} />
                    <StatItem label="OBP" value={avgOBP.toFixed(3)} />
                    <StatItem label="Hits" value={totalHits.toString()} />
                    <StatItem label="RBI" value={totalRBI.toString()} />
                    <StatItem label="Runs" value={totalRuns.toString()} />
                    <StatItem label="HR" value={totalHR.toString()} />
                    <StatItem label="SB" value={totalSB.toString()} />
                    <StatItem label="2B" value={playerStats.reduce((sum, s) => sum + (s.doubles || 0), 0).toString()} />
                    <StatItem label="3B" value={playerStats.reduce((sum, s) => sum + (s.triples || 0), 0).toString()} />
                    <StatItem label="BB" value={playerStats.reduce((sum, s) => sum + (s.walks || 0), 0).toString()} />
                    <StatItem label="K" value={playerStats.reduce((sum, s) => sum + (s.strikeouts || 0), 0).toString()} />
                    <StatItem label="AB" value={playerStats.reduce((sum, s) => sum + (s.atBats || 0), 0).toString()} />
                  </div>
                </div>

                {/* Pitching Stats */}
                {totalIP > 0 && (
                  <div className="bg-[#1e293b] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-[#38bdf8]" />
                      <h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">
                        Pitching Statistics
                      </h5>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      <StatItem label="IP" value={totalIP.toFixed(1)} />
                      <StatItem label="ERA" value={avgERA.toFixed(2)} />
                      <StatItem label="WHIP" value={avgWHIP.toFixed(2)} />
                      <StatItem label="K" value={totalStrikeoutsPitching.toString()} />
                      <StatItem label="W" value={totalWins.toString()} />
                      <StatItem label="L" value={playerStats.reduce((sum, s) => sum + (s.losses || 0), 0).toString()} />
                      <StatItem label="BB" value={playerStats.reduce((sum, s) => sum + (s.walksPitching || 0), 0).toString()} />
                      <StatItem label="H" value={playerStats.reduce((sum, s) => sum + (s.hitsAllowed || 0), 0).toString()} />
                      <StatItem label="ER" value={playerStats.reduce((sum, s) => sum + (s.earnedRuns || 0), 0).toString()} />
                      <StatItem label="BF" value={playerStats.reduce((sum, s) => sum + (s.battersFaced || 0), 0).toString()} />
                    </div>
                  </div>
                )}

                {/* Fielding Stats */}
                <div className="bg-[#1e293b] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-[#38bdf8]" />
                    <h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">
                      Fielding Statistics
                    </h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <StatItem label="FPCT" value={avgFieldingPct.toFixed(3)} />
                    <StatItem label="PO" value={totalPutouts.toString()} />
                    <StatItem label="A" value={totalAssists.toString()} />
                    <StatItem label="E" value={totalErrors.toString()} />
                    <StatItem label="TC" value={playerStats.reduce((sum, s) => sum + (s.totalChances || 0), 0).toString()} />
                  </div>
                </div>

                {/* Season Info */}
                <div className="bg-[#0a0f1a] p-3 rounded border border-[#334155]">
                  <div className="text-[10px] text-[#64748b]">
                    <span className="font-medium text-[#94a3b8]">Season:</span> {latestStat.season}
                    <span className="ml-4 font-medium text-[#94a3b8]">Imports:</span> {playerStats.length}
                    <span className="ml-4 font-medium text-[#94a3b8]">Last Updated:</span> {new Date(latestStat.updatedAt || latestStat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0a0f1a] p-2 rounded">
      <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-[13px] text-[#f1f5f9] font-medium">{value}</div>
    </div>
  );
}
