import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PerformanceEntry } from '../types/performance';
import { useState } from 'react';

interface PerformanceChartProps {
  entries: PerformanceEntry[];
  metricType: string;
  metricUnit: string;
}

export function PerformanceChart({ entries, metricType, metricUnit }: PerformanceChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [viewType, setViewType] = useState<'max' | 'avg'>('max');

  // Group entries by date and calculate max/avg
  const chartData = entries
    .reduce((acc, entry) => {
      const existing = acc.find(d => d.date === entry.date);
      const maxRep = Math.max(...entry.reps);
      const avgRep = entry.reps.reduce((a, b) => a + b, 0) / entry.reps.length;

      if (existing) {
        existing.max = Math.max(existing.max, maxRep);
        existing.avg = (existing.avg + avgRep) / 2;
        existing.count += 1;
      } else {
        acc.push({
          date: entry.date,
          max: maxRep,
          avg: avgRep,
          drill: entry.drill,
          count: 1,
        });
      }
      return acc;
    }, [] as Array<{ date: string; max: number; avg: number; drill: string; count: number }>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((d, index) => ({
      ...d,
      id: `${d.date}-${index}`,
      dateLabel: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

  if (entries.length === 0) {
    return (
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <p className="text-[#64748b] text-center py-8">No data to display. Add entries to see charts.</p>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e293b] border border-[#334155] p-3 rounded-md">
          <p className="text-[#e2e8f0] text-[12px] font-medium">{payload[0].payload.dateLabel}</p>
          <p className="text-[#38bdf8] text-[11px]">
            {viewType === 'max' ? 'Top' : 'Avg'}: {payload[0].value.toFixed(1)} {metricUnit}
          </p>
          <p className="text-[#94a3b8] text-[11px]">{payload[0].payload.drill}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[14px] font-medium text-[#38bdf8]">Performance Visualization</h3>
          <p className="text-[11px] text-[#94a3b8]">{metricType} over time</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewType} onValueChange={(v) => setViewType(v as 'max' | 'avg')}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              <SelectItem value="max" className="text-[#e2e8f0]">Top Values</SelectItem>
              <SelectItem value="avg" className="text-[#e2e8f0]">Averages</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={(v) => setChartType(v as 'line' | 'bar')}>
            <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e293b] border-[#334155]">
              <SelectItem value="line" className="text-[#e2e8f0]">Line Chart</SelectItem>
              <SelectItem value="bar" className="text-[#e2e8f0]">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData} key={`line-${metricType}`}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="dateLabel" 
                stroke="#64748b" 
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '11px' }}
                label={{ value: metricUnit, angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '11px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line 
                type="monotone" 
                dataKey={viewType} 
                stroke="#38bdf8" 
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 4 }}
                activeDot={{ r: 6 }}
                name={viewType === 'max' ? 'Top Value' : 'Average'}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} key={`bar-${metricType}`}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="dateLabel" 
                stroke="#64748b" 
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#64748b" 
                style={{ fontSize: '11px' }}
                label={{ value: metricUnit, angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: '11px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar 
                dataKey={viewType} 
                fill="#38bdf8" 
                name={viewType === 'max' ? 'Top Value' : 'Average'}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}