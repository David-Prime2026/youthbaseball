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
  const [autoMerge, setAutoMerge] = useState(() => {
    const stored = localStorage.getItem('premier-select-auto-merge');
    return stored === 'true';
  });

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
      
      // Detect conflicts and matches
      const matches = parsedStats.map(stat => {
        const fullName = `${stat.firstName} ${stat.lastName}`.toLowerCase();
        
        console.log(`Checking player: ${stat.firstName} ${stat.lastName}`);
        
        // Try exact ID match first
        const exactMatch = players.find(p => p.id === stat.playerId);
        if (exactMatch) {
          console.log(`  → Exact match found: ${exactMatch.name}`);
          return {
            importedData: {
              firstName: stat.firstName,
              lastName: stat.lastName,
              playerNumber: stat.playerNumber,
              gameStats: stat,
            },
            existingPlayer: exactMatch,
            conflictType: 'exact_match' as const,
          };
        }

        // Try name match
        const nameMatch = players.find(p => 
          p.name.toLowerCase() === fullName ||
          p.name.toLowerCase().includes(stat.lastName.toLowerCase())
        );
        
        if (nameMatch) {
          console.log(`  → Name match found: ${nameMatch.name}`);
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

        // New player
        console.log(`  → New player`);
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

      console.log('Total matches created:', matches.length);
      console.log('Conflict matches:', matches);
      setConflictMatches(matches);
      setShowConflictResolver(true);
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert(`Error importing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowConflictResolver(false);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  const handleResolveConflicts = (resolutions: any[]) => {
    try {
      console.log('=== HANDLE RESOLVE CONFLICTS START ===');
      console.log('Total resolutions received:', resolutions.length);
      
      const newGameStats: any[] = [];
      const playersToCreate: any[] = [];
      let mergedCount = 0;
      let skippedCount = 0;

      // First pass: collect all data
      resolutions.forEach(({ match, action }, idx) => {
        console.log(`\nProcessing resolution ${idx + 1}/${resolutions.length}:`);
        console.log(`  Player: ${match.importedData.firstName} ${match.importedData.lastName}`);
        console.log(`  Action: ${action}`);
        console.log(`  Conflict Type: ${match.conflictType}`);
        
        if (action === 'skip') {
          console.log('  → Skipped');
          skippedCount++;
          return;
        }

        const { importedData, existingPlayer } = match;

        if (action === 'merge' && existingPlayer) {
          // Check if this exact stat already exists by checking the unique ID
          // Each game stat should have a unique combination of player + date + stats
          const existingStat = gameStats.find(
            s => s.playerId === existingPlayer.id && 
                 s.season === importedData.gameStats.season &&
                 s.gameDate === importedData.gameStats.gameDate &&
                 s.atBats === importedData.gameStats.atBats &&
                 s.hits === importedData.gameStats.hits &&
                 s.runs === importedData.gameStats.runs &&
                 s.rbi === importedData.gameStats.rbi
          );
          
          if (existingStat) {
            console.log('  → Skipping exact duplicate stat for:', existingPlayer.name);
            skippedCount++;
            return;
          }
          
          // Add stats to existing player with the existing player's ID
          newGameStats.push({
            ...importedData.gameStats,
            playerId: existingPlayer.id,
          });
          mergedCount++;
          console.log(`  ✅ Merged to existing player: ${existingPlayer.name} (${existingPlayer.id})`);
        } else if (action === 'create_new') {
          console.log('  → Will create new player profile');
          playersToCreate.push({
            playerData: {
              name: `${importedData.firstName} ${importedData.lastName}`,
              dateOfBirth: '',
              ageGroup: '12U',
              positions: [],
              throwingHand: 'Right',
              battingHand: 'Right',
              isAmbidextrous: false,
              photoHistory: [],
            },
            gameStats: importedData.gameStats,
          });
        }
      });

      console.log('\n=== BATCH CREATION ===');
      console.log('Players to create:', playersToCreate.length);
      
      // Batch create all new players
      if (playersToCreate.length > 0) {
        const createdPlayers = addPlayers(playersToCreate.map(p => p.playerData));
        console.log('✅ Created players:', createdPlayers);
        
        // Add game stats for newly created players
        createdPlayers.forEach((player, idx) => {
          newGameStats.push({
            ...playersToCreate[idx].gameStats,
            playerId: player.id,
          });
          console.log(`  ✅ Linked game stats to ${player.name} (${player.id})`);
        });
      }

      console.log('\n=== SUMMARY ===');
      console.log('New game stats to add:', newGameStats.length);
      console.log('Created count:', playersToCreate.length);
      console.log('Merged count:', mergedCount);
      console.log('Skipped:', skippedCount);
      console.log('Game stats array:', newGameStats);
      console.log('==================\n');

      // Add all game stats
      if (newGameStats.length > 0) {
        console.log('Calling addGameStats with', newGameStats.length, 'stats...');
        addGameStats(newGameStats);
        console.log('✅ addGameStats completed');
      }

      setShowConflictResolver(false);
      setConflictMatches([]);

      alert(
        `Import complete!\\n\\n` +
        `✓ ${newGameStats.length} game stats imported\\n` +
        `✓ ${playersToCreate.length} new player${playersToCreate.length !== 1 ? 's' : ''} created\\n` +
        `✓ ${mergedCount} stat${mergedCount !== 1 ? 's' : ''} merged\\n` +
        (skippedCount > 0 ? `⊘ ${skippedCount} skipped (duplicates or user choice)\\n` : '') +
        (playersToCreate.length > 0 ? `\\n⚠ Please complete profiles for new players in the Players tab` : '')
      );
    } catch (error) {
      console.error('Error resolving conflicts:', error);
      alert(`Error resolving conflicts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      // ALWAYS close the modal, even if there's an error
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
      {/* Import Section */}
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

      {/* Filter Section */}
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
            {filteredStats.length} stat{filteredStats.length !== 1 ? 's' : ''} imported
          </span>
        </div>
      </Card>

      {/* Stats Display */}
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

      {/* Conflict Resolver */}
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