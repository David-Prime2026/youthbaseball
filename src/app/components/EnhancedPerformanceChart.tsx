import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PerformanceEntry } from '../types/performance';
import { useState } from 'react';
import { Calendar, TrendingUp, Target } from 'lucide-react';

interface EnhancedPerformanceChartProps {
  entries: PerformanceEntry[];
  metricType: string;
  metricUnit: string;
  goalValue?: number;
  onSetGoal?: (value: number) => void;
}

type TimeRange = 'week' | 'month' | 'season' | 'ytd' | 'all';
type ComparisonType = 'none' | 'yoy' | 'sos';

export function EnhancedPerformanceChart({ 
  entries, 
  metricType, 
  metricUnit,
  goalValue,
  onSetGoal,
}: EnhancedPerformanceChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [viewType, setViewType] = useState<'max' | 'avg'>('max');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [comparison, setComparison] = useState<ComparisonType>('none');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [goalInputValue, setGoalInputValue] = useState('');

  // Filter entries by time range
  const getFilteredEntries = () => {
    const now = new Date();
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      
      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return entryDate >= monthAgo;
        
        case 'season':
          // Filter by current season
          const currentSeason = entries[0]?.season || '';
          return entry.season === currentSeason;
        
        case 'ytd':
          const yearStart = new Date(now.getFullYear(), 0, 1);
          return entryDate >= yearStart;
        
        case 'all':
        default:
          return true;
      }
    });

    return filtered;
  };

  // Get comparison data
  const getComparisonData = () => {
    if (comparison === 'none') return null;

    const now = new Date();
    const currentYear = now.getFullYear();

    if (comparison === 'yoy') {
      // Year over Year - get data from same period last year
      return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getFullYear() === currentYear - 1;
      });
    }

    if (comparison === 'sos') {
      // Start of Season - get first entry of current season
      const currentSeason = entries[0]?.season || '';
      const seasonEntries = entries.filter(e => e.season === currentSeason);
      return seasonEntries.length > 0 ? [seasonEntries[seasonEntries.length - 1]] : [];
    }

    return null;
  };

  const filteredEntries = getFilteredEntries();
  const comparisonEntries = getComparisonData();

  // Group entries by date and calculate max/avg
  const processEntries = (entriesToProcess: PerformanceEntry[], label: string = 'value') => {
    return entriesToProcess
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
            label,
          });
        }
        return acc;
      }, [] as Array<{ date: string; max: number; avg: number; drill: string; count: number; label: string }>)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = processEntries(filteredEntries, 'current').map((d, index) => ({
    ...d,
    id: `${d.date}-${index}`,
    dateLabel: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: viewType === 'max' ? d.max : d.avg,
  }));

  const comparisonChartData = comparisonEntries 
    ? processEntries(comparisonEntries, 'comparison').map(d => ({
        value: viewType === 'max' ? d.max : d.avg,
      }))
    : [];

  const handleSetGoal = () => {
    const value = parseFloat(goalInputValue);
    if (!isNaN(value) && value > 0 && onSetGoal) {
      onSetGoal(value);
      setShowGoalInput(false);
      setGoalInputValue('');
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-[#0f172a] border-[#1e293b] p-6">
        <p className="text-[#64748b] text-center py-8">No data to display. Add entries to see charts.</p>
      </Card>
    );
  }

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8] mb-1">Performance Trends</h3>
            <p className="text-[11px] text-[#94a3b8]">{metricType} over time</p>
          </div>
          <TrendingUp className="h-5 w-5 text-[#38bdf8] opacity-50" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          {/* Chart Type */}
          <div>
            <Label className="text-[10px] text-[#94a3b8] mb-1 block">Chart</Label>
            <Select value={chartType} onValueChange={(v) => setChartType(v as 'line' | 'bar')}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="line" className="text-[#e2e8f0] text-[11px]">Line</SelectItem>
                <SelectItem value="bar" className="text-[#e2e8f0] text-[11px]">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Type */}
          <div>
            <Label className="text-[10px] text-[#94a3b8] mb-1 block">View</Label>
            <Select value={viewType} onValueChange={(v) => setViewType(v as 'max' | 'avg')}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="max" className="text-[#e2e8f0] text-[11px]">Max</SelectItem>
                <SelectItem value="avg" className="text-[#e2e8f0] text-[11px]">Average</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div>
            <Label className="text-[10px] text-[#94a3b8] mb-1 block">Period</Label>
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="week" className="text-[#e2e8f0] text-[11px]">Week</SelectItem>
                <SelectItem value="month" className="text-[#e2e8f0] text-[11px]">Month</SelectItem>
                <SelectItem value="season" className="text-[#e2e8f0] text-[11px]">Season</SelectItem>
                <SelectItem value="ytd" className="text-[#e2e8f0] text-[11px]">YTD</SelectItem>
                <SelectItem value="all" className="text-[#e2e8f0] text-[11px]">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comparison */}
          <div>
            <Label className="text-[10px] text-[#94a3b8] mb-1 block">Compare</Label>
            <Select value={comparison} onValueChange={(v) => setComparison(v as ComparisonType)}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="none" className="text-[#e2e8f0] text-[11px]">None</SelectItem>
                <SelectItem value="yoy" className="text-[#e2e8f0] text-[11px]">Year/Year</SelectItem>
                <SelectItem value="sos" className="text-[#e2e8f0] text-[11px]">Start/Season</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal Setting */}
          <div className="col-span-2">
            <Label className="text-[10px] text-[#94a3b8] mb-1 block">Goal ({metricUnit})</Label>
            {!showGoalInput ? (
              <Button
                onClick={() => setShowGoalInput(true)}
                variant="outline"
                size="sm"
                className="w-full h-8 text-[11px] bg-[#1e293b] border-[#334155] text-[#e2e8f0] hover:bg-[#334155]"
              >
                <Target className="h-3 w-3 mr-1" />
                {goalValue ? `${goalValue} ${metricUnit}` : 'Set Goal'}
              </Button>
            ) : (
              <div className="flex gap-1">
                <Input
                  type="number"
                  step="0.1"
                  value={goalInputValue}
                  onChange={(e) => setGoalInputValue(e.target.value)}
                  placeholder="Goal"
                  className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]"
                />
                <Button
                  onClick={handleSetGoal}
                  size="sm"
                  className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9] h-8 px-2 text-[11px]"
                >
                  Set
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="dateLabel" 
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: metricUnit, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid #334155',
              borderRadius: '6px',
              fontSize: '11px'
            }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px' }}
          />
          
          {/* Goal Reference Line */}
          {goalValue && (
            <ReferenceLine 
              y={goalValue} 
              stroke="#10b981" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: `Goal: ${goalValue}`, 
                fill: '#10b981', 
                fontSize: 11,
                position: 'right'
              }}
            />
          )}

          <DataComponent
            type="monotone"
            dataKey="value"
            stroke="#38bdf8"
            fill="#38bdf8"
            strokeWidth={2}
            name={`${viewType === 'max' ? 'Max' : 'Avg'} ${metricType}`}
          />
          
          {/* Comparison Line for YoY or SoS */}
          {comparison !== 'none' && comparisonChartData.length > 0 && (
            <ReferenceLine 
              y={comparisonChartData[0]?.value} 
              stroke="#f59e0b" 
              strokeDasharray="3 3"
              label={{ 
                value: comparison === 'yoy' ? 'Last Year' : 'Season Start', 
                fill: '#f59e0b', 
                fontSize: 11,
                position: 'left'
              }}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#1e293b]">
        <div className="bg-[#1e293b] p-2 rounded">
          <p className="text-[10px] text-[#94a3b8] mb-1">Current {viewType === 'max' ? 'Best' : 'Avg'}</p>
          <p className="text-[14px] font-medium text-[#38bdf8]">
            {chartData.length > 0 ? chartData[chartData.length - 1].value.toFixed(1) : '0'} {metricUnit}
          </p>
        </div>
        
        <div className="bg-[#1e293b] p-2 rounded">
          <p className="text-[10px] text-[#94a3b8] mb-1">All-Time Best</p>
          <p className="text-[14px] font-medium text-[#10b981]">
            {chartData.length > 0 ? Math.max(...chartData.map(d => d.value)).toFixed(1) : '0'} {metricUnit}
          </p>
        </div>
        
        <div className="bg-[#1e293b] p-2 rounded">
          <p className="text-[10px] text-[#94a3b8] mb-1">Sessions</p>
          <p className="text-[14px] font-medium text-[#e2e8f0]">
            {chartData.length}
          </p>
        </div>
        
        <div className="bg-[#1e293b] p-2 rounded">
          <p className="text-[10px] text-[#94a3b8] mb-1">Progress vs Goal</p>
          <p className={`text-[14px] font-medium ${
            goalValue && chartData.length > 0 && chartData[chartData.length - 1].value >= goalValue
              ? 'text-[#10b981]'
              : 'text-[#f59e0b]'
          }`}>
            {goalValue && chartData.length > 0
              ? `${((chartData[chartData.length - 1].value / goalValue) * 100).toFixed(0)}%`
              : 'No Goal'}
          </p>
        </div>
      </div>
    </Card>
  );
}
