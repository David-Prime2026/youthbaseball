import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Target, TrendingUp } from 'lucide-react';

interface Goal {
  metricType: string;
  target: number;
  deadline: string;
}

interface GoalsSectionProps {
  category: string;
  metricType: string;
  metricUnit: string;
  currentValue: number;
  personalRecord: number;
}

export function GoalsSection({ category, metricType, metricUnit, currentValue, personalRecord }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`premier-select-goals-${category}`);
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, [category]);

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals);
    localStorage.setItem(`premier-select-goals-${category}`, JSON.stringify(newGoals));
  };

  const addGoal = () => {
    if (!targetValue || !deadline) {
      alert('Please enter both target value and deadline');
      return;
    }

    const newGoal: Goal = {
      metricType,
      target: parseFloat(targetValue),
      deadline,
    };

    saveGoals([...goals, newGoal]);
    setTargetValue('');
    setDeadline('');
  };

  const removeGoal = (index: number) => {
    saveGoals(goals.filter((_, i) => i !== index));
  };

  const currentGoal = goals.find(g => g.metricType === metricType);
  const progress = currentGoal 
    ? Math.min(100, (personalRecord / currentGoal.target) * 100)
    : 0;

  const daysUntilDeadline = currentGoal
    ? Math.ceil((new Date(currentGoal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="mb-4">
        <h3 className="text-[14px] font-medium text-[#38bdf8] flex items-center gap-2">
          <Target className="h-4 w-4" />
          Goals & Targets
        </h3>
        <p className="text-[11px] text-[#94a3b8]">Set and track performance goals</p>
      </div>

      {/* Current Goal Progress */}
      {currentGoal && (
        <div className="mb-6 p-4 bg-[rgba(30,41,59,0.4)] border border-[#1e293b] rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[13px] font-medium text-[#e2e8f0] mb-1">
                Current Goal: {currentGoal.target} {metricUnit}
              </p>
              <p className="text-[11px] text-[#64748b]">
                Deadline: {new Date(currentGoal.deadline).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
                <span className={`ml-2 ${daysUntilDeadline < 7 ? 'text-[#fca5a5]' : 'text-[#94a3b8]'}`}>
                  ({daysUntilDeadline} days left)
                </span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeGoal(goals.findIndex(g => g.metricType === metricType))}
              className="text-[#fca5a5] hover:bg-[#7f1d1d]/20 h-7"
            >
              Remove
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#94a3b8]">Current PR: {personalRecord.toFixed(1)} {metricUnit}</span>
              <span className="text-[#38bdf8] font-medium">{progress.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
              <TrendingUp className="h-3 w-3" />
              <span>
                {currentGoal.target - personalRecord > 0 
                  ? `${(currentGoal.target - personalRecord).toFixed(1)} ${metricUnit} to goal`
                  : 'Goal achieved! 🎉'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add New Goal */}
      {!currentGoal && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">
                Target {metricType} ({metricUnit})
              </Label>
              <Input
                type="number"
                step="0.1"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={`e.g., ${(personalRecord * 1.1).toFixed(0)}`}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
              />
            </div>
            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
              />
            </div>
          </div>

          <Button
            onClick={addGoal}
            className="w-full bg-[#7c3aed] text-[#e9d5ff] hover:bg-[#6d28d9] border-[#7c3aed]"
          >
            <Target className="mr-2 h-4 w-4" />
            Set Goal
          </Button>

          {personalRecord > 0 && (
            <div className="p-3 bg-[rgba(30,41,59,0.4)] border border-[#1e293b] rounded-lg">
              <p className="text-[11px] text-[#94a3b8] mb-2">Suggested Goals:</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTargetValue((personalRecord * 1.05).toFixed(1))}
                  className="text-[#38bdf8] text-[11px] h-7"
                >
                  +5% ({(personalRecord * 1.05).toFixed(1)})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTargetValue((personalRecord * 1.1).toFixed(1))}
                  className="text-[#38bdf8] text-[11px] h-7"
                >
                  +10% ({(personalRecord * 1.1).toFixed(1)})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTargetValue((personalRecord * 1.15).toFixed(1))}
                  className="text-[#38bdf8] text-[11px] h-7"
                >
                  +15% ({(personalRecord * 1.15).toFixed(1)})
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
