import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { supabase } from '../../supabaseClient';
import { ClipboardList, Loader2, ChevronDown, ChevronUp, Check, Save } from 'lucide-react';
import { EXERCISE_CATEGORIES } from '../data/exerciseCategories';

interface PracticePlannerProps {
  gameStats: any[];
  performanceData: any[];
  players: any[];
}

export function PracticePlanner({ gameStats, performanceData, players }: PracticePlannerProps) {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [day, setDay] = useState('Monday');
  const [focus, setFocus] = useState('balanced');
  const [completedBlocks, setCompletedBlocks] = useState<Set<number>>(new Set());
  const [coachNotes, setCoachNotes] = useState('');
  const [effortRating, setEffortRating] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    setSaved(false);
    setCompletedBlocks(new Set());
    setCoachNotes('');
    setEffortRating('');
    try {
      if (gameStats.length === 0) {
        setPlan([{ type: 'warning', title: 'No Data Available', description: 'Game stats have not loaded yet. Please wait a moment and try again, or make sure you have imported game stats on the Game Stats tab.' }]);
        setLoading(false);
        return;
      }
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

  const toggleBlock = (idx: number) => {
    const next = new Set(completedBlocks);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setCompletedBlocks(next);
  };

  const savePracticeLog = async () => {
    setSaving(true);
    try {
      await supabase.from('practice_logs').insert([{
        practice_date: new Date().toISOString().split('T')[0],
        day_type: day,
        focus: focus,
        plan_data: plan,
        completed_blocks: Array.from(completedBlocks).map(idx => ({ index: idx, title: plan[idx]?.title || '', completed: true })),
        coach_notes: coachNotes || null,
        effort_rating: effortRating ? parseInt(effortRating) : null,
      }]);
      setSaved(true);
    } catch (err) {
      console.error('Error saving practice log:', err);
    } finally { setSaving(false); }
  };

  return (
    <Card className="bg-[#0f172a] border-[#f59e0b]/30 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => plan.length > 0 && setCollapsed(!collapsed)} className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#f59e0b]" />
          <div className="text-left">
            <h3 className="text-[13px] font-semibold text-[#f59e0b]">AI Practice Planner</h3>
            <p className="text-[10px] text-[#94a3b8]">Structured 2-hour practice with exercise grouping</p>
          </div>
          {plan.length > 0 && (collapsed ? <ChevronDown className="h-4 w-4 text-[#64748b] ml-1" /> : <ChevronUp className="h-4 w-4 text-[#64748b] ml-1" />)}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="flex gap-3 mb-3 flex-wrap">
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
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Planning...</> : plan.length > 0 ? 'Regenerate' : 'Build Plan'}
            </Button>
          </div>

          {loading && <div className="text-center py-4"><Loader2 className="h-6 w-6 text-[#f59e0b] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Building {day} practice plan...</p></div>}

          {plan.length === 0 && !loading && (
            <div className="text-center py-3"><p className="text-[11px] text-[#64748b]">Select a day and focus, then click Build Plan.</p></div>
          )}

          {plan.length > 0 && !loading && (
            <>
              <div className="space-y-2 mb-4">
                {plan.map((item: any, i: number) => {
                  const done = completedBlocks.has(i);
                  return (
                    <div key={i} onClick={() => toggleBlock(i)} className={'p-4 rounded-lg border cursor-pointer transition-all ' + (done ? 'bg-[#064e3b] border-[#065f46]' : 'bg-white border-[#e5e7eb]')}>
                      <div className="flex items-start gap-3">
                        <div className={'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ' + (done ? 'bg-[#10b981] border-[#10b981]' : 'border-[#94a3b8]')}>
                          {done && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={'text-[12px] font-semibold mb-1 ' + (done ? 'text-[#6ee7b7] line-through' : 'text-[#0f172a]')}>{item.title}</h4>
                          <p className={'text-[11px] leading-relaxed ' + (done ? 'text-[#94a3b8]' : 'text-[#374151]')}>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#1e293b] p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[12px] font-medium text-[#38bdf8]">Practice Log</h4>
                  <span className="text-[10px] text-[#64748b]">{completedBlocks.size}/{plan.length} blocks completed</span>
                </div>
                <div className="flex gap-3">
                  <Select value={effortRating} onValueChange={setEffortRating}>
                    <SelectTrigger className="bg-[#0f172a] border-[#334155] text-[#e2e8f0] h-8 w-[160px] text-[11px]"><SelectValue placeholder="Team Effort..." /></SelectTrigger>
                    <SelectContent className="bg-[#1e293b] border-[#334155]">
                      <SelectItem value="5" className="text-[#e2e8f0]">5 - Outstanding</SelectItem>
                      <SelectItem value="4" className="text-[#e2e8f0]">4 - Good</SelectItem>
                      <SelectItem value="3" className="text-[#e2e8f0]">3 - Average</SelectItem>
                      <SelectItem value="2" className="text-[#e2e8f0]">2 - Low Energy</SelectItem>
                      <SelectItem value="1" className="text-[#e2e8f0]">1 - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea value={coachNotes} onChange={(e) => setCoachNotes(e.target.value)} placeholder="Practice notes - what went well, what to adjust next time..." className="bg-[#0f172a] border-[#334155] text-[#e2e8f0] min-h-[60px] text-[11px]" />
                <Button onClick={savePracticeLog} disabled={saving || saved} size="sm" className={saved ? 'w-full bg-[#10b981] text-white' : 'w-full bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]'}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : saved ? <><Check className="h-4 w-4 mr-2" />Practice Logged</> : <><Save className="h-4 w-4 mr-2" />Save Practice Log</>}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}

