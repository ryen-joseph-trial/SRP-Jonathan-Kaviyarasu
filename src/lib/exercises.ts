// Exercise library data
export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'yoga' | 'mobility';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  description: string;
  caloriesPerMinute: number;
}

export const exercises: Exercise[] = [
  // Strength
  {
    id: 'pushups',
    name: 'Push-ups',
    category: 'strength',
    difficulty: 'beginner',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Classic bodyweight exercise for upper body strength',
    caloriesPerMinute: 7,
  },
  {
    id: 'squats',
    name: 'Squats',
    category: 'strength',
    difficulty: 'beginner',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    description: 'Fundamental lower body exercise',
    caloriesPerMinute: 8,
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'strength',
    difficulty: 'intermediate',
    muscleGroups: ['back', 'glutes', 'hamstrings'],
    description: 'Compound exercise for posterior chain',
    caloriesPerMinute: 10,
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'strength',
    difficulty: 'intermediate',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    description: 'Upper body strength builder',
    caloriesPerMinute: 8,
  },
  {
    id: 'pullups',
    name: 'Pull-ups',
    category: 'strength',
    difficulty: 'advanced',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    description: 'Challenging upper body pull exercise',
    caloriesPerMinute: 10,
  },
  
  // Cardio
  {
    id: 'running',
    name: 'Running',
    category: 'cardio',
    difficulty: 'beginner',
    muscleGroups: ['legs', 'core'],
    description: 'Classic cardiovascular exercise',
    caloriesPerMinute: 11,
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    difficulty: 'beginner',
    muscleGroups: ['full body'],
    description: 'Full body cardio warm-up',
    caloriesPerMinute: 8,
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'advanced',
    muscleGroups: ['full body'],
    description: 'High-intensity full body movement',
    caloriesPerMinute: 12,
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    difficulty: 'intermediate',
    muscleGroups: ['core', 'shoulders', 'legs'],
    description: 'Dynamic cardio and core exercise',
    caloriesPerMinute: 10,
  },
  
  // Yoga
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    category: 'yoga',
    difficulty: 'beginner',
    muscleGroups: ['shoulders', 'hamstrings', 'calves'],
    description: 'Classic yoga pose for flexibility',
    caloriesPerMinute: 3,
  },
  {
    id: 'warrior-pose',
    name: 'Warrior Pose',
    category: 'yoga',
    difficulty: 'beginner',
    muscleGroups: ['legs', 'core', 'shoulders'],
    description: 'Strength and balance pose',
    caloriesPerMinute: 4,
  },
  {
    id: 'tree-pose',
    name: 'Tree Pose',
    category: 'yoga',
    difficulty: 'intermediate',
    muscleGroups: ['legs', 'core'],
    description: 'Balance and focus pose',
    caloriesPerMinute: 3,
  },
  
  // Mobility
  {
    id: 'leg-swings',
    name: 'Leg Swings',
    category: 'mobility',
    difficulty: 'beginner',
    muscleGroups: ['hips', 'legs'],
    description: 'Dynamic hip mobility exercise',
    caloriesPerMinute: 4,
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    category: 'mobility',
    difficulty: 'beginner',
    muscleGroups: ['shoulders'],
    description: 'Shoulder mobility warm-up',
    caloriesPerMinute: 3,
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow Stretch',
    category: 'mobility',
    difficulty: 'beginner',
    muscleGroups: ['spine', 'core'],
    description: 'Spinal mobility exercise',
    caloriesPerMinute: 2,
  },
];

export const getExercisesByCategory = (category: Exercise['category']) => {
  return exercises.filter(ex => ex.category === category);
};

export const getExerciseById = (id: string) => {
  return exercises.find(ex => ex.id === id);
};
