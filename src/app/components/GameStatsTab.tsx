import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGameStats } from '../hooks/useGameStats';
import { usePlayerData } from '../hooks/usePlayerData';
import { parseGameStatsCSV } from '../utils/csvParser';
import { SEASONS } from '../types/gameStats';
import { FileSpreadsheet, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export function GameStatsTab() {
  const { gameStats, addGameStats } = useGameStats();
  const { players } = usePlayerData();
  const [season, setSeason] = useState('Spring 2026');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const parsedStats = parseGameStatsCSV(text, season);

      if (!parsedStats || parsedStats.length === 0) {
        throw new Error('No valid player data found in CSV');
      }

      await addGameStats(parsedStats);

      setImportResult({
        success: true,
        message: parsedStats.length + ' players updated for ' + season + '. Stats are available in player profiles and coaching dashboard.',
      });
    } catch (error) {
      console.error('Error importing CSV:', error);
      setImportResult({
        success: false,
        message: 'Error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  // Get unique players with stats
  const playersWithStats = new Set(gameStats.map(s => s.playerId));
  const totalGames = gameStats.length > 0 ? Math.max(...gameStats.map(s => s.gamesPlayed || 0)) : 0;
  const latestUpload = gameStats.length > 0 ? gameStats.reduce((latest, s) => {
    const d = s.gameDate || s.createdAt || '';
    return d > latest ? d : latest;
  }, '') : '';

  return (
    <div className="space-y-6">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Import Game Statistics</h3>
            <p className="text-[11px] text-[#94a3b8]">Upload CSV files from GameChanger. Stats auto-update — uploading the same season replaces old data.</p>
          </div>
          <FileSpreadsheet className="h-8 w-8 text-[#38bdf8] opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Season</Label>
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                {SEASONS.map(s => (<SelectItem key={s} value={s} className="text-[#e2e8f0]">{s}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Upload CSV File</Label>
            <Input type="file" accept=".csv" onChange={handleFileUpload} disabled={importing} className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[11px] file:bg-[#38bdf8] file:text-[#0a0f1a] hover:file:bg-[#0ea5e9] file:cursor-pointer cursor-pointer" />
            <p className="text-[10px] text-[#64748b] mt-1">GameChanger CSV format: Number, Last, First, GP, PA, AB, AVG...</p>
          </div>
        </div>

        {importing && (
          <div className="bg-[#1e293b] p-4 rounded text-center">
            <Upload className="h-6 w-6 text-[#38bdf8] mx-auto mb-2 animate-pulse" />
            <p className="text-[11px] text-[#94a3b8]">Importing and matching players...</p>
          </div>
        )}

        {importResult && (
          <div className={'p-4 rounded flex items-start gap-3 ' + (importResult.success ? 'bg-[#064e3b] border border-[#065f46]' : 'bg-[#7c2d12] border border-[#9a3412]')}>
            {importResult.success ? <CheckCircle className="h-5 w-5 text-[#10b981] flex-shrink-0" /> : <AlertCircle className="h-5 w-5 text-[#ef4444] flex-shrink-0" />}
            <p className={'text-[12px] ' + (importResult.success ? 'text-[#6ee7b7]' : 'text-[#fca5a5]')}>{importResult.message}</p>
          </div>
        )}
      </Card>

      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <h3 className="text-[14px] font-medium text-[#38bdf8] mb-4">Import Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] p-4 rounded text-center">
            <div className="text-[10px] text-[#64748b] mb-1">Players Tracked</div>
            <div className="text-[20px] font-semibold text-[#38bdf8]">{playersWithStats.size}</div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded text-center">
            <div className="text-[10px] text-[#64748b] mb-1">Games Played</div>
            <div className="text-[20px] font-semibold text-[#10b981]">{totalGames}</div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded text-center">
            <div className="text-[10px] text-[#64748b] mb-1">Seasons</div>
            <div className="text-[20px] font-semibold text-[#f59e0b]">{new Set(gameStats.map(s => s.season)).size}</div>
          </div>
          <div className="bg-[#1e293b] p-4 rounded text-center">
            <div className="text-[10px] text-[#64748b] mb-1">Last Updated</div>
            <div className="text-[14px] font-semibold text-[#e2e8f0]">{latestUpload || 'Never'}</div>
          </div>
        </div>
        <p className="text-[10px] text-[#64748b] mt-4 text-center">View player stats in individual player profiles or the Coaching dashboard</p>
      </Card>
    </div>
  );
}
