import { useState } from 'react';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { usePlayerData } from '../hooks/usePlayerData';
import { DataEntryForm } from './DataEntryForm';
import { PerformanceChart } from './PerformanceChart';
import { StatsDisplay } from './StatsDisplay';
import { HistoryTable } from './HistoryTable';
import { GoalsSection } from './GoalsSection';
import { DRILL_OPTIONS, PITCHING_BENCHMARKS } from '../data/benchmarks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { AGE_GROUPS } from '../types/player';

export function PitchingTab() {
  const { entries, players, addEntry, deleteEntry, addPlayer } = usePerformanceData('pitching');
  const { addPlayer: addPlayerToDatabase } = usePlayerData();
  const [selectedMetric, setSelectedMetric] = useState('Throwing Velocity');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('12U');

  const metricUnits: Record<string, string> = {
    'Throwing Velocity': 'mph',
    'Spin Rate': 'rpm',
    'Strike Percentage': '%',
    'Release Consistency': 'in',
  };

  const filteredEntries = entries.filter(
    e => e.metricType === selectedMetric && e.ageGroup === selectedAgeGroup
  );

  const handleSubmit = (data: any) => {
    addEntry({
      ...data,
      category: 'pitching',
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
      {/* Metric Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Metric Type</Label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              <SelectItem value="Throwing Velocity" className="text-[#e2e8f0]">Throwing Velocity</SelectItem>
              <SelectItem value="Spin Rate" className="text-[#e2e8f0]">Spin Rate</SelectItem>
              <SelectItem value="Strike Percentage" className="text-[#e2e8f0]">Strike Percentage</SelectItem>
              <SelectItem value="Release Consistency" className="text-[#e2e8f0]">Release Consistency</SelectItem>
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

      {/* Stats Display */}
      <StatsDisplay
        entries={filteredEntries}
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        benchmarks={PITCHING_BENCHMARKS}
        ageGroup={selectedAgeGroup}
      />

      {/* Goals Section */}
      <GoalsSection
        category="pitching"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        currentValue={average}
        personalRecord={personalRecord}
      />

      {/* Data Entry Form */}
      <DataEntryForm
        category="pitching"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        drillOptions={DRILL_OPTIONS.pitching}
        players={players}
        onSubmit={handleSubmit}
        onAddPlayer={handleAddPlayer}
      />

      {/* Performance Chart */}
      <PerformanceChart
        entries={filteredEntries}
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
      />

      {/* History Table */}
      <HistoryTable
        entries={filteredEntries}
        metricUnit={metricUnits[selectedMetric]}
        onDelete={deleteEntry}
      />
    </div>
  );
}