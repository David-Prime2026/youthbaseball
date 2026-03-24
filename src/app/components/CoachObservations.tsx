import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useObservations } from '../hooks/useObservations';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';

interface CoachObservationsProps {
  playerId: string;
  playerName: string;
}

export function CoachObservations({ playerId, playerName }: CoachObservationsProps) {
  const { observations, addObservation, deleteObservation } = useObservations(playerId);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<string>('');

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await addObservation({
      playerId,
      category,
      date: new Date().toISOString().split('T')[0],
      observationType: 'coach_note',
      content: content.trim(),
      rating: rating ? parseInt(rating) : null,
    });
    setContent('');
    setRating('');
    setShowForm(false);
  };

  return (
    <Card className="bg-[#1e293b] border-[#334155] p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#38bdf8]" />
          <h3 className="text-[12px] font-medium text-[#38bdf8]">Coach Observations</h3>
          <span className="text-[10px] text-[#64748b]">({observations.length})</span>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9] h-7 text-[11px]">
          {showForm ? <X className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
          {showForm ? 'Cancel' : 'Add Note'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-[#0f172a] p-3 rounded mb-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="General" className="text-[#e2e8f0]">General</SelectItem>
                <SelectItem value="Batting" className="text-[#e2e8f0]">Batting</SelectItem>
                <SelectItem value="Pitching" className="text-[#e2e8f0]">Pitching</SelectItem>
                <SelectItem value="Fielding" className="text-[#e2e8f0]">Fielding</SelectItem>
                <SelectItem value="Attitude" className="text-[#e2e8f0]">Attitude</SelectItem>
                <SelectItem value="Mechanics" className="text-[#e2e8f0]">Mechanics</SelectItem>
                <SelectItem value="Development" className="text-[#e2e8f0]">Development</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rating} onValueChange={setRating}>
              <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] h-8 text-[11px]"><SelectValue placeholder="Rating (optional)" /></SelectTrigger>
              <SelectContent className="bg-[#1e293b] border-[#334155]">
                <SelectItem value="5" className="text-[#e2e8f0]">5 - Excellent</SelectItem>
                <SelectItem value="4" className="text-[#e2e8f0]">4 - Good</SelectItem>
                <SelectItem value="3" className="text-[#e2e8f0]">3 - Average</SelectItem>
                <SelectItem value="2" className="text-[#e2e8f0]">2 - Needs Work</SelectItem>
                <SelectItem value="1" className="text-[#e2e8f0]">1 - Concern</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What did you observe? Mechanics, attitude, progress, areas to improve..." className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] min-h-[80px] text-[11px]" />
          <Button onClick={handleSubmit} size="sm" className="w-full bg-[#10b981] text-white hover:bg-[#059669] h-8 text-[11px]">Save Observation</Button>
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {observations.length === 0 && !showForm && (
          <p className="text-[11px] text-[#64748b] text-center py-4">No observations yet. Add coach notes to improve AI insights.</p>
        )}
        {observations.map(obs => (
          <div key={obs.id} className="bg-[#0f172a] p-3 rounded group">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded">{obs.category}</span>
                {obs.rating && (<span className={'text-[10px] font-medium px-2 py-0.5 rounded ' + (obs.rating >= 4 ? 'text-[#10b981] bg-[#10b981]/10' : obs.rating >= 3 ? 'text-[#f59e0b] bg-[#f59e0b]/10' : 'text-[#ef4444] bg-[#ef4444]/10')}>{obs.rating}/5</span>)}
                <span className="text-[10px] text-[#64748b]">{obs.date}</span>
              </div>
              <Button onClick={() => deleteObservation(obs.id)} size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-[#ef4444]"><Trash2 className="h-3 w-3" /></Button>
            </div>
            <p className="text-[11px] text-[#e2e8f0]">{obs.content}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
