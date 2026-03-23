export interface PerformanceEntry {
  id: string;
  playerName: string;
  playerId: string;
  ageGroup: string;
  date: string;
  season: string; // e.g., "Spring 2026"
  drill: string;
  reps: number[];
  notes: string;
  category: string; // batting, pitching, running, strength, exercise
  metricType: string;
  createdAt: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  ageGroup: string;
  category: string;
  metricType: string;
  personalRecord: number;
  averageValue: number;
  goal: number | null;
  allTimeEntries: PerformanceEntry[];
}

export interface BenchmarkData {
  ageGroup: string;
  metricType: string;
  average: number;
  elite: number;
  unit: string;
}