import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { supabase } from '../../supabaseClient';
import { Dumbbell, Loader2, Target } from 'lucide-react';
import { EXERCISE_CATEGORIES } from '../data/exerciseCategories';

interface TrainingPlanProps {
  playerName?: string;
  playerId?: string;
  gameStats?: any[];
  performanceData?: any[];
  observations?: any[];
  mode: 'player' | 'team';
}

export function TrainingPlan({ playerName, playerId, gameStats = [], performanceData = [], observations = [], mode }: TrainingPlanProps) {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const exerciseMap = EXERCISE_CATEGORIES.map(cat => ({
        name: cat.name,
        exercises: cat.exercises,
        developsMetrics: cat.linkedMetrics,
        description: cat.description,
      }));

      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          performanceData: performanceData.slice(0, 20),
          gameStats: gameStats.slice(0, 15),
          playerName: playerName || 'Team',
          category: 'Training Plan',
          trainingPlanRequest: true,
          exerciseCategories: exerciseMap,
          observations: observations.slice(0, 10),
        },
      });

      if (error) throw error;
      if (data?.insights && Array.isArray(data.insights)) {
        setPlan(data.insights);
      }
    } catch (error) {
      console.error('Training plan error:', error);
      setPlan([{ type: 'neutral', title: 'Plan Unavailable', description: 'Could not generate training plan. Try again.' }]);
    } finally {
      setLoading(false);
      setGenerated(true);
    }
  };

  const colors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]' },
  };

  return (
    <Card className="bg-gradient-to-br from-[#10b981]/10 to-[#059669]/5 border-[#10b981]/30 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-[#10b981]" />
          <div>
            <h3 className="text-[13px] font-semibold text-[#10b981]">AI Development Plan</h3>
            <p className="text-[10px] text-[#94a3b8]">{mode === 'player' ? 'Personalized for ' + (playerName || 'player') : 'Team-wide development focus'}</p>
          </div>
        </div>
        <Button onClick={generatePlan} disabled={loading} size="sm" className="bg-[#10b981] text-white hover:bg-[#059669]">
          {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Building Plan...</>) : generated ? 'Refresh Plan' : 'Generate Plan'}
        </Button>
      </div>

      {!generated && !loading && (
        <div className="text-center py-4">
          <Target className="h-6 w-6 text-[#334155] mx-auto mb-2" />
          <p className="text-[11px] text-[#64748b]">Generate an AI-powered training plan based on game stats, training data, and coach observations</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {EXERCISE_CATEGORIES.map(cat => (
              <span key={cat.name} className="text-[9px] bg-[#1e293b] text-[#94a3b8] px-2 py-1 rounded">{cat.name} → {cat.linkedMetrics.slice(0, 2).join(', ')}</span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-6"><Loader2 className="h-6 w-6 text-[#10b981] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Analyzing data and building training plan...</p></div>
      )}

      {generated && !loading && (
        <div className="space-y-2">
          {plan.map((item, i) => {
            const style = colors[item.type] || colors.neutral;
            return (
              <div key={i} className={style.bg + ' ' + style.border + ' border p-3 rounded-lg'}>
                <h4 className={'text-[12px] font-medium ' + style.text + ' mb-1'}>{item.title}</h4>
                <p className="text-[11px] text-[#94a3b8]">{item.description}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
