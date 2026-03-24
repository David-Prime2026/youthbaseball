import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePlayerData } from '../hooks/usePlayerData';
import { useGameStats } from '../hooks/useGameStats';
import { PlayerProfileEditor } from './PlayerProfileEditor';
import { PlayerDetailView } from './PlayerDetailView';
import { Player } from '../types/player';
import { UserPlus, Edit2, Trash2, Camera, AlertCircle, CheckCircle, Search, Eye } from 'lucide-react';

export function PlayersTab() {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayerData();
  const { gameStats } = useGameStats();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isProfileIncomplete = (player: Player): boolean => {
    return !player.dateOfBirth || player.positions.length === 0 || !player.photo;
  };

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const incompletePlayers = filteredPlayers.filter(isProfileIncomplete);
  const completePlayers = filteredPlayers.filter(p => !isProfileIncomplete(p));

  const handleCreateNewPlayer = () => {
    const newPlayer = addPlayer({ name: '', dateOfBirth: '', ageGroup: '12U', positions: [], throwingHand: 'Right', battingHand: 'Right', isAmbidextrous: false });
    if (newPlayer) setEditingPlayer(newPlayer as any);
  };

  const getPlayerGamesPlayed = (playerId: string): number => {
    const stats = gameStats.filter(s => s.playerId === playerId);
    return stats.reduce((sum, s) => sum + (s.gamesPlayed || 0), 0);
  };

  const getPlayerJerseyNumber = (player: Player): string => {
    if ((player as any).jerseyNumber) return (player as any).jerseyNumber;
    const stat = gameStats.find(s => s.playerId === player.id);
    return stat?.playerNumber || '';
  };

  const getPlayerAvg = (playerId: string): string => {
    const stat = gameStats.find(s => s.playerId === playerId);
    return stat?.average ? Number(stat.average).toFixed(3) : '';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Player Management</h3>
            <p className="text-[11px] text-[#94a3b8]">
              {players.length} total players
              {incompletePlayers.length > 0 && (<span className="text-[#f59e0b] ml-1">{incompletePlayers.length} incomplete</span>)}
            </p>
          </div>
          <Button onClick={handleCreateNewPlayer} className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"><UserPlus className="mr-2 h-4 w-4" />Add New Player</Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
          <Input type="text" placeholder="Search players by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] pl-10" />
        </div>
      </Card>

      {incompletePlayers.length > 0 && (
        <Card className="bg-[#7c2d12] border-[#9a3412] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#fdba74] flex-shrink-0 mt-0.5" />
            <div><h4 className="text-[13px] font-medium text-[#fdba74] mb-1">{incompletePlayers.length} Incomplete Profiles</h4><p className="text-[11px] text-[#fef3c7]">Click "Complete Profile" to add missing details.</p></div>
          </div>
        </Card>
      )}

      {incompletePlayers.length > 0 && (
        <div>
          <h4 className="text-[13px] font-medium text-[#f59e0b] mb-3 flex items-center gap-2"><AlertCircle className="h-4 w-4" />Incomplete Profiles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incompletePlayers.map(player => (
              <PlayerCard key={player.id} player={player} gamesPlayed={getPlayerGamesPlayed(player.id)} jerseyNumber={getPlayerJerseyNumber(player)} battingAvg={getPlayerAvg(player.id)} isIncomplete={true} onView={() => setViewingPlayer(player)} onEdit={() => setEditingPlayer(player)} onDelete={() => { if (confirm('Delete ' + player.name + '?')) deletePlayer(player.id); }} />
            ))}
          </div>
        </div>
      )}

      {completePlayers.length > 0 && (
        <div>
          <h4 className="text-[13px] font-medium text-[#10b981] mb-3 flex items-center gap-2"><CheckCircle className="h-4 w-4" />Complete Profiles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completePlayers.map(player => (
              <PlayerCard key={player.id} player={player} gamesPlayed={getPlayerGamesPlayed(player.id)} jerseyNumber={getPlayerJerseyNumber(player)} battingAvg={getPlayerAvg(player.id)} isIncomplete={false} onView={() => setViewingPlayer(player)} onEdit={() => setEditingPlayer(player)} onDelete={() => { if (confirm('Delete ' + player.name + '?')) deletePlayer(player.id); }} />
            ))}
          </div>
        </div>
      )}

      {filteredPlayers.length === 0 && (
        <Card className="bg-[#0f172a] border-[#1e293b] p-12 text-center">
          <UserPlus className="h-12 w-12 text-[#334155] mx-auto mb-4" />
          <h4 className="text-[14px] text-[#94a3b8] mb-2">{searchQuery ? 'No players found' : 'No Players Yet'}</h4>
          {!searchQuery && (<Button onClick={handleCreateNewPlayer} className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"><UserPlus className="mr-2 h-4 w-4" />Add Your First Player</Button>)}
        </Card>
      )}

      {editingPlayer && (
        <PlayerProfileEditor player={editingPlayer} isIncomplete={isProfileIncomplete(editingPlayer)} onSave={(updates) => { updatePlayer(editingPlayer.id, updates); setEditingPlayer(null); }} onClose={() => setEditingPlayer(null)} />
      )}

      {viewingPlayer && (
        <PlayerDetailView player={viewingPlayer} onClose={() => setViewingPlayer(null)} onEdit={() => { setEditingPlayer(viewingPlayer); setViewingPlayer(null); }} />
      )}
    </div>
  );
}

interface PlayerCardProps {
  player: Player;
  gamesPlayed: number;
  jerseyNumber: string;
  battingAvg: string;
  isIncomplete: boolean;
  onView?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function PlayerCard({ player, gamesPlayed, jerseyNumber, battingAvg, isIncomplete, onView, onEdit, onDelete }: PlayerCardProps) {
  const missingFields = [];
  if (!player.dateOfBirth) missingFields.push('DOB');
  if (player.positions.length === 0) missingFields.push('Positions');
  if (!player.photo) missingFields.push('Photo');

  return (
    <Card className={'bg-[#0f172a] border-[#1e293b] p-4 ' + (isIncomplete ? 'ring-2 ring-[#f59e0b]' : '')}>
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-16 h-16 rounded-lg bg-[#1e293b] border-2 border-[#334155] overflow-hidden flex items-center justify-center flex-shrink-0">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <Camera className="h-6 w-6 text-[#64748b]" />
          )}
          {jerseyNumber && jerseyNumber !== 'N/A' && (
            <div className="absolute -top-1 -right-1 bg-[#38bdf8] text-[#0a0f1a] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {jerseyNumber}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-medium text-[#f1f5f9] truncate">{player.name || 'Unnamed Player'}</h4>
          <p className="text-[11px] text-[#64748b]">
            {jerseyNumber && jerseyNumber !== 'N/A' ? '#' + jerseyNumber + ' - ' : ''}{player.ageGroup} - {player.throwingHand[0]}/{player.battingHand[0]}
          </p>
          {player.positions.length > 0 && (
            <p className="text-[10px] text-[#94a3b8] mt-1">{player.positions.slice(0, 3).join(', ')}{player.positions.length > 3 ? ' +' + (player.positions.length - 3) : ''}</p>
          )}
        </div>
      </div>

      {isIncomplete && (
        <div className="bg-[#7c2d12] border border-[#9a3412] px-2 py-1 rounded mb-3"><p className="text-[10px] text-[#fdba74]">Missing: {missingFields.join(', ')}</p></div>
      )}

      <div className="flex items-center gap-2 mb-3 text-[11px]">
        <div className="bg-[#1e293b] px-2 py-1 rounded"><span className="text-[#64748b]">GP:</span><span className="text-[#e2e8f0] ml-1">{gamesPlayed}</span></div>
        {battingAvg && (<div className="bg-[#1e293b] px-2 py-1 rounded"><span className="text-[#64748b]">AVG:</span><span className="text-[#10b981] ml-1">{battingAvg}</span></div>)}
        {player.dateOfBirth && (<div className="bg-[#1e293b] px-2 py-1 rounded"><span className="text-[#64748b]">Age:</span><span className="text-[#e2e8f0] ml-1">{Math.floor((new Date().getTime() - new Date(player.dateOfBirth).getTime()) / 31536000000)}</span></div>)}
      </div>

      <div className="flex gap-2">
        {onView && (<Button onClick={onView} size="sm" className="flex-1 bg-[#06b6d4] text-[#0a0f1a] hover:bg-[#0891b2]"><Eye className="h-3 w-3 mr-1" />View</Button>)}
        <Button onClick={onEdit} size="sm" className={isIncomplete ? 'flex-1 bg-[#f59e0b] text-[#0a0f1a] hover:bg-[#d97706]' : 'flex-1 bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]'}><Edit2 className="h-3 w-3 mr-1" />{isIncomplete ? 'Complete Profile' : 'Edit'}</Button>
        <Button onClick={onDelete} size="sm" variant="outline" className="border-[#334155] text-[#ef4444] hover:bg-[#7f1d1d] hover:border-[#ef4444]"><Trash2 className="h-3 w-3" /></Button>
      </div>
    </Card>
  );
}
