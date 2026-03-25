import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../../supabaseClient';
import { ClipboardList, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { EXERCISE_CATEGORIES } from '../data/exerciseCategories';

interface PracticePlannerProps {
  gameStats: any[];
  performanceData: any[];
  players: any[];
}

export function PracticePlanner({ gameStats, performanceData, players }: PracticePlannerProps) {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [day, setDay] = useState('Monday');
  const [focus, setFocus] = useState('balanced');

  const generatePlan = async () => {
    setLoading(true);
    try {
      const pitchers = gameStats.filter(s => s.inningsPitched && s.inningsPitched > 0);
      const topBatters = [...gameStats].sort((a, b) => (b.average || 0) - (a.average || 0)).slice(0, 5);
      const stealCandidates = gameStats.filter(s => s.stolenBases && s.stolenBases > 2);
      const exerciseMap = EXERCISE_CATEGORIES.map(c => ({ name: c.name, exercises: c.exercises, develops: c.linkedMetrics }));

      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          performanceData: [],
          gameStats: [],
          playerName: 'Team',
          category: 'Practice Plan',
          trainingPlanRequest: true,
          exerciseCategories: exerciseMap,
          practicePlan: {
            day: day,
            duration: '2 hours',
            focus: focus,
            pitchers: pitchers.map((p: any) => ({ name: p.firstName + ' ' + p.lastName, ip: p.inningsPitched, era: p.era, pitchCount: p.pitchCount, k: p.strikeoutsPitching, bb: p.walksPitching })),
            topBatters: topBatters.map((p: any) => ({ name: p.firstName + ' ' + p.lastName, avg: p.average, hits: p.hits, k: p.strikeouts, bb: p.walks })),
            stealCandidates: stealCandidates.map((p: any) => ({ name: p.firstName + ' ' + p.lastName, sb: p.stolenBases, cs: p.caughtStealing })),
            teamSize: players.length,
          },
        },
      });

      if (error) throw error;
      if (data?.insights) setPlan(data.insights);
    } catch (err) {
      console.error('Practice plan error:', err);
      setPlan([{ type: 'neutral', title: 'Unavailable', description: 'Could not generate practice plan.' }]);
    } finally { setLoading(false); setCollapsed(false); }
  };

  const colors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]' },
    neutral: { bg: 'bg-[#0f172a]', border: 'border-[#334155]', text: 'text-[#e2e8f0]' },
    goal: { bg: 'bg-[#0f172a]', border: 'border-[#f59e0b]', text: 'text-[#f59e0b]' },
  };

  return (
    <Card className="bg-gradient-to-br from-[#f59e0b]/10 to-[#f97316]/5 border-[#f59e0b]/30 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => plan && setCollapsed(!collapsed)} className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#f59e0b]" />
          <div className="text-left">
            <h3 className="text-[13px] font-semibold text-[#f59e0b]">AI Practice Planner</h3>
            <p className="text-[10px] text-[#94a3b8]">Structured 2-hour practice plan with exercise grouping</p>
          </div>
          {plan && (collapsed ? <ChevronDown className="h-4 w-4 text-[#64748b] ml-1" /> : <ChevronUp className="h-4 w-4 text-[#64748b] ml-1" />)}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="flex gap-3 mb-3">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 w-[140px] text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="Monday" className="text-[#e2e8f0]">Monday</SelectItem>
                <SelectItem value="Wednesday" className="text-[#e2e8f0]">Wednesday</SelectItem>
                <SelectItem value="Pre-Game" className="text-[#e2e8f0]">Pre-Game Day</SelectItem>
                <SelectItem value="Post-Game" className="text-[#e2e8f0]">Post-Game Recovery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={focus} onValueChange={setFocus}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 w-[180px] text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="balanced" className="text-[#e2e8f0]">Balanced</SelectItem>
                <SelectItem value="hitting" className="text-[#e2e8f0]">Hitting Focus</SelectItem>
                <SelectItem value="pitching" className="text-[#e2e8f0]">Pitching/Defense</SelectItem>
                <SelectItem value="situational" className="text-[#e2e8f0]">Situational Play</SelectItem>
                <SelectItem value="speed" className="text-[#e2e8f0]">Speed/Baserunning</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generatePlan} disabled={loading} size="sm" className="bg-[#f59e0b] text-[#0a0f1a] hover:bg-[#d97706]">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Planning...</> : plan ? 'Regenerate' : 'Build Plan'}
            </Button>
          </div>

          {loading && <div className="text-center py-4"><Loader2 className="h-6 w-6 text-[#f59e0b] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Building {day} practice plan...</p></div>}

          {!plan && !loading && (
            <div className="text-center py-3">
              <p className="text-[11px] text-[#64748b]">Select a day and focus, then click Build Plan for a structured 2-hour practice with exercise grouping, pitcher management, and situational drills.</p>
            </div>
          )}

          {plan && !loading && (
            <div className="space-y-2">
              {plan.map((item: any, i: number) => {
                const s = colors[item.type] || colors.neutral;
                return <div key={i} className={s.bg + ' ' + s.border + ' border p-3 rounded-lg'}><h4 className={'text-[12px] font-medium ' + s.text + ' mb-1'}>{item.title}</h4><p className="text-[11px] text-[#94a3b8]">{item.description}</p></div>;
              })}
            </div>
          )}
        </>
      )}
    </Card>
  );
}



