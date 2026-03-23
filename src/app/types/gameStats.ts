export interface GameStats {
  id: string;
  playerId: string;
  playerNumber: string;
  lastName: string;
  firstName: string;
  season: string; // e.g., "Spring 2026"
  gameDate: string;
  
  // Batting
  gamesPlayed?: number;
  plateAppearances?: number;
  atBats?: number;
  average?: number;
  onBasePercentage?: number;
  onBasePlusSlugging?: number;
  sluggingPercentage?: number;
  hits?: number;
  singles?: number;
  doubles?: number;
  triples?: number;
  homeRuns?: number;
  rbi?: number;
  runs?: number;
  walks?: number;
  strikeouts?: number;
  stolenBases?: number;
  caughtStealing?: number;
  
  // Pitching
  inningsPitched?: number;
  battersFaced?: number;
  pitchCount?: number;
  wins?: number;
  losses?: number;
  saves?: number;
  earnedRuns?: number;
  era?: number;
  whip?: number;
  strikeoutsPitching?: number;
  walksPitching?: number;
  hitsAllowed?: number;
  
  // Fielding
  totalChances?: number;
  putouts?: number;
  assists?: number;
  errors?: number;
  fieldingPercentage?: number;
  
  createdAt: string;
  updatedAt: string;
}

export const SEASONS = [
  'Spring 2024',
  'Summer 2024',
  'Fall 2024',
  'Winter 2024-25',
  'Spring 2025',
  'Summer 2025',
  'Fall 2025',
  'Winter 2025-26',
  'Spring 2026',
  'Summer 2026',
  'Fall 2026',
  'Winter 2026-27',
  'Spring 2027',
  'Summer 2027',
  'Fall 2027',
];
