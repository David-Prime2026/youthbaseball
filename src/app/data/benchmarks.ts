import { BenchmarkData } from '../types/performance';

export const BATTING_BENCHMARKS: BenchmarkData[] = [
  // Exit Velocity
  { ageGroup: '8U', metricType: 'Exit Velocity', average: 45, elite: 55, unit: 'mph' },
  { ageGroup: '9U', metricType: 'Exit Velocity', average: 48, elite: 58, unit: 'mph' },
  { ageGroup: '10U', metricType: 'Exit Velocity', average: 52, elite: 62, unit: 'mph' },
  { ageGroup: '11U', metricType: 'Exit Velocity', average: 55, elite: 63, unit: 'mph' },
  { ageGroup: '12U', metricType: 'Exit Velocity', average: 60, elite: 67, unit: 'mph' },
  { ageGroup: '13U', metricType: 'Exit Velocity', average: 62, elite: 68, unit: 'mph' },
  { ageGroup: '14U', metricType: 'Exit Velocity', average: 63, elite: 72, unit: 'mph' },
  
  // Bat Speed
  { ageGroup: '8U', metricType: 'Bat Speed', average: 40, elite: 50, unit: 'mph' },
  { ageGroup: '9U', metricType: 'Bat Speed', average: 43, elite: 52, unit: 'mph' },
  { ageGroup: '10U', metricType: 'Bat Speed', average: 47, elite: 57, unit: 'mph' },
  { ageGroup: '11U', metricType: 'Bat Speed', average: 48, elite: 58, unit: 'mph' },
  { ageGroup: '12U', metricType: 'Bat Speed', average: 52, elite: 62, unit: 'mph' },
  { ageGroup: '13U', metricType: 'Bat Speed', average: 54, elite: 63, unit: 'mph' },
  { ageGroup: '14U', metricType: 'Bat Speed', average: 57, elite: 67, unit: 'mph' },
  
  // Launch Angle (ideal range)
  { ageGroup: '8U', metricType: 'Launch Angle', average: 12, elite: 22, unit: '°' },
  { ageGroup: '9U', metricType: 'Launch Angle', average: 14, elite: 24, unit: '°' },
  { ageGroup: '10U', metricType: 'Launch Angle', average: 16, elite: 26, unit: '°' },
  { ageGroup: '11U', metricType: 'Launch Angle', average: 18, elite: 28, unit: '°' },
  { ageGroup: '12U', metricType: 'Launch Angle', average: 22, elite: 32, unit: '°' },
  { ageGroup: '13U', metricType: 'Launch Angle', average: 20, elite: 28, unit: '°' },
  { ageGroup: '14U', metricType: 'Launch Angle', average: 20, elite: 30, unit: '°' },
];

export const PITCHING_BENCHMARKS: BenchmarkData[] = [
  // Throwing Velocity
  { ageGroup: '8U', metricType: 'Throwing Velocity', average: 40, elite: 50, unit: 'mph' },
  { ageGroup: '9U', metricType: 'Throwing Velocity', average: 43, elite: 53, unit: 'mph' },
  { ageGroup: '10U', metricType: 'Throwing Velocity', average: 47, elite: 57, unit: 'mph' },
  { ageGroup: '11U', metricType: 'Throwing Velocity', average: 52, elite: 62, unit: 'mph' },
  { ageGroup: '12U', metricType: 'Throwing Velocity', average: 58, elite: 68, unit: 'mph' },
  { ageGroup: '13U', metricType: 'Throwing Velocity', average: 63, elite: 73, unit: 'mph' },
  { ageGroup: '14U', metricType: 'Throwing Velocity', average: 67, elite: 77, unit: 'mph' },
  
  // Spin Rate
  { ageGroup: '8U', metricType: 'Spin Rate', average: 1100, elite: 1500, unit: 'rpm' },
  { ageGroup: '9U', metricType: 'Spin Rate', average: 1200, elite: 1550, unit: 'rpm' },
  { ageGroup: '10U', metricType: 'Spin Rate', average: 1300, elite: 1650, unit: 'rpm' },
  { ageGroup: '11U', metricType: 'Spin Rate', average: 1450, elite: 1850, unit: 'rpm' },
  { ageGroup: '12U', metricType: 'Spin Rate', average: 1550, elite: 1950, unit: 'rpm' },
  { ageGroup: '13U', metricType: 'Spin Rate', average: 1750, elite: 2150, unit: 'rpm' },
  { ageGroup: '14U', metricType: 'Spin Rate', average: 1850, elite: 2250, unit: 'rpm' },
  
  // Strike Percentage
  { ageGroup: '8U', metricType: 'Strike Percentage', average: 45, elite: 65, unit: '%' },
  { ageGroup: '9U', metricType: 'Strike Percentage', average: 48, elite: 68, unit: '%' },
  { ageGroup: '10U', metricType: 'Strike Percentage', average: 52, elite: 72, unit: '%' },
  { ageGroup: '11U', metricType: 'Strike Percentage', average: 53, elite: 73, unit: '%' },
  { ageGroup: '12U', metricType: 'Strike Percentage', average: 57, elite: 77, unit: '%' },
  { ageGroup: '13U', metricType: 'Strike Percentage', average: 59, elite: 79, unit: '%' },
  { ageGroup: '14U', metricType: 'Strike Percentage', average: 61, elite: 81, unit: '%' },
];

export const RUNNING_BENCHMARKS: BenchmarkData[] = [
  // 30-Yard Dash (lower is better)
  { ageGroup: '8U', metricType: '30-Yard Dash', average: 5.2, elite: 4.5, unit: 's' },
  { ageGroup: '9U', metricType: '30-Yard Dash', average: 5.0, elite: 4.4, unit: 's' },
  { ageGroup: '10U', metricType: '30-Yard Dash', average: 4.8, elite: 4.2, unit: 's' },
  { ageGroup: '11U', metricType: '30-Yard Dash', average: 4.6, elite: 4.1, unit: 's' },
  { ageGroup: '12U', metricType: '30-Yard Dash', average: 4.4, elite: 3.9, unit: 's' },
  { ageGroup: '13U', metricType: '30-Yard Dash', average: 4.3, elite: 3.8, unit: 's' },
  { ageGroup: '14U', metricType: '30-Yard Dash', average: 4.1, elite: 3.6, unit: 's' },
  
  // Home-to-First (lower is better)
  { ageGroup: '8U', metricType: 'Home-to-First', average: 5.8, elite: 5.1, unit: 's' },
  { ageGroup: '9U', metricType: 'Home-to-First', average: 5.6, elite: 5.0, unit: 's' },
  { ageGroup: '10U', metricType: 'Home-to-First', average: 5.4, elite: 4.7, unit: 's' },
  { ageGroup: '11U', metricType: 'Home-to-First', average: 5.0, elite: 4.4, unit: 's' },
  { ageGroup: '12U', metricType: 'Home-to-First', average: 4.6, elite: 4.0, unit: 's' },
  { ageGroup: '13U', metricType: 'Home-to-First', average: 4.4, elite: 3.9, unit: 's' },
  { ageGroup: '14U', metricType: 'Home-to-First', average: 4.2, elite: 3.7, unit: 's' },
];

export const STRENGTH_BENCHMARKS: BenchmarkData[] = [
  // Broad Jump
  { ageGroup: '8U', metricType: 'Broad Jump', average: 45, elite: 60, unit: 'in' },
  { ageGroup: '9U', metricType: 'Broad Jump', average: 48, elite: 62, unit: 'in' },
  { ageGroup: '10U', metricType: 'Broad Jump', average: 52, elite: 67, unit: 'in' },
  { ageGroup: '11U', metricType: 'Broad Jump', average: 58, elite: 73, unit: 'in' },
  { ageGroup: '12U', metricType: 'Broad Jump', average: 62, elite: 77, unit: 'in' },
  { ageGroup: '13U', metricType: 'Broad Jump', average: 68, elite: 83, unit: 'in' },
  { ageGroup: '14U', metricType: 'Broad Jump', average: 72, elite: 87, unit: 'in' },
  
  // Vertical Jump
  { ageGroup: '8U', metricType: 'Vertical Jump', average: 10, elite: 16, unit: 'in' },
  { ageGroup: '9U', metricType: 'Vertical Jump', average: 11, elite: 17, unit: 'in' },
  { ageGroup: '10U', metricType: 'Vertical Jump', average: 13, elite: 19, unit: 'in' },
  { ageGroup: '11U', metricType: 'Vertical Jump', average: 14, elite: 20, unit: 'in' },
  { ageGroup: '12U', metricType: 'Vertical Jump', average: 16, elite: 22, unit: 'in' },
  { ageGroup: '13U', metricType: 'Vertical Jump', average: 17, elite: 23, unit: 'in' },
  { ageGroup: '14U', metricType: 'Vertical Jump', average: 19, elite: 25, unit: 'in' },
];

export const EXERCISE_BENCHMARKS: BenchmarkData[] = [
  // Push-ups
  { ageGroup: '8U', metricType: 'Push-ups', average: 10, elite: 20, unit: 'reps' },
  { ageGroup: '9U', metricType: 'Push-ups', average: 12, elite: 22, unit: 'reps' },
  { ageGroup: '10U', metricType: 'Push-ups', average: 15, elite: 25, unit: 'reps' },
  { ageGroup: '11U', metricType: 'Push-ups', average: 18, elite: 28, unit: 'reps' },
  { ageGroup: '12U', metricType: 'Push-ups', average: 20, elite: 32, unit: 'reps' },
  { ageGroup: '13U', metricType: 'Push-ups', average: 25, elite: 40, unit: 'reps' },
  { ageGroup: '14U', metricType: 'Push-ups', average: 30, elite: 50, unit: 'reps' },
  
  // Plank Hold
  { ageGroup: '8U', metricType: 'Plank Hold', average: 30, elite: 60, unit: 's' },
  { ageGroup: '9U', metricType: 'Plank Hold', average: 35, elite: 70, unit: 's' },
  { ageGroup: '10U', metricType: 'Plank Hold', average: 45, elite: 90, unit: 's' },
  { ageGroup: '11U', metricType: 'Plank Hold', average: 50, elite: 100, unit: 's' },
  { ageGroup: '12U', metricType: 'Plank Hold', average: 60, elite: 120, unit: 's' },
  { ageGroup: '13U', metricType: 'Plank Hold', average: 75, elite: 140, unit: 's' },
  { ageGroup: '14U', metricType: 'Plank Hold', average: 90, elite: 160, unit: 's' },
];

export const DRILL_OPTIONS = {
  batting: [
    'Tee',
    'Soft Toss',
    'Front Toss',
    'Live BP',
    'Machine',
    'Cage Work',
  ],
  pitching: [
    'Bullpen',
    'Long Toss',
    'Flat Ground',
    'Mound Work',
    'Weighted Ball',
    'Drill Work',
  ],
  running: [
    '30-Yard Dash',
    'Home-to-First',
    '60-Yard Dash',
    'Base Running',
    'Agility Drills',
  ],
  strength: [
    'Broad Jump',
    'Vertical Jump',
    'Med Ball Throw',
    'Core Circuit',
    'Resistance Training',
  ],
  exercise: [
    'Push-ups',
    'Pull-ups',
    'Plank Hold',
    'Med Ball Rotational Throw',
    'Med Ball Chest Pass',
    'Med Ball Overhead Slam',
    'Single Leg RDL',
    'Goblet Squat',
    'Lateral Lunge',
    'Box Jumps',
    'Hurdle Hops',
    'Agility Ladder Drills',
    'Pro Agility Shuttle',
    'L-Drill',
    'Band Rotations',
    'Band Rows',
    'Band Sword Pulls',
    'Reverse Throws',
    'Wall Ball Throws',
    'Kettlebell Swings',
    'Turkish Get-ups',
    'Farmer Carries',
    'Dead Bugs',
    'Bird Dogs',
    'Anti-Rotation Press',
  ],
};