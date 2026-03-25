import { useState, useRef } from 'react';
import { Player, POSITIONS, AGE_GROUPS } from '../types/player';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AgeGroupPhotoPrompt } from './AgeGroupPhotoPrompt';
import { Camera, X, Save, AlertCircle, History } from 'lucide-react';

interface PlayerProfileEditorProps {
  player: Player;
  onSave: (updates: Partial<Player>) => void;
  onClose: () => void;
  isIncomplete?: boolean;
}

export function PlayerProfileEditor({ player, onSave, onClose, isIncomplete }: PlayerProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: player.name,
    dateOfBirth: player.dateOfBirth || '',
    ageGroup: player.ageGroup,
    positions: player.positions || [],
    throwingHand: player.throwingHand,
    battingHand: player.battingHand,
    isAmbidextrous: player.isAmbidextrous,
    contactEmail: player.contactEmail || '',
    phoneNumber: player.phoneNumber || '',
    notes: player.notes || '',
    photo: player.photo || '',
    photoHistory: player.photoHistory || [],
  });

  const [showAgeGroupPrompt, setShowAgeGroupPrompt] = useState(false);
  const [pendingAgeGroup, setPendingAgeGroup] = useState<string | null>(null);
  const [showPhotoHistory, setShowPhotoHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePositionToggle = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position],
    }));
  };

  const handleAgeGroupChange = (newAgeGroup: string) => {
    // Check if age group actually changed
    if (newAgeGroup !== player.ageGroup && player.ageGroup) {
      setPendingAgeGroup(newAgeGroup);
      setShowAgeGroupPrompt(true);
    } else {
      // No change or first time setting, just update
      setFormData(prev => ({ ...prev, ageGroup: newAgeGroup }));
    }
  };

  const handleAgeGroupPhotoConfirm = (newPhoto: string | null) => {
    if (pendingAgeGroup) {
      // Archive current photo if exists
      const updatedPhotoHistory = [...formData.photoHistory];
      if (formData.photo) {
        updatedPhotoHistory.push({
          ageGroup: player.ageGroup,
          photo: formData.photo,
          uploadedAt: new Date().toISOString(),
        });
      }

      setFormData(prev => ({
        ...prev,
        ageGroup: pendingAgeGroup,
        photo: newPhoto || prev.photo, // Use new photo if provided, otherwise keep current
        photoHistory: updatedPhotoHistory,
      }));
    }

    setShowAgeGroupPrompt(false);
    setPendingAgeGroup(null);
  };

  const handleCancelAgeGroupChange = () => {
    // Revert age group change
    setFormData(prev => ({ ...prev, ageGroup: player.ageGroup }));
    setShowAgeGroupPrompt(false);
    setPendingAgeGroup(null);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isProfileComplete = () => {
    return (
      formData.name.trim() !== '' &&
      formData.dateOfBirth !== '' &&
      formData.ageGroup !== '' &&
      formData.positions.length > 0 &&
      formData.photo !== ''
    );
  };

  const missingFields = [];
  if (!formData.dateOfBirth) missingFields.push('Date of Birth');
  if (formData.positions.length === 0) missingFields.push('Positions');
  if (!formData.photo) missingFields.push('Photo');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      {/* Age Group Photo Prompt */}
      {showAgeGroupPrompt && pendingAgeGroup && (
        <AgeGroupPhotoPrompt
          playerName={formData.name}
          oldAgeGroup={player.ageGroup}
          newAgeGroup={pendingAgeGroup}
          currentPhoto={formData.photo}
          onConfirm={handleAgeGroupPhotoConfirm}
          onCancel={handleCancelAgeGroupChange}
        />
      )}

      <Card className="bg-[#0f172a] border-[#1e293b] p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[16px] font-medium text-[#f1f5f9]">
              {isIncomplete ? 'Complete Player Profile' : 'Edit Player Profile'}
            </h3>
            <p className="text-[11px] text-[#94a3b8]">
              {isIncomplete ? 'Fill out remaining information for this player' : 'Update player information'}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-[#94a3b8] hover:text-[#f1f5f9]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isIncomplete && missingFields.length > 0 && (
          <div className="bg-[#7c2d12] border border-[#9a3412] p-3 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-[#fdba74] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] text-[#fdba74] font-medium mb-1">Incomplete Profile</p>
              <p className="text-[11px] text-[#fef3c7]">
                Missing: {missingFields.join(', ')}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Photo Upload */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">
              Player Photo {!formData.photo && <span className="text-[#ef4444]">*</span>}
            </Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-[#1e293b] border-2 border-[#334155] overflow-hidden flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="Player" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-[#64748b]" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
                  size="sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {formData.photo ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {formData.photo && (
                  <Button
                    onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                    variant="outline"
                    size="sm"
                    className="ml-2 border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]"
                  >
                    Remove
                  </Button>
                )}
                <p className="text-[10px] text-[#64748b] mt-1">JPG, PNG, or GIF (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                placeholder="First Last"
              />
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">
                Date of Birth {!formData.dateOfBirth && <span className="text-[#ef4444]">*</span>}
              </Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
              />
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Age Group *</Label>
              <Select 
                value={formData.ageGroup} 
                onValueChange={handleAgeGroupChange}
              >
                <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155]">
                  {AGE_GROUPS.map(group => (
                    <SelectItem key={group} value={group} className="text-[#e2e8f0]">
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Throwing Hand</Label>
              <Select 
                value={formData.throwingHand} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, throwingHand: value }))}
              >
                <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155]">
                  <SelectItem value="Right" className="text-[#e2e8f0]">Right</SelectItem>
                  <SelectItem value="Left" className="text-[#e2e8f0]">Left</SelectItem>
                  <SelectItem value="Both" className="text-[#e2e8f0]">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Batting Hand</Label>
              <Select 
                value={formData.battingHand} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, battingHand: value }))}
              >
                <SelectTrigger className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e293b] border-[#334155]">
                  <SelectItem value="Right" className="text-[#e2e8f0]">Right</SelectItem>
                  <SelectItem value="Left" className="text-[#e2e8f0]">Left</SelectItem>
                  <SelectItem value="Both" className="text-[#e2e8f0]">Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Positions */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">
              Positions {formData.positions.length === 0 && <span className="text-[#ef4444]">*</span>}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {POSITIONS.map(position => (
                <Button
                  key={position}
                  onClick={() => handlePositionToggle(position)}
                  variant="outline"
                  size="sm"
                  className={
                    formData.positions.includes(position)
                      ? 'bg-[#38bdf8] text-[#0a0f1a] border-[#38bdf8] hover:bg-[#0ea5e9]'
                      : 'border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]'
                  }
                >
                  {position}
                </Button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Contact Email</Label>
              <Input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                placeholder="parent@email.com"
              />
            </div>

            <div>
              <Label className="text-[11px] text-[#94a3b8] mb-2 block">Phone Number</Label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="bg-[#1e293b] border-[#334155] text-[#e2e8f0]"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-[11px] text-[#94a3b8] mb-2 block">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-[#1e293b] border-[#334155] text-[#e2e8f0] min-h-[80px]"
              placeholder="Additional notes about the player..."
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-[#1e293b] mt-6">
          <div className="text-[11px] text-[#94a3b8]">
            {isProfileComplete() ? (
              <span className="text-[#10b981]">âœ“ Profile complete</span>
            ) : (
              <span className="text-[#f59e0b]">âš  {missingFields.length} required field{missingFields.length !== 1 ? 's' : ''} missing</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

