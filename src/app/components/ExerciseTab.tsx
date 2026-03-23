import { useState } from 'react';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePlayerData } from '../hooks/usePlayerData';
import { DataEntryForm } from './DataEntryForm';
import { PerformanceChart } from './PerformanceChart';
import { StatsDisplay } from './StatsDisplay';
import { GoalsSection } from './GoalsSection';
import { HistoryTable } from './HistoryTable';
import { DRILL_OPTIONS, EXERCISE_BENCHMARKS } from '../data/benchmarks';
import { AGE_GROUPS } from '../types/player';

export function ExerciseTab() {
  const { entries, players, addEntry, deleteEntry, addPlayer } = usePerformanceData('exercise');
  const { addPlayer: addPlayerToDatabase } = usePlayerData();
  const [selectedMetric, setSelectedMetric] = useState('Push-ups');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('12U');

  const metricUnits: Record<string, string> = {
    'Push-ups': 'reps',
    'Pull-ups': 'reps',
    'Plank Hold': 's',
    'Med Ball Rotational Throw': 'ft',
    'Med Ball Chest Pass': 'ft',
    'Med Ball Overhead Slam': 'reps',
    'Single Leg RDL': 'reps',
    'Goblet Squat': 'reps',
    'Lateral Lunge': 'reps',
    'Box Jumps': 'in',
    'Hurdle Hops': 'reps',
  };

  const filteredEntries = entries.filter(
    e => e.metricType === selectedMetric && e.ageGroup === selectedAgeGroup
  );

  const handleSubmit = (data: any) => {
    addEntry({
      ...data,
      category: 'exercise',
    });
  };
  
  const handleAddPlayer = (playerName: string) => {
    addPlayerToDatabase({
      name: playerName,
      dateOfBirth: '',
      ageGroup: selectedAgeGroup,
      positions: [],
      throwingHand: 'Right',
      battingHand: 'Right',
      isAmbidextrous: false,
    });
    addPlayer(playerName);
  };

  const allReps = filteredEntries.flatMap(e => e.reps).filter(r => r > 0);
  const personalRecord = allReps.length > 0 ? Math.max(...allReps) : 0;
  const average = allReps.length > 0 
    ? allReps.reduce((a, b) => a + b, 0) / allReps.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Exercise Type</Label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              {DRILL_OPTIONS.exercise.map(ex => (
                <SelectItem key={ex} value={ex} className="text-[#e2e8f0]">{ex}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Filter by Age Group</Label>
          <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              {AGE_GROUPS.map(group => (
                <SelectItem key={group} value={group} className="text-[#e2e8f0]">{group}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatsDisplay
        entries={filteredEntries}
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric] || 'reps'}
        benchmarks={EXERCISE_BENCHMARKS}
        ageGroup={selectedAgeGroup}
      />

      <GoalsSection
        category="exercise"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric] || 'reps'}
        currentValue={average}
        personalRecord={personalRecord}
      />

      <DataEntryForm
        category="exercise"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric] || 'reps'}
        drillOptions={DRILL_OPTIONS.exercise}
        players={players}
        onSubmit={handleSubmit}
        onAddPlayer={handleAddPlayer}
      />

      <PerformanceChart
        entries={filteredEntries}
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric] || 'reps'}
      />

      <HistoryTable
        entries={filteredEntries}
        metricUnit={metricUnits[selectedMetric] || 'reps'}
        onDelete={deleteEntry}
      />
    </div>
  );
}