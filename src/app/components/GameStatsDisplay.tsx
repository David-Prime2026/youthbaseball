import { useState } from 'react';
import { Card } from './ui/card';
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
    if (newExpanded.has(playerId)) newExpanded.delete(playerId);
    else newExpanded.add(playerId);
    setExpandedPlayers(newExpanded);
  };

  // Group stats by player — with upsert there should be 1 row per player per season
  const statsByPlayer = gameStats.reduce((acc, stat) => {
    if (!acc[stat.playerId]) acc[stat.playerId] = [];
    acc[stat.playerId].push(stat);
    return acc;
  }, {} as Record<string, GameStats[]>);

  return (
    <div className="space-y-3">
      {Object.entries(statsByPlayer).map(([playerId, playerStats]) => {
        const player = players.find(p => p.id === playerId);
        const stat = playerStats[0]; // Latest/only snapshot
        const playerName = player?.name || stat.firstName + ' ' + stat.lastName;
        const isExpanded = expandedPlayers.has(playerId);
        const rawB = (stat as any).rawBatting || {};
        const rawP = (stat as any).rawPitching || {};
        const rawF = (stat as any).rawFielding || {};

        return (
          <Card key={playerId} className="bg-[#0f172a] border-[#1e293b]">
            <button onClick={() => togglePlayer(playerId)} className="w-full p-4 flex items-center justify-between hover:bg-[#1e293b]/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1e293b] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center">
                  {player?.photo ? (<img src={player.photo} alt={playerName} className="w-full h-full object-cover" />) : (<span className="text-[14px] font-medium text-[#38bdf8]">{playerName.split(' ').map((n: string) => n[0]).join('')}</span>)}
                </div>
                <div className="text-left">
                  <h4 className="text-[14px] font-medium text-[#f1f5f9]">{playerName}</h4>
                  <p className="text-[11px] text-[#64748b]">#{stat.playerNumber} - {player?.ageGroup || '12U'} - {stat.gamesPlayed || 0} games</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right text-[11px]">
                  <span className="text-[#64748b]">AVG: </span><span className="text-[#38bdf8] font-medium">{stat.average ? Number(stat.average).toFixed(3) : '.000'}</span>
                  {stat.era ? (<><span className="text-[#64748b] ml-3">ERA: </span><span className="text-[#38bdf8] font-medium">{Number(stat.era).toFixed(2)}</span></>) : null}
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-[#64748b]" /> : <ChevronDown className="h-5 w-5 text-[#64748b]" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-4">
                <div className="bg-[#1e293b] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-[#38bdf8]" /><h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">Batting</h5></div>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <SI label="GP" value={stat.gamesPlayed} />
                    <SI label="AB" value={stat.atBats} />
                    <SI label="AVG" value={stat.average ? Number(stat.average).toFixed(3) : '.000'} />
                    <SI label="OBP" value={stat.onBasePercentage ? Number(stat.onBasePercentage).toFixed(3) : '.000'} />
                    <SI label="SLG" value={stat.sluggingPercentage ? Number(stat.sluggingPercentage).toFixed(3) : '.000'} />
                    <SI label="OPS" value={stat.onBasePlusSlugging ? Number(stat.onBasePlusSlugging).toFixed(3) : '.000'} />
                    <SI label="H" value={stat.hits} />
                    <SI label="R" value={stat.runs} />
                    <SI label="RBI" value={stat.rbi} />
                    <SI label="2B" value={stat.doubles} />
                    <SI label="3B" value={stat.triples} />
                    <SI label="HR" value={stat.homeRuns} />
                    <SI label="BB" value={stat.walks} />
                    <SI label="K" value={stat.strikeouts} />
                    <SI label="SB" value={stat.stolenBases} />
                    <SI label="CS" value={stat.caughtStealing} />
                  </div>
                  {Object.keys(rawB).length > 0 && (
                    <details className="mt-3">
                      <summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Advanced Batting Stats</summary>
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 mt-2">
                        {rawB['QAB'] !== undefined && <SI label="QAB" value={rawB['QAB']} />}
                        {rawB['QAB%'] !== undefined && <SI label="QAB%" value={rawB['QAB%']} />}
                        {rawB['C%'] !== undefined && <SI label="C%" value={rawB['C%']} />}
                        {rawB['BABIP'] !== undefined && <SI label="BABIP" value={rawB['BABIP']} />}
                        {rawB['BA/RISP'] !== undefined && <SI label="BA/RISP" value={rawB['BA/RISP']} />}
                        {rawB['HHB'] !== undefined && <SI label="HHB" value={rawB['HHB']} />}
                        {rawB['LD%'] !== undefined && <SI label="LD%" value={rawB['LD%']} />}
                        {rawB['FB%'] !== undefined && <SI label="FB%" value={rawB['FB%']} />}
                        {rawB['GB%'] !== undefined && <SI label="GB%" value={rawB['GB%']} />}
                        {rawB['XBH'] !== undefined && <SI label="XBH" value={rawB['XBH']} />}
                        {rawB['TB'] !== undefined && <SI label="TB" value={rawB['TB']} />}
                        {rawB['PS'] !== undefined && <SI label="PS" value={rawB['PS']} />}
                        {rawB['PS/PA'] !== undefined && <SI label="PS/PA" value={rawB['PS/PA']} />}
                        {rawB['BB/K'] !== undefined && <SI label="BB/K" value={rawB['BB/K']} />}
                        {rawB['2OUTRBI'] !== undefined && <SI label="2OUT RBI" value={rawB['2OUTRBI']} />}
                        {rawB['LOB'] !== undefined && <SI label="LOB" value={rawB['LOB']} />}
                      </div>
                    </details>
                  )}
                </div>

                {(stat.inningsPitched && stat.inningsPitched > 0) && (
                  <div className="bg-[#1e293b] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3"><Activity className="h-4 w-4 text-[#38bdf8]" /><h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">Pitching</h5></div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      <SI label="IP" value={stat.inningsPitched} />
                      <SI label="ERA" value={stat.era ? Number(stat.era).toFixed(2) : '0.00'} />
                      <SI label="WHIP" value={stat.whip ? Number(stat.whip).toFixed(2) : '0.00'} />
                      <SI label="K" value={stat.strikeoutsPitching} />
                      <SI label="BB" value={stat.walksPitching} />
                      <SI label="H" value={stat.hitsAllowed} />
                      <SI label="ER" value={stat.earnedRuns} />
                      <SI label="W" value={stat.wins} />
                      <SI label="L" value={stat.losses} />
                      <SI label="BF" value={stat.battersFaced} />
                      <SI label="#P" value={stat.pitchCount} />
                    </div>
                    {Object.keys(rawP).length > 0 && (
                      <details className="mt-3">
                        <summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Advanced Pitching Stats</summary>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 mt-2">
                          {rawP['FIP'] !== undefined && <SI label="FIP" value={rawP['FIP']} />}
                          {rawP['S%'] !== undefined && <SI label="S%" value={rawP['S%']} />}
                          {rawP['FPS%'] !== undefined && <SI label="FPS%" value={rawP['FPS%']} />}
                          {rawP['BAA'] !== undefined && <SI label="BAA" value={rawP['BAA']} />}
                          {rawP['K/BF'] !== undefined && <SI label="K/BF" value={rawP['K/BF']} />}
                          {rawP['K/BB'] !== undefined && <SI label="K/BB" value={rawP['K/BB']} />}
                          {rawP['BB/INN'] !== undefined && <SI label="BB/INN" value={rawP['BB/INN']} />}
                          {rawP['P/IP'] !== undefined && <SI label="P/IP" value={rawP['P/IP']} />}
                          {rawP['WEAK%'] !== undefined && <SI label="WEAK%" value={rawP['WEAK%']} />}
                          {rawP['HHB%'] !== undefined && <SI label="HHB%" value={rawP['HHB%']} />}
                          {rawP['GO/AO'] !== undefined && <SI label="GO/AO" value={rawP['GO/AO']} />}
                          {rawP['SM%'] !== undefined && <SI label="SM%" value={rawP['SM%']} />}
                          {rawP['0BBINN'] !== undefined && <SI label="0BB INN" value={rawP['0BBINN']} />}
                          {rawP['123INN'] !== undefined && <SI label="1-2-3" value={rawP['123INN']} />}
                        </div>
                      </details>
                    )}
                  </div>
                )}

                <div className="bg-[#1e293b] p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-[#38bdf8]" /><h5 className="text-[12px] font-medium text-[#38bdf8] uppercase tracking-wider">Fielding</h5></div>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <SI label="FPCT" value={stat.fieldingPercentage ? Number(stat.fieldingPercentage).toFixed(3) : '.000'} />
                    <SI label="TC" value={stat.totalChances} />
                    <SI label="PO" value={stat.putouts} />
                    <SI label="A" value={stat.assists} />
                    <SI label="E" value={stat.errors} />
                  </div>
                  {Object.keys(rawF).length > 0 && (
                    <details className="mt-3">
                      <summary className="text-[10px] text-[#38bdf8] cursor-pointer hover:text-[#0ea5e9]">Position Innings Breakdown</summary>
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 mt-2">
                        {rawF['P'] !== undefined && <SI label="P" value={rawF['P']} />}
                        {rawF['C'] !== undefined && <SI label="C" value={rawF['C']} />}
                        {rawF['1B'] !== undefined && <SI label="1B" value={rawF['1B']} />}
                        {rawF['2B'] !== undefined && <SI label="2B" value={rawF['2B']} />}
                        {rawF['3B'] !== undefined && <SI label="3B" value={rawF['3B']} />}
                        {rawF['SS'] !== undefined && <SI label="SS" value={rawF['SS']} />}
                        {rawF['LF'] !== undefined && <SI label="LF" value={rawF['LF']} />}
                        {rawF['CF'] !== undefined && <SI label="CF" value={rawF['CF']} />}
                        {rawF['RF'] !== undefined && <SI label="RF" value={rawF['RF']} />}
                        {rawF['Total'] !== undefined && <SI label="Total" value={rawF['Total']} />}
                      </div>
                    </details>
                  )}
                </div>

                <div className="bg-[#0a0f1a] p-3 rounded border border-[#334155]">
                  <div className="text-[10px] text-[#64748b]">
                    <span className="font-medium text-[#94a3b8]">Season:</span> {stat.season}
                    <span className="ml-4 font-medium text-[#94a3b8]">Last Updated:</span> {stat.gameDate || 'N/A'}
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

function SI({ label, value }: { label: string; value: any }) {
  const display = value === undefined || value === null || value === '' ? '--' : String(value);
  return (
    <div className="bg-[#0a0f1a] p-2 rounded">
      <div className="text-[10px] text-[#64748b] uppercase tracking-wide mb-0.5">{label}</div>
      <div className="text-[13px] text-[#f1f5f9] font-medium">{display}</div>
    </div>
  );
}
