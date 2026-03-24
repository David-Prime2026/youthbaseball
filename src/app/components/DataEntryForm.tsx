import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { AGE_GROUPS } from '../types/player';
import { SEASONS } from '../types/gameStats';
import { detectOutlier } from '../utils/outlierDetection';
import { PerformanceEntry } from '../types/performance';

interface DataEntryFormProps {
  category: string;
  metricType: string;
  metricUnit: string;
  drillOptions: string[];
  players: string[];
  existingEntries?: PerformanceEntry[];
  onSubmit: (data: {
    playerName: string;
    playerId: string;
    ageGroup: string;
    date: string;
    season: string;
    drill: string;
    reps: number[];
    notes: string;
    metricType: string;
  }) => void;
  onAddPlayer: (playerName: string) => void;
}

export function DataEntryForm({
  category,
  metricType,
  metricUnit,
  drillOptions,
  players,
  existingEntries = [],
  onSubmit,
  onAddPlayer,
}: DataEntryFormProps) {
  const [playerName, setPlayerName] = useState(players[0] || '');
  const [ageGroup, setAgeGroup] = useState('12U');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [season, setSeason] = useState('Spring 2026');
  const [drill, setDrill] = useState(drillOptions[0] || '');
  const [reps, setReps] = useState<string[]>(['', '', '']);
  const [notes, setNotes] = useState('');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [outlierWarning, setOutlierWarning] = useState<string | null>(null);
  const [outlierOverride, setOutlierOverride] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const repValues = reps.map(r => parseFloat(r) || 0).filter(r => r > 0);
    if (repValues.length === 0) {
      alert('Please enter at least one rep value');
      return;
    }

    // Check for outliers on the average of entered reps
    if (!outlierOverride) {
      const avgValue = repValues.reduce((sum, val) => sum + val, 0) / repValues.length;
      const playerEntries = existingEntries.filter(e => 
        e.playerName === playerName && 
        e.metricType === metricType &&
        e.ageGroup === ageGroup
      );
      
      const outlierResult = detectOutlier(avgValue, playerEntries, metricType);
      if (outlierResult.isOutlier) {
        setOutlierWarning(outlierResult.message);
        return;
      }
    }

    onSubmit({
      playerName,
      playerId: playerName.toLowerCase().replace(/\s+/g, '-'),
      ageGroup,
      date,
      season,
      drill,
      reps: repValues,
      notes,
      metricType,
    });

    // Reset reps and notes
    setReps(['', '', '']);
    setNotes('');
    setOutlierWarning(null);
    setOutlierOverride(false);
  };

  const addRep = () => {
    setReps([...reps, '']);
  };

  const removeRep = (index: number) => {
    setReps(reps.filter((_, i) => i !== index));
  };

  const updateRep = (index: number, value: string) => {
    const newReps = [...reps];
    newReps[index] = value;
    setReps(newReps);
  };

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setPlayerName(newPlayerName.trim());
      setNewPlayerName('');
      setShowAddPlayer(false);
    }
  };

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="mb-4">
        <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Enter Performance Data</h3>
        <p className="text-[11px] text-[#94a3b8]">Track {metricType} performance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Player Selection */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Player</Label>
            {!showAddPlayer ? (
              <div className="flex gap-2">
                <Select value={playerName} onValueChange={setPlayerName}>
                  <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1e293b] border-[#334155]">
                    {players.filter(p => p && p.trim() !== "").map((player, idx) => (
                      <SelectItem key={`${player}-${idx}`} value={player} className="text-[#e2e8f0]">
                        {player}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={() => setShowAddPlayer(true)}
                  className="bg-[#064e3b] text-[#6ee7b7] hover:bg-[#065f46] border-[#065f46]"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="New player name"
                  className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                />
                <Button
                  type="button"
                  onClick={handleAddPlayer}
                  className="bg-[#064e3b] text-[#6ee7b7] hover:bg-[#065f46]"
                  size="sm"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddPlayer(false)}
                  variant="ghost"
                  size="sm"
                  className="text-[#94a3b8]"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Age Group */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                {AGE_GROUPS.map(group => (
                  <SelectItem key={group} value={group} className="text-[#e2e8f0]">
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
            />
          </div>
        </div>

        {/* Season */}
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Season</Label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              {SEASONS.map(season => (
                <SelectItem key={season} value={season} className="text-[#e2e8f0]">
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Drill */}
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Drill</Label>
          <Select value={drill} onValueChange={setDrill}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              {drillOptions.map(option => (
                <SelectItem key={option} value={option} className="text-[#e2e8f0]">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reps */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-[11px] text-[#94a3b8]">
              Reps ({metricUnit})
            </Label>
            <Button
              type="button"
              onClick={addRep}
              variant="ghost"
              size="sm"
              className="text-[#38bdf8] h-6 text-[11px]"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Rep
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {reps.map((rep, index) => (
              <div key={index} className="flex gap-1">
                <Input
                  type="number"
                  step="0.1"
                  value={rep}
                  onChange={(e) => updateRep(index, e.target.value)}
                  placeholder={`Rep ${index + 1}`}
                  className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                />
                {reps.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeRep(index)}
                    variant="ghost"
                    size="sm"
                    className="px-2"
                  >
                    <X className="h-3 w-3 text-[#94a3b8]" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Focus points, observations, technique notes..."
            className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] min-h-[80px]"
          />
        </div>

        {/* Outlier Warning */}
        {outlierWarning && (
          <div className="flex flex-col gap-2 bg-[#7f1d1d] border border-[#991b1b] text-[#fca5a5] p-3 rounded">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-[12px] flex-1">{outlierWarning}</span>
            </div>
            <Button
              type="button"
              onClick={() => {
                setOutlierWarning(null);
                setOutlierOverride(true);
              }}
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9] w-full"
              size="sm"
            >
              Override and Submit
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
        >
          Save Entry
        </Button>
      </form>
    </Card>
  );
}
