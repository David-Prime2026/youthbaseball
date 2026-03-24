export interface ExerciseCategory {
  name: string;
  description: string;
  exercises: string[];
  linkedMetrics: string[];
}

export const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  {
    name: 'Upper Body Power',
    description: 'Develops throwing velocity, bat speed, and overall upper body explosiveness.',
    exercises: ['Push-ups', 'Pull-ups', 'Med Ball Chest Pass', 'Med Ball Overhead Slam', 'Band Rows', 'Band Sword Pulls'],
    linkedMetrics: ['Exit Velocity', 'Bat Speed', 'Throwing Velocity'],
  },
  {
    name: 'Core & Rotational',
    description: 'Builds rotational power for hitting and throwing. The engine of every swing and pitch.',
    exercises: ['Plank Hold', 'Med Ball Rotational Throw', 'Band Rotations', 'Anti-Rotation Press', 'Dead Bugs', 'Bird Dogs', 'Reverse Throws', 'Wall Ball Throws', 'Turkish Get-ups'],
    linkedMetrics: ['Exit Velocity', 'Bat Speed', 'Throwing Velocity', 'Spin Rate'],
  },
  {
    name: 'Lower Body Power',
    description: 'Drives sprint speed, stealing ability, and generates power from the ground up.',
    exercises: ['Box Jumps', 'Hurdle Hops', 'Goblet Squat', 'Single Leg RDL', 'Lateral Lunge', 'Kettlebell Swings', 'Farmer Carries'],
    linkedMetrics: ['30-Yard Dash', 'Home-to-First', 'Broad Jump', 'Vertical Jump'],
  },
  {
    name: 'Speed & Agility',
    description: 'Improves first-step quickness, base running, and defensive range.',
    exercises: ['Agility Ladder Drills', 'Pro Agility Shuttle', 'L-Drill'],
    linkedMetrics: ['30-Yard Dash', 'Home-to-First'],
  },
];

export function getExerciseCategory(exercise: string): ExerciseCategory | undefined {
  return EXERCISE_CATEGORIES.find(cat => cat.exercises.includes(exercise));
}
