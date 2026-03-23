import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGameStats } from '../hooks/useGameStats';
import { usePlayerData } from '../hooks/usePlayerData';
import { parseGameStatsCSV } from '../utils/csvParser';
import { PlayerConflictResolver } from './PlayerConflictResolver';
import { GameStatsDisplay } from './GameStatsDisplay';
import { SEASONS } from '../types/gameStats';
import { FileSpreadsheet } from 'lucide-react';

export function GameStatsTab() {
  const { gameStats, addGameStats, deleteGameStats } = useGameStats();
  const { players, addPlayer, addPlayers, updatePlayer } = usePlayerData();
  const [season, setSeason] = useState('Spring 2026');
  const [importing, setImporting] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [conflictMatches, setConflictMatches] = useState<any[]>([]);
  const [showConflictResolver, setShowConflictResolver] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      console.log('CSV file loaded, parsing...');

      const parsedStats = parseGameStatsCSV(text, season);
      console.log('Parsed stats:', parsedStats);

      if (!parsedStats || parsedStats.length === 0) {
        throw new Error('No valid player data found in CSV');
      }

      const matches = parsedStats.map(stat => {
        const fullName = (stat.firstName + ' ' + stat.lastName).toLowerCase();

        const nameMatch = players.find(p =>
          p.name.toLowerCase() === fullName ||
          p.name.toLowerCase().includes(stat.lastName.toLowerCase())
        );

        if (nameMatch) {
          return {
            importedData: {
              firstName: stat.firstName,
              lastName: stat.lastName,
              playerNumber: stat.playerNumber,
              gameStats: stat,
            },
            existingPlayer: nameMatch,
            conflictType: 'name_match' as const,
          };
        }

        return {
          importedData: {
            firstName: stat.firstName,
            lastName: stat.lastName,
            playerNumber: stat.playerNumber,
            gameStats: stat,
          },
          existingPlayer: undefined,
          conflictType: 'new_player' as const,
        };
      });

      setConflictMatches(matches);
      setShowConflictResolver(true);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert('Error importing CSV: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setShowConflictResolver(false);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleResolveConflicts = async (resolutions: any[]) => {
    try {
      console.log('=== HANDLE RESOLVE CONFLICTS START ===');

      const newGameStats: any[] = [];
      const playersToCreate: any[] = [];
      let mergedCount = 0;
      let skippedCount = 0;

      resolutions.forEach(({ match, action }) => {
        if (action === 'skip') {
          skippedCount++;
          return;
        }

        const { importedData, existingPlayer } = match;

        if (action === 'merge' && existingPlayer) {
          newGameStats.push({
            ...importedData.gameStats,
            playerId: existingPlayer.id,
          });
          mergedCount++;
        } else if (action === 'create_new') {
          playersToCreate.push({
            playerData: {
              name: importedData.firstName + ' ' + importedData.lastName,
              dateOfBirth: '',
              ageGroup: '12U',
              positions: [],
              throwingHand: 'Right' as const,
              battingHand: 'Right' as const,
              isAmbidextrous: false,
              photoHistory: [],
            },
            gameStats: importedData.gameStats,
            playerNumber: importedData.playerNumber,
          });
        }
      });

      // Batch create all new players (await the async call)
      if (playersToCreate.length > 0) {
        const createdPlayers = await addPlayers(playersToCreate.map(p => p.playerData));
        console.log('Created players:', createdPlayers);

        if (createdPlayers && createdPlayers.length > 0) {
          createdPlayers.forEach((player: any, idx: number) => {
            newGameStats.push({
              ...playersToCreate[idx].gameStats,
              playerId: player.id,
            });
            console.log('Linked game stats to ' + player.name);
          });
        }
      }

      // Add all game stats (also async now)
      if (newGameStats.length > 0) {
        console.log('Adding ' + newGameStats.length + ' game stats...');
        await addGameStats(newGameStats);
        console.log('Game stats added successfully');
      }

      setShowConflictResolver(false);
      setConflictMatches([]);

      alert(
        'Import complete!\n\n' +
        newGameStats.length + ' game stats imported\n' +
        playersToCreate.length + ' new players created\n' +
        mergedCount + ' stats merged\n' +
        (skippedCount > 0 ? skippedCount + ' skipped\n' : '')
      );
    } catch (error) {
      console.error('Error resolving conflicts:', error);
      alert('Error resolving conflicts: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setShowConflictResolver(false);
      setConflictMatches([]);
    }
  };

  const handleCancelImport = () => {
    setShowConflictResolver(false);
    setConflictMatches([]);
  };

  const filteredStats = selectedPlayer === 'all'
    ? gameStats
    : gameStats.filter(s => s.playerId === selectedPlayer);

  return (
    <div className="space-y-6">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Import Game Statistics</h3>
            <p className="text-[11px] text-[#94a3b8]">
              Upload CSV files with batting, pitching, and fielding stats
            </p>
          </div>
          <FileSpreadsheet className="h-8 w-8 text-[#38bdf8] opacity-50" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155]">
                  {SEASONS.map(s => (
                    <SelectItem key={s} value={s} className="text-[#e2e8f0]">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Upload CSV File</Label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={importing}
                  className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[11px] file:bg-[#38bdf8] file:text-[#0a0f1a] hover:file:bg-[#0ea5e9] file:cursor-pointer cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-[#64748b] mt-1">
                CSV format: Number, Last, First, GP, PA, AB, AVG, OBP, OPS...
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-center gap-4">
          <Label className="text-[11px] text-[#94a3b8]">Filter by Player:</Label>
          <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              <SelectItem value="all" className="text-[#e2e8f0]">All Players</SelectItem>
              {players.map(player => (
                <SelectItem key={player.id} value={player.id} className="text-[#e2e8f0]">
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[11px] text-[#64748b]">
            {filteredStats.length} stats imported
          </span>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredStats.length > 0 ? (
          <GameStatsDisplay
            gameStats={filteredStats}
            players={players}
          />
        ) : (
          <Card className="bg-[#0f172a] border-[#1e293b] p-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-[#334155] mx-auto mb-4" />
            <h4 className="text-[14px] text-[#94a3b8] mb-2">No Game Stats Imported</h4>
            <p className="text-[11px] text-[#64748b]">
              Upload a CSV file to import game statistics and build player profiles
            </p>
          </Card>
        )}
      </div>

      {showConflictResolver && (
        <PlayerConflictResolver
          matches={conflictMatches}
          onResolve={handleResolveConflicts}
          onCancel={handleCancelImport}
        />
      )}
    </div>
  );
}
