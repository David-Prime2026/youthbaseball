import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { PerformanceEntry } from '../types/performance';
import { Trash2 } from 'lucide-react';

interface HistoryTableProps {
  entries: PerformanceEntry[];
  metricUnit: string;
  onDelete: (id: string) => void;
}

export function HistoryTable({ entries, metricUnit, onDelete }: HistoryTableProps) {
  if (entries.length === 0) {
    return (
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <p className="text-[#64748b] text-center py-8">No entries yet. Start adding performance data!</p>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="mb-4">
        <h3 className="text-[14px] font-medium text-[#38bdf8]">Performance History</h3>
        <p className="text-[11px] text-[#94a3b8]">All recorded sessions</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1e293b] hover:bg-transparent">
              <TableHead className="text-[#38bdf8] text-[13px]">Date</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px]">Player</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px]">Age</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px]">Drill</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px] text-right">Top</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px] text-right">Avg</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px]">Notes</TableHead>
              <TableHead className="text-[#38bdf8] text-[13px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const top = Math.max(...entry.reps);
              const avg = entry.reps.reduce((a, b) => a + b, 0) / entry.reps.length;
              
              return (
                <TableRow key={entry.id} className="border-[#1e293b] hover:bg-[#1e293b]/50">
                  <TableCell className="text-[#cbd5e1] text-[13px]">
                    {new Date(entry.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="text-[#cbd5e1] text-[13px] font-medium">
                    {entry.playerName}
                  </TableCell>
                  <TableCell className="text-[#cbd5e1] text-[13px]">
                    {entry.ageGroup}
                  </TableCell>
                  <TableCell className="text-[#cbd5e1] text-[13px]">
                    {entry.drill}
                  </TableCell>
                  <TableCell className="text-[#38bdf8] text-[13px] text-right font-mono">
                    {top.toFixed(1)} {metricUnit}
                  </TableCell>
                  <TableCell className="text-[#cbd5e1] text-[13px] text-right font-mono">
                    {avg.toFixed(1)} {metricUnit}
                  </TableCell>
                  <TableCell className="text-[#64748b] text-[13px] max-w-[200px] truncate">
                    {entry.notes || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(entry.id)}
                      className="text-[#fca5a5] hover:text-[#dc2626] hover:bg-[#7f1d1d]/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
