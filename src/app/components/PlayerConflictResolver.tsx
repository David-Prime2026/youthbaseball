import { useState } from 'react';
import { Player } from '../types/player';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, UserPlus, Users, RefreshCw, Camera } from 'lucide-react';
import { GameStats } from '../types/gameStats';

interface PlayerMatch {
  importedData: {
    firstName: string;
    lastName: string;
    playerNumber: string;
    gameStats: Omit<GameStats, 'id' | 'createdAt' | 'updatedAt'>;
  };
  existingPlayer?: Player;
  conflictType: 'exact_match' | 'name_match' | 'new_player';
}

interface PlayerConflictResolverProps {
  matches: PlayerMatch[];
  onResolve: (resolutions: {
    match: PlayerMatch;
    action: 'merge' | 'create_new' | 'skip';
  }[]) => void;
  onCancel: () => void;
}

export function PlayerConflictResolver({ matches, onResolve, onCancel }: PlayerConflictResolverProps) {
  console.log('PlayerConflictResolver rendered with', matches.length, 'matches');
  
  const [resolutions, setResolutions] = useState<Record<string, 'merge' | 'create_new' | 'skip'>>(
    matches.reduce((acc, match, index) => {
      // Default actions
      if (match.conflictType === 'exact_match') {
        acc[index] = 'merge';
      } else if (match.conflictType === 'new_player') {
        acc[index] = 'create_new';
      } else {
        acc[index] = 'merge'; // Default to merge for name matches
      }
      return acc;
    }, {} as Record<string, 'merge' | 'create_new' | 'skip'>)
  );

  const handleResolutionChange = (index: number, action: 'merge' | 'create_new' | 'skip') => {
    setResolutions(prev => ({ ...prev, [index]: action }));
  };

  const handleConfirm = () => {
    const resolvedMatches = matches.map((match, index) => ({
      match,
      action: resolutions[index],
    }));
    
    console.log('=== PLAYER CONFLICT RESOLVER - CONFIRM ===');
    console.log('Total matches to resolve:', resolvedMatches.length);
    resolvedMatches.forEach((resolution, idx) => {
      console.log(`  ${idx + 1}. ${resolution.match.importedData.firstName} ${resolution.match.importedData.lastName} - Action: ${resolution.action}`);
    });
    console.log('==========================================\n');
    
    onResolve(resolvedMatches);
  };

  const conflictCount = matches.filter(m => m.conflictType === 'name_match').length;
  const newPlayerCount = matches.filter(m => m.conflictType === 'new_player').length;
  const exactMatchCount = matches.filter(m => m.conflictType === 'exact_match').length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-[#f59e0b]" />
            <div>
              <h3 className="text-[16px] font-medium text-[#f1f5f9]">Review Player Import</h3>
              <p className="text-[11px] text-[#94a3b8]">
                {matches.length} players found • {exactMatchCount} exact matches • {conflictCount} possible duplicates • {newPlayerCount} new
              </p>
            </div>
          </div>

          <div className="bg-[#1e293b] p-3 rounded-lg">
            <p className="text-[11px] text-[#94a3b8]">
              <span className="text-[#38bdf8] font-medium">Merge:</span> Add stats to existing player profile • 
              <span className="text-[#10b981] font-medium ml-2">Create New:</span> Create separate player profile • 
              <span className="text-[#64748b] font-medium ml-2">Skip:</span> Don't import this player
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {matches.map((match, index) => {
            const { importedData, existingPlayer, conflictType } = match;
            const resolution = resolutions[index];

            return (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  conflictType === 'exact_match'
                    ? 'bg-[#064e3b] border-[#065f46]'
                    : conflictType === 'name_match'
                    ? 'bg-[#7c2d12] border-[#9a3412]'
                    : 'bg-[#1e293b] border-[#334155]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Player Photo - LEFT SIDE */}
                  {existingPlayer && (
                    <div className="mr-4 flex-shrink-0">
                      <div className="w-24 h-24 rounded-lg bg-[#1e293b] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center">
                        {existingPlayer.photo ? (
                          <img src={existingPlayer.photo} alt={existingPlayer.name} className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-8 w-8 text-[#64748b]" />
                        )}
                      </div>
                      <p className="text-[9px] text-[#64748b] text-center mt-1">Current Photo</p>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-[13px] font-medium text-[#f1f5f9]">
                        #{importedData.playerNumber} {importedData.firstName} {importedData.lastName}
                      </h4>
                      {conflictType === 'exact_match' && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#10b981] text-[#0a0f1a] rounded font-medium">
                          EXACT MATCH
                        </span>
                      )}
                      {conflictType === 'name_match' && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#f59e0b] text-[#0a0f1a] rounded font-medium">
                          POSSIBLE DUPLICATE
                        </span>
                      )}
                      {conflictType === 'new_player' && (
                        <span className="text-[10px] px-2 py-0.5 bg-[#38bdf8] text-[#0a0f1a] rounded font-medium">
                          NEW PLAYER
                        </span>
                      )}
                    </div>

                    {existingPlayer && (
                      <div className="bg-[#0a0f1a] p-3 rounded mb-3">
                        <p className="text-[10px] text-[#64748b] mb-2">EXISTING PROFILE:</p>
                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div>
                            <span className="text-[#94a3b8]">Name:</span>
                            <span className="text-[#f1f5f9] ml-1">{existingPlayer.name}</span>
                          </div>
                          <div>
                            <span className="text-[#94a3b8]">Age Group:</span>
                            <span className="text-[#f1f5f9] ml-1">{existingPlayer.ageGroup}</span>
                          </div>
                          <div>
                            <span className="text-[#94a3b8]">Positions:</span>
                            <span className="text-[#f1f5f9] ml-1">
                              {existingPlayer.positions.join(', ') || 'None'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#64748b]">Season:</span>
                        <span className="text-[#e2e8f0] ml-1">{importedData.gameStats.season}</span>
                      </div>
                      <div>
                        <span className="text-[#64748b]">AVG:</span>
                        <span className="text-[#e2e8f0] ml-1">
                          {importedData.gameStats.average?.toFixed(3) || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#64748b]">Hits:</span>
                        <span className="text-[#e2e8f0] ml-1">
                          {importedData.gameStats.hits || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {existingPlayer && (
                      <Button
                        onClick={() => handleResolutionChange(index, 'merge')}
                        size="sm"
                        variant={resolution === 'merge' ? 'default' : 'outline'}
                        className={
                          resolution === 'merge'
                            ? 'bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]'
                            : 'border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]'
                        }
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Merge
                      </Button>
                    )}
                    <Button
                      onClick={() => handleResolutionChange(index, 'create_new')}
                      size="sm"
                      variant={resolution === 'create_new' ? 'default' : 'outline'}
                      className={
                        resolution === 'create_new'
                          ? 'bg-[#10b981] text-[#0a0f1a] hover:bg-[#059669]'
                          : 'border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]'
                      }
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      New
                    </Button>
                    <Button
                      onClick={() => handleResolutionChange(index, 'skip')}
                      size="sm"
                      variant={resolution === 'skip' ? 'default' : 'outline'}
                      className={
                        resolution === 'skip'
                          ? 'bg-[#64748b] text-[#0a0f1a] hover:bg-[#475569]'
                          : 'border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]'
                      }
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#1e293b]">
          <div className="text-[11px] text-[#94a3b8]">
            {Object.values(resolutions).filter(r => r === 'merge').length} to merge • 
            {Object.values(resolutions).filter(r => r === 'create_new').length} to create • 
            {Object.values(resolutions).filter(r => r === 'skip').length} to skip
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]"
            >
              Cancel Import
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
            >
              <Users className="h-4 w-4 mr-2" />
              Confirm & Import
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}