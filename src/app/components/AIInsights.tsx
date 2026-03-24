import { Card } from './ui/card';
import { Button } from './ui/button';
import { PerformanceEntry } from '../types/performance';
import { GameStats } from '../types/gameStats';
import { Sparkles, TrendingUp, AlertCircle, Target, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const generateInsights = async () => {
    if (performanceEntries.length === 0 && gameStats.length === 0) {
      setInsights([{ type: 'neutral', title: 'Start Tracking', description: 'Add performance data to receive personalized AI insights.' }]);
      setHasGenerated(true);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-performance', {
        body: { performanceData: performanceEntries.slice(0, 20), gameStats: gameStats.slice(0, 15), playerName: playerName || 'Team', category: category || 'General' },
      });
      if (error) throw error;
      if (data?.insights && Array.isArray(data.insights)) setInsights(data.insights);
      else throw new Error('Invalid response');
    } catch (error) {
      console.error('AI Insights error:', error);
      setInsights([{ type: 'neutral', title: 'Analysis Unavailable', description: 'Could not generate insights. Try again.' }]);
    } finally {
      setLoading(false);
      setHasGenerated(true);
      setCollapsed(false);
    }
  };

  const iconMap: Record<string, any> = { positive: TrendingUp, warning: AlertCircle, neutral: Sparkles, goal: Target };
  const colors: Record<string, any> = {
    positive: { bg: 'bg-[#064e3b]', border: 'border-[#065f46]', text: 'text-[#6ee7b7]', icon: 'text-[#10b981]' },
    warning: { bg: 'bg-[#7c2d12]', border: 'border-[#9a3412]', text: 'text-[#fdba74]', icon: 'text-[#f59e0b]' },
    neutral: { bg: 'bg-[#1e293b]', border: 'border-[#334155]', text: 'text-[#e2e8f0]', icon: 'text-[#38bdf8]' },
    goal: { bg: 'bg-[#1e3a8a]', border: 'border-[#1e40af]', text: 'text-[#93c5fd]', icon: 'text-[#60a5fa]' },
  };

  return (
    <Card className="bg-[#0f172a] border-[#1e293b] p-6">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => hasGenerated && setCollapsed(!collapsed)} className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#38bdf8]" />
          <div className="text-left">
            <h3 className="text-[14px] font-medium text-[#38bdf8]">AI Insights</h3>
            <p className="text-[11px] text-[#94a3b8]">{playerName ? 'Analysis for ' + playerName : 'Performance analysis'}</p>
          </div>
          {hasGenerated && (collapsed ? <ChevronDown className="h-4 w-4 text-[#64748b] ml-2" /> : <ChevronUp className="h-4 w-4 text-[#64748b] ml-2" />)}
        </button>
        <Button onClick={generateInsights} disabled={loading} size="sm" className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]">
          {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>) : hasGenerated ? 'Refresh' : 'Generate Insights'}
        </Button>
      </div>

      {!collapsed && (
        <>
          {!hasGenerated && !loading && (
            <div className="text-center py-4"><Sparkles className="h-6 w-6 text-[#334155] mx-auto mb-2" /><p className="text-[11px] text-[#64748b]">Click "Generate Insights" for AI-powered analysis</p></div>
          )}
          {loading && (<div className="text-center py-4"><Loader2 className="h-6 w-6 text-[#38bdf8] mx-auto animate-spin" /><p className="text-[11px] text-[#94a3b8] mt-2">Analyzing data...</p></div>)}
          {hasGenerated && !loading && (
            <div className="space-y-2 mt-2">{insights.map((insight, i) => {
              const Icon = iconMap[insight.type] || Sparkles;
              const style = colors[insight.type] || colors.neutral;
              return (<div key={i} className={style.bg + ' ' + style.border + ' border p-3 rounded-lg'}><div className="flex items-start gap-3"><Icon className={'h-4 w-4 ' + style.icon + ' flex-shrink-0 mt-0.5'} /><div><h4 className={'text-[12px] font-medium ' + style.text + ' mb-1'}>{insight.title}</h4><p className="text-[11px] text-[#94a3b8]">{insight.description}</p></div></div></div>);
            })}</div>
          )}
          <div className="mt-3 pt-3 border-t border-[#1e293b]"><p className="text-[10px] text-[#64748b] text-center">Powered by Claude AI</p></div>
        </>
      )}
    </Card>
  );
}
