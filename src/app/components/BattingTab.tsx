import { useState } from 'react';
import { usePerformanceData } from '../hooks/usePerformanceData';
import { useGoals } from '../hooks/useGoals';
import { usePlayerData } from '../hooks/usePlayerData';
import { DataEntryForm } from './DataEntryForm';
import { EnhancedPerformanceChart } from './EnhancedPerformanceChart';
import { StatsDisplay } from './StatsDisplay';
import { HistoryTable } from './HistoryTable';
import { GoalsSection } from './GoalsSection';
import { DRILL_OPTIONS, BATTING_BENCHMARKS } from '../data/benchmarks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Upload } from 'lucide-react';
import { AGE_GROUPS } from '../types/player';
import { parsePerformanceCSV, convertToPerformanceEntries } from '../utils/performanceCsvParser';

export function BattingTab() {
  const { entries, players, addEntry, addEntries, deleteEntry, addPlayer } = usePerformanceData('batting');
  const { players: allPlayers, addPlayer: addPlayerToDatabase } = usePlayerData();
  const { getGoal, setGoal } = useGoals();
  const [selectedMetric, setSelectedMetric] = useState('Exit Velocity');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('12U');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all');
  const [importing, setImporting] = useState(false);

  const metricUnits: Record<string, string> = {
    'Exit Velocity': 'mph',
    'Bat Speed': 'mph',
    'Launch Angle': '°',
    'Put-in-Play %': '%',
  };

  const filteredEntries = entries.filter(
    e => e.metricType === selectedMetric && e.ageGroup === selectedAgeGroup
  );

  const handleSubmit = (data: any) => {
    addEntry({
      ...data,
      category: 'batting',
    });
  };
  
  const handleAddPlayer = (playerName: string) => {
    // Add to the Player database
    addPlayerToDatabase({
      name: playerName,
      dateOfBirth: '',
      ageGroup: selectedAgeGroup,
      positions: [],
      throwingHand: 'Right',
      battingHand: 'Right',
      isAmbidextrous: false,
    });
    // Update local state
    addPlayer(playerName);
  };

  const allReps = filteredEntries.flatMap(e => e.reps).filter(r => r > 0);
  const personalRecord = allReps.length > 0 ? Math.max(...allReps) : 0;
  const average = allReps.length > 0 
    ? allReps.reduce((a, b) => a + b, 0) / allReps.length 
    : 0;

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      console.log('=== BATTING CSV IMPORT START ===');
      
      const csvRows = parsePerformanceCSV(text, 'Batting');
      console.log('Parsed CSV rows:', csvRows.length);
      
      const performanceEntries = convertToPerformanceEntries(
        csvRows,
        'Batting',
        allPlayers.map(p => ({ id: p.id, name: p.name }))
      );
      
      console.log('Converted to performance entries:', performanceEntries.length);
      
      // Add all entries in a batch to prevent race conditions
      console.log('Adding entries in batch...');
      addEntries(performanceEntries);
      console.log('Batch add complete. Total entries now:', entries.length + performanceEntries.length);
      
      alert(`✅ Successfully imported ${performanceEntries.length} drill entries!`);
      console.log('=== BATTING CSV IMPORT COMPLETE ===');
    } catch (error) {
      console.error('Error importing CSV:', error);
      alert(`Error importing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* CSV Import Card */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-medium text-[#38bdf8] mb-1">Import Drill Data</h3>
            <p className="text-[10px] text-[#94a3b8]">
              CSV Format: Player Name, Date, Drill Type, Metric Type, Rep 1, Rep 2, Rep 3, Notes
            </p>
          </div>
          <div>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileImport}
              disabled={importing}
              className="hidden"
              id="batting-csv-import"
            />
            <Button
              onClick={() => document.getElementById('batting-csv-import')?.click()}
              disabled={importing}
              size="sm"
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import CSV'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Metric Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-[11px] text-[#94a3b8] mb-2 block">Metric Type</Label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              <SelectItem value="Exit Velocity" className="text-[#e2e8f0]">Exit Velocity</SelectItem>
              <SelectItem value="Bat Speed" className="text-[#e2e8f0]">Bat Speed</SelectItem>
              <SelectItem value="Launch Angle" className="text-[#e2e8f0]">Launch Angle</SelectItem>
              <SelectItem value="Put-in-Play %" className="text-[#e2e8f0]">Put-in-Play %</SelectItem>
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
                <SelectItem key={group} value={group} className="text-[#e2e8f0]">
                  {group}
                </SelectItem>
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
        benchmarks={BATTING_BENCHMARKS}
        ageGroup={selectedAgeGroup}
      />

      {/* Goals Section */}
      <GoalsSection
        category="batting"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        currentValue={average}
        personalRecord={personalRecord}
      />

      {/* Data Entry Form */}
      <DataEntryForm
        category="batting"
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        drillOptions={DRILL_OPTIONS.batting}
        players={players}
        existingEntries={filteredEntries}
        onSubmit={handleSubmit}
        onAddPlayer={handleAddPlayer}
      />

      {/* Performance Chart */}
      <EnhancedPerformanceChart
        entries={filteredEntries}
        metricType={selectedMetric}
        metricUnit={metricUnits[selectedMetric]}
        goalValue={getGoal('all', `batting-${selectedMetric}-${selectedAgeGroup}`)}
        onSetGoal={(value) => setGoal('all', `batting-${selectedMetric}-${selectedAgeGroup}`, value)}
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