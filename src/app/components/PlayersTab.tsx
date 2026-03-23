import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePlayerData } from '../hooks/usePlayerData';
import { useGameStats } from '../hooks/useGameStats';
import { PlayerProfileEditor } from './PlayerProfileEditor';
import { PlayerDetailView } from './PlayerDetailView';
import { Player } from '../types/player';
import { FileDown, UserPlus, Edit2, Trash2, Camera, AlertCircle, CheckCircle, Search, Eye } from 'lucide-react';

export function PlayersTab() {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayerData();
  const { gameStats } = useGameStats();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isProfileIncomplete = (player: Player): boolean => {
    return !player.dateOfBirth || 
           player.positions.length === 0 || 
           !player.photo;
  };

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const incompletePlayers = filteredPlayers.filter(isProfileIncomplete);
  const completePlayers = filteredPlayers.filter(p => !isProfileIncomplete(p));

  const handleCreateNewPlayer = () => {
    const newPlayer = addPlayer({
      name: '',
      dateOfBirth: '',
      ageGroup: '12U',
      positions: [],
      throwingHand: 'Right',
      battingHand: 'Right',
      isAmbidextrous: false,
    });
    setEditingPlayer(newPlayer);
  };

  const getPlayerGameStatsCount = (playerId: string): number => {
    return gameStats.filter(s => s.playerId === playerId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Player Management</h3>
            <p className="text-[11px] text-[#94a3b8]">
              {players.length} total player{players.length !== 1 ? 's' : ''} • 
              {incompletePlayers.length > 0 && (
                <span className="text-[#f59e0b] ml-1">
                  {incompletePlayers.length} incomplete profile{incompletePlayers.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          <Button 
            onClick={handleCreateNewPlayer}
            className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Player
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
          <Input
            type="text"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] pl-10"
          />
        </div>
      </Card>

      {/* Incomplete Profiles Alert */}
      {incompletePlayers.length > 0 && (
        <Card className="bg-[#7c2d12] border-[#9a3412] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#fdba74] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[13px] font-medium text-[#fdba74] mb-1">
                {incompletePlayers.length} Incomplete Profile{incompletePlayers.length !== 1 ? 's' : ''}
              </h4>
              <p className="text-[11px] text-[#fef3c7]">
                Players imported from game stats need additional information. Click "Complete Profile" to add missing details.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Incomplete Profiles Section */}
      {incompletePlayers.length > 0 && (
        <div>
          <h4 className="text-[13px] font-medium text-[#f59e0b] mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Incomplete Profiles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incompletePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                gameStatsCount={getPlayerGameStatsCount(player.id)}
                isIncomplete={true}
                onView={() => setViewingPlayer(player)}
                onEdit={() => setEditingPlayer(player)}
                onDelete={() => {
                  if (confirm(`Delete ${player.name}?`)) {
                    deletePlayer(player.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Complete Profiles Section */}
      {completePlayers.length > 0 && (
        <div>
          <h4 className="text-[13px] font-medium text-[#10b981] mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Complete Profiles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completePlayers.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                gameStatsCount={getPlayerGameStatsCount(player.id)}
                isIncomplete={false}
                onView={() => setViewingPlayer(player)}
                onEdit={() => setEditingPlayer(player)}
                onDelete={() => {
                  if (confirm(`Delete ${player.name}?`)) {
                    deletePlayer(player.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPlayers.length === 0 && (
        <Card className="bg-[#0f172a] border-[#1e293b] p-12 text-center">
          <UserPlus className="h-12 w-12 text-[#334155] mx-auto mb-4" />
          <h4 className="text-[14px] text-[#94a3b8] mb-2">
            {searchQuery ? 'No players found' : 'No Players Yet'}
          </h4>
          <p className="text-[11px] text-[#64748b] mb-4">
            {searchQuery 
              ? 'Try adjusting your search' 
              : 'Add players manually or import game stats to get started'}
          </p>
          {!searchQuery && (
            <Button 
              onClick={handleCreateNewPlayer}
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Your First Player
            </Button>
          )}
        </Card>
      )}

      {/* Profile Editor Modal */}
      {editingPlayer && (
        <PlayerProfileEditor
          player={editingPlayer}
          isIncomplete={isProfileIncomplete(editingPlayer)}
          onSave={(updates) => {
            updatePlayer(editingPlayer.id, updates);
            setEditingPlayer(null);
          }}
          onClose={() => setEditingPlayer(null)}
        />
      )}

      {/* Player Detail View Modal */}
      {viewingPlayer && (
        <PlayerDetailView
          player={viewingPlayer}
          onClose={() => setViewingPlayer(null)}
          onEdit={() => {
            setEditingPlayer(viewingPlayer);
            setViewingPlayer(null);
          }}
        />
      )}
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  gameStatsCount: number;
  isIncomplete: boolean;
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PlayerCard({ player, gameStatsCount, isIncomplete, onView, onEdit, onDelete }: PlayerCardProps) {
  const missingFields = [];
  if (!player.dateOfBirth) missingFields.push('DOB');
  if (player.positions.length === 0) missingFields.push('Positions');
  if (!player.photo) missingFields.push('Photo');

  return (
    <Card className={`bg-[#0f172a] border-[#1e293b] p-4 ${isIncomplete ? 'ring-2 ring-[#f59e0b]' : ''}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-16 h-16 rounded-lg bg-[#1e293b] border-2 border-[#334155] overflow-hidden flex items-center justify-center flex-shrink-0">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <Camera className="h-6 w-6 text-[#64748b]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-medium text-[#f1f5f9] truncate">
            {player.name || 'Unnamed Player'}
          </h4>
          <p className="text-[11px] text-[#64748b]">
            {player.ageGroup} • {player.throwingHand[0]}/{player.battingHand[0]}
          </p>
          {player.positions.length > 0 && (
            <p className="text-[10px] text-[#94a3b8] mt-1">
              {player.positions.slice(0, 2).join(', ')}
              {player.positions.length > 2 && ` +${player.positions.length - 2}`}
            </p>
          )}
        </div>
      </div>

      {isIncomplete && (
        <div className="bg-[#7c2d12] border border-[#9a3412] px-2 py-1 rounded mb-3">
          <p className="text-[10px] text-[#fdba74]">
            Missing: {missingFields.join(', ')}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3 text-[11px]">
        <div className="bg-[#1e293b] px-2 py-1 rounded">
          <span className="text-[#64748b]">Stats:</span>
          <span className="text-[#e2e8f0] ml-1">{gameStatsCount}</span>
        </div>
        {player.dateOfBirth && (
          <div className="bg-[#1e293b] px-2 py-1 rounded">
            <span className="text-[#64748b]">Age:</span>
            <span className="text-[#e2e8f0] ml-1">
              {Math.floor((new Date().getTime() - new Date(player.dateOfBirth).getTime()) / 31536000000)}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onView && (
          <Button
            onClick={onView}
            size="sm"
            className="flex-1 bg-[#06b6d4] text-[#0a0f1a] hover:bg-[#0891b2]"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        )}
        <Button
          onClick={onEdit}
          size="sm"
          className={isIncomplete 
            ? 'flex-1 bg-[#f59e0b] text-[#0a0f1a] hover:bg-[#d97706]'
            : 'flex-1 bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]'
          }
        >
          <Edit2 className="h-3 w-3 mr-1" />
          {isIncomplete ? 'Complete Profile' : 'Edit'}
        </Button>
        <Button
          onClick={onDelete}
          size="sm"
          variant="outline"
          className="border-[#334155] text-[#ef4444] hover:bg-[#7f1d1d] hover:border-[#ef4444]"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}