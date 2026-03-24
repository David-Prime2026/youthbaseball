import { Card } from './ui/card';
import { Button } from './ui/button';
import { PerformanceEntry } from '../types/performance';
import { GameStats } from '../types/gameStats';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Target, Award, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabaseClient';

interface AIInsightsProps {
  performanceEntries: PerformanceEntry[];
  gameStats?: GameStats[];
  playerName?: string;
  category?: string;
}

interface Insight {
  type: 'positive' | 'warning' | 'neutral' | 'goal';
  title: string;
  description: string;
}

export function AIInsights({ performanceEntries, gameStats = [], playerName, category }: AIInsightsProps) {
  const [showAll, setShowAll] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsights = async () => {
    if (performanceEntries.length === 0 && gameStats.length === 0) {
      setInsights([{
        type: 'neutral',
        title: 'Start Tracking',
        description: 'Add performance data to receive personalized AI insights and recommendations.',
      }]);
      setHasGenerated(true);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: {
          performanceData: performanceEntries.slice(0, 20),
          gameStats: gameStats.slice(0, 15),
          playerName: playerName || 'Team',
          category: category || 'General',
        },
      });

      if (error) throw error;

      if (data?.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI Insights error:', error);
      setInsights([{
        type: 'neutral',
        title: 'Analysis Unavailable',
        description: 'Could not generate AI insights right now. Try again in a moment.',
      }]);
    } finally {
      setLoading(false);
      setHasGenerated(true);
    }
  };

  const iconMap = {
    positive: TrendingUp,
    warning: AlertCircle,
    neutral: Sparkles,
    goal: Target,
  };

  const colors = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]', icon: 'text-[#10b981]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]', icon: 'text-[#f59e0b]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]', icon: 'text-[#38bdf8]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]', icon: 'text-[#60a5fa]' },
  };

  const displayedInsights = showAll ? insights : insights.slice(0, 3);

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#38bdf8]" />
          <div>
            <h3 className="text-[14px] font-medium text-[#38bdf8]">AI Insights</h3>
            <p className="text-[11px] text-[#94a3b8]">
              {playerName ? 'Analysis for ' + playerName : 'Performance analysis'}
            </p>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          size="sm"
          className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : hasGenerated ? (
            'Refresh'
          ) : (
            'Generate Insights'
          )}
        </Button>
      </div>

      {!hasGenerated && !loading && (
        <div className="text-center py-6">
          <Sparkles className="h-8 w-8 text-[#334155] mx-auto mb-3" />
          <p className="text-[12px] text-[#64748b]">
            Click "Generate Insights" to get AI-powered analysis of your performance data
          </p>
        </div>
      )}

      {(hasGenerated || loading) && (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-6">
              <Loader2 className="h-8 w-8 text-[#38bdf8] mx-auto mb-3 animate-spin" />
              <p className="text-[12px] text-[#94a3b8]">Analyzing performance data...</p>
            </div>
          ) : (
            displayedInsights.map((insight, index) => {
              const Icon = iconMap[insight.type] || Sparkles;
              const style = colors[insight.type] || colors.neutral;

              return (
                <div
                  key={index}
                  className={style.bg + ' ' + style.border + ' border p-3 rounded-lg'}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={'h-4 w-4 ' + style.icon + ' flex-shrink-0 mt-0.5'} />
                    <div className="flex-1">
                      <h4 className={'text-[12px] font-medium ' + style.text + ' mb-1'}>
                        {insight.title}
                      </h4>
                      <p className="text-[11px] text-[#94a3b8]">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {insights.length > 3 && (
        <Button
          onClick={() => setShowAll(!showAll)}
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-[#38bdf8] hover:bg-[#1e293b]"
        >
          {showAll ? 'Show Less' : 'Show ' + (insights.length - 3) + ' More Insights'}
        </Button>
      )}

      <div className="mt-4 pt-4 border-t border-[#1e293b]">
        <p className="text-[10px] text-[#64748b] text-center">
          Powered by Claude AI - Insights generated from your performance data
        </p>
      </div>
    </Card>
  );
}
