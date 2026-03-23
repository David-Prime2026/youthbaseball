import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Camera, X, Upload, History } from 'lucide-react';

interface AgeGroupPhotoPromptProps {
  playerName: string;
  oldAgeGroup: string;
  newAgeGroup: string;
  currentPhoto?: string;
  onConfirm: (newPhoto: string | null) => void;
  onCancel: () => void;
}

export function AgeGroupPhotoPrompt({
  playerName,
  oldAgeGroup,
  newAgeGroup,
  currentPhoto,
  onConfirm,
  onCancel,
}: AgeGroupPhotoPromptProps) {
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#0f172a] border-[#1e293b] p-6 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[16px] font-medium text-[#f1f5f9]">Age Group Changed</h3>
            <p className="text-[11px] text-[#94a3b8]">
              {playerName} • {oldAgeGroup} → {newAgeGroup}
            </p>
          </div>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-[#94a3b8] hover:text-[#f1f5f9]"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-[#1e293b] p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Camera className="h-5 w-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[13px] font-medium text-[#f1f5f9] mb-1">
                Update Player Photo for New Age Group?
              </h4>
              <p className="text-[11px] text-[#94a3b8]">
                Players often look different as they age. We recommend uploading a current photo for the new age group.
                Your previous {oldAgeGroup} photo will be saved in the photo history.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Current Photo */}
            <div className="flex-1">
              <p className="text-[10px] text-[#64748b] mb-2">CURRENT PHOTO ({oldAgeGroup})</p>
              <div className="w-full h-48 rounded-lg bg-[#0a0f1a] border-2 border-[#334155] overflow-hidden flex items-center justify-center">
                {currentPhoto ? (
                  <img src={currentPhoto} alt="Current" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Camera className="h-8 w-8 text-[#64748b] mx-auto mb-2" />
                    <p className="text-[10px] text-[#64748b]">No photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* New Photo */}
            <div className="flex-1">
              <p className="text-[10px] text-[#64748b] mb-2">NEW PHOTO ({newAgeGroup})</p>
              <div className="w-full h-48 rounded-lg bg-[#0a0f1a] border-2 border-[#38bdf8] overflow-hidden flex items-center justify-center">
                {newPhoto ? (
                  <div className="relative w-full h-full">
                    <img src={newPhoto} alt="New" className="w-full h-full object-cover" />
                    <Button
                      onClick={() => setNewPhoto(null)}
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-[#0a0f1a]/80 border-[#334155] text-[#ef4444] hover:bg-[#7f1d1d]"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="h-8 w-8 text-[#64748b] mx-auto mb-2" />
                    <p className="text-[10px] text-[#64748b] mb-3">Upload new photo</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      className="bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9]"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Choose Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] p-3 rounded-lg mb-6">
          <div className="flex items-start gap-2">
            <History className="h-4 w-4 text-[#94a3b8] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-[#e2e8f0] font-medium mb-1">Photo History</p>
              <p className="text-[10px] text-[#94a3b8]">
                {currentPhoto
                  ? `Your current ${oldAgeGroup} photo will be automatically saved to photo history. You can view all historical photos in the player's profile.`
                  : 'No previous photos to archive.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onConfirm(null)}
            variant="outline"
            className="flex-1 border-[#334155] text-[#94a3b8] hover:bg-[#1e293b]"
          >
            Keep Current Photo
          </Button>
          <Button
            onClick={() => onConfirm(newPhoto)}
            disabled={!newPhoto}
            className="flex-1 bg-[#38bdf8] text-[#0a0f1a] hover:bg-[#0ea5e9] disabled:bg-[#334155] disabled:text-[#64748b]"
          >
            <Camera className="h-4 w-4 mr-2" />
            {newPhoto ? 'Update Photo' : 'Upload Photo First'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
