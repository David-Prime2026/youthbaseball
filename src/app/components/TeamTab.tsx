import { Card } from './ui/card';
import { Button } from './ui/button';
import { Users, TrendingUp } from 'lucide-react';

export function TeamTab() {
  return (
    <div className="space-y-6">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Command Center
            </h3>
            <p className="text-[11px] text-[#94a3b8]">Team analytics, rankings, and benchmarks</p>
          </div>
          <Button className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]">
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        <div className="py-12 text-center">
          <p className="text-[#64748b] mb-2">Team analytics dashboard coming in next update</p>
          <p className="text-[#94a3b8] text-[12px]">
            Features: Player rankings, team growth charts, benchmark tracking, pivot tables
          </p>
        </div>
      </Card>
    </div>
  );
}
