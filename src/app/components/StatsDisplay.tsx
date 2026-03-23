import { Card } from './ui/card';
import { PerformanceEntry } from '../types/performance';
import { BenchmarkData } from '../types/performance';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

interface StatsDisplayProps {
  entries: PerformanceEntry[];
  metricType: string;
  metricUnit: string;
  benchmarks?: BenchmarkData[];
  ageGroup: string;
}

export function StatsDisplay({ entries, metricType, metricUnit, benchmarks, ageGroup }: StatsDisplayProps) {
  if (entries.length === 0) {
    return null;
  }

  const allReps = entries.flatMap(e => e.reps).filter(r => r > 0);
  const personalRecord = Math.max(...allReps);
  const average = allReps.reduce((a, b) => a + b, 0) / allReps.length;
  const recentAvg = entries
    .slice(0, 5)
    .flatMap(e => e.reps)
    .reduce((a, b) => a + b, 0) / Math.min(entries.length * 3, 15);

  // Find benchmark for this age group and metric
  const benchmark = benchmarks?.find(
    b => b.ageGroup === ageGroup && b.metricType === metricType
  );

  const getPerformanceLevel = (value: number) => {
    if (!benchmark) return null;
    if (value >= benchmark.elite) return 'Elite';
    if (value >= benchmark.average) return 'Above Average';
    return 'Below Average';
  };

  const performanceLevel = getPerformanceLevel(average);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Personal Record */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-[#94a3b8] mb-1">Personal Record</p>
            <p className="text-[20px] font-bold text-[#38bdf8]">
              {personalRecord.toFixed(1)}
              <span className="text-[12px] text-[#64748b] ml-1">{metricUnit}</span>
            </p>
          </div>
          <Award className="h-5 w-5 text-[#fbbf24]" />
        </div>
      </Card>

      {/* Average */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-[#94a3b8] mb-1">Overall Average</p>
            <p className="text-[20px] font-bold text-[#e2e8f0]">
              {average.toFixed(1)}
              <span className="text-[12px] text-[#64748b] ml-1">{metricUnit}</span>
            </p>
          </div>
          <BarChart3 className="h-5 w-5 text-[#38bdf8]" />
        </div>
      </Card>

      {/* Recent Average */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-[#94a3b8] mb-1">Recent Avg (Last 5)</p>
            <p className="text-[20px] font-bold text-[#e2e8f0]">
              {recentAvg.toFixed(1)}
              <span className="text-[12px] text-[#64748b] ml-1">{metricUnit}</span>
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-[#6ee7b7]" />
        </div>
      </Card>

      {/* Performance Level */}
      <Card className="bg-[#0f172a] border-[#1e293b] p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-[#94a3b8] mb-1">Level ({ageGroup})</p>
            {performanceLevel ? (
              <>
                <p className={`text-[14px] font-bold ${
                  performanceLevel === 'Elite' ? 'text-[#fbbf24]' :
                  performanceLevel === 'Above Average' ? 'text-[#6ee7b7]' :
                  'text-[#94a3b8]'
                }`}>
                  {performanceLevel}
                </p>
                {benchmark && (
                  <p className="text-[10px] text-[#64748b] mt-1">
                    Avg: {benchmark.average} | Elite: {benchmark.elite}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[14px] text-[#64748b]">No benchmark</p>
            )}
          </div>
          <Target className="h-5 w-5 text-[#a78bfa]" />
        </div>
      </Card>
    </div>
  );
}
