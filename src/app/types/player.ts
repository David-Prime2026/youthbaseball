export interface Player {
  id: string;
  name: string;
  photo?: string; // base64 encoded image - current photo
  photoHistory?: { ageGroup: string; photo: string; uploadedAt: string }[]; // historical photos by age group
  dateOfBirth: string;
  ageGroup: string; // 9U, 10U, 11U, 12U, 13U, 14U, etc.
  positions: string[];
  throwingHand: 'Right' | 'Left' | 'Both';
  battingHand: 'Right' | 'Left' | 'Both';
  isAmbidextrous: boolean;
  contactEmail?: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const POSITIONS = [
  'Pitcher',
  'Catcher',
  'First Base',
  'Second Base',
  'Third Base',
  'Shortstop',
  'Left Field',
  'Center Field',
  'Right Field',
  'Designated Hitter',
];

export const AGE_GROUPS = [
  '8U', '9U', '10U', '11U', '12U', '13U', '14U', '15U', '16U', '17U', '18U'
];