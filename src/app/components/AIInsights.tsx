import { Card } from './ui/card';
import { Button } from './ui/button';
import { PerformanceEntry } from '../types/performance';
import { GameStats } from '../types/gameStats';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Target, Award } from 'lucide-react';
import { useState } from 'react';

interface AIInsightsProps {
  performanceEntries: PerformanceEntry[];
  gameStats?: GameStats[];
  playerName?: string;
}

interface Insight {
  type: 'positive' | 'warning' | 'neutral' | 'goal';
  title: string;
  description: string;
  icon: any;
}

export function AIInsights({ performanceEntries, gameStats = [], playerName }: AIInsightsProps) {
  const [showAll, setShowAll] = useState(false);

  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    if (performanceEntries.length === 0) {
      return [{
        type: 'neutral',
        title: 'Start Tracking',
        description: 'Add performance data to receive personalized AI insights and recommendations.',
        icon: Sparkles,
      }];
    }

    // Analyze trends over last 5 entries vs previous 5
    const sortedEntries = [...performanceEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const recent = sortedEntries.slice(0, 5);
    const previous = sortedEntries.slice(5, 10);

    if (recent.length >= 3 && previous.length >= 3) {
      const recentAvg = recent.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / 
        recent.flatMap(e => e.reps).length;
      const previousAvg = previous.flatMap(e => e.reps).reduce((a, b) => a + b, 0) / 
        previous.flatMap(e => e.reps).length;

      const improvement = ((recentAvg - previousAvg) / previousAvg) * 100;

      if (improvement > 5) {
        insights.push({
          type: 'positive',
          title: `${improvement.toFixed(0)}% Performance Improvement`,
          description: `Your recent sessions show significant improvement. You're averaging ${recentAvg.toFixed(1)} compared to ${previousAvg.toFixed(1)} previously. Keep up the great work!`,
          icon: TrendingUp,
        });
      } else if (improvement < -5) {
        insights.push({
          type: 'warning',
          title: `${Math.abs(improvement).toFixed(0)}% Performance Decline`,
          description: `Recent sessions show a dip in performance. Consider reviewing technique, checking for fatigue, or adjusting training intensity.`,
          icon: TrendingDown,
        });
      }
    }

    // Consistency analysis
    const recentReps = recent.flatMap(e => e.reps);
    const stdDev = calculateStdDev(recentReps);
    const mean = recentReps.reduce((a, b) => a + b, 0) / recentReps.length;
    const coefficientOfVariation = (stdDev / mean) * 100;

    if (coefficientOfVariation < 10) {
      insights.push({
        type: 'positive',
        title: 'Excellent Consistency',
        description: `Your performance is highly consistent with minimal variation. This indicates strong muscle memory and technique.`,
        icon: Award,
      });
    } else if (coefficientOfVariation > 25) {
      insights.push({
        type: 'warning',
        title: 'Inconsistent Results',
        description: `High variation in performance detected. Focus on form and technique fundamentals to build consistency.`,
        icon: AlertCircle,
      });
    }

    // Training frequency analysis
    const lastWeek = sortedEntries.filter(e => {
      const date = new Date(e.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    });

    if (lastWeek.length >= 3) {
      insights.push({
        type: 'positive',
        title: 'Great Training Frequency',
        description: `${lastWeek.length} sessions in the past week shows excellent commitment to development.`,
        icon: Target,
      });
    } else if (lastWeek.length === 0 && sortedEntries.length > 5) {
      insights.push({
        type: 'warning',
        title: 'Training Gap Detected',
        description: `No sessions recorded in the past week. Consistent training is key to maintaining and improving performance.`,
        icon: AlertCircle,
      });
    }

    // Personal record analysis
    const allReps = performanceEntries.flatMap(e => e.reps);
    const personalRecord = Math.max(...allReps);
    const recentMax = Math.max(...recentReps);
    const daysSincePR = calculateDaysSince(
      sortedEntries.find(e => e.reps.includes(personalRecord))?.date || ''
    );

    if (recentMax === personalRecord && daysSincePR < 7) {
      insights.push({
        type: 'positive',
        title: 'New Personal Record!',
        description: `Congratulations on setting a new PR of ${personalRecord.toFixed(1)}! Your hard work is paying off.`,
        icon: Award,
      });
    } else if (daysSincePR > 30) {
      insights.push({
        type: 'goal',
        title: 'Challenge: Beat Your PR',
        description: `Your PR of ${personalRecord.toFixed(1)} was set ${daysSincePR} days ago. Time to push for a new record!`,
        icon: Target,
      });
    }

    // Drill variety analysis
    const drillCount = new Set(recent.map(e => e.drill)).size;
    if (drillCount < 2 && recent.length > 3) {
      insights.push({
        type: 'neutral',
        title: 'Try Different Drills',
        description: `You've been focusing on one drill. Mix it up with different exercises to develop well-rounded skills.`,
        icon: Sparkles,
      });
    }

    // Game stats integration
    if (gameStats.length > 0) {
      const latestGame = gameStats[0];
      if (latestGame.average && latestGame.average > 0.300) {
        insights.push({
          type: 'positive',
          title: 'Strong Game Performance',
          description: `Your ${(latestGame.average * 1000).toFixed(0)} batting average shows your practice is translating to game success!`,
          icon: Award,
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();
  const displayedInsights = showAll ? insights : insights.slice(0, 3);

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#38bdf8]" />
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8]">AI Insights</h3>
            <p className="text-[11px] text-[#94a3b8]">
              {playerName ? `Performance analysis for ${playerName}` : 'Performance analysis'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {displayedInsights.map((insight, index) => {
          const Icon = insight.icon;
          const colors = {
            positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]', icon: 'text-[#10b981]' },
            warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]', icon: 'text-[#f59e0b]' },
            neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]', icon: 'text-[#38bdf8]' },
            goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]', icon: 'text-[#60a5fa]' },
          };

          const style = colors[insight.type];

          return (
            <div
              key={index}
              className={`${style.bg} ${style.border} border p-3 rounded-lg`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-4 w-4 ${style.icon} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className={`text-[12px] font-medium ${style.text} mb-1`}>
                    {insight.title}
                  </h4>
                  <p className="text-[11px] text-[#94a3b8]">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {insights.length > 3 && (
        <Button
          onClick={() => setShowAll(!showAll)}
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-[#38bdf8] hover:bg-[#1e293b]"
        >
          {showAll ? 'Show Less' : `Show ${insights.length - 3} More Insights`}
        </Button>
      )}

      <div className="mt-4 pt-4 border-t border-[#1e293b]">
        <p className="text-[10px] text-[#64748b] text-center">
          💡 Insights generated using client-side analysis of your performance data
        </p>
      </div>
    </Card>
  );
}

// Helper functions
function calculateStdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
}

function calculateDaysSince(dateString: string): number {
  if (!dateString) return 999;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
