// Local storage utilities for SmartFitness PWA
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  exercises: WorkoutExercise[];
  duration: number;
  caloriesBurned: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
}

export interface Meal {
  id: string;
  userId: string;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  userId: string;
  goal: 'weight-loss' | 'muscle-gain' | 'endurance' | 'general';
  weight?: number;
  height?: number;
  age?: number;
  dailyCalorieGoal?: number;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'smartfitness_current_user',
  USERS: 'smartfitness_users',
  WORKOUTS: 'smartfitness_workouts',
  MEALS: 'smartfitness_meals',
  PROFILES: 'smartfitness_profiles',
};

// User authentication
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const signUp = (email: string, password: string, name: string): User => {
  const users = getUsers();
  
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(user);
  
  return user;
};

export const signIn = (email: string, password: string): User => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }

  setCurrentUser(user);
  return user;
};

export const signOut = () => {
  setCurrentUser(null);
};

const getUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

// Workouts
export const getWorkouts = (userId: string): Workout[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  const workouts: Workout[] = data ? JSON.parse(data) : [];
  return workouts.filter(w => w.userId === userId);
};

export const addWorkout = (workout: Omit<Workout, 'id'>): Workout => {
  const workouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]');
  const newWorkout = { ...workout, id: crypto.randomUUID() };
  workouts.push(newWorkout);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  return newWorkout;
};

// Meals
export const getMeals = (userId: string, date?: string): Meal[] => {
  const data = localStorage.getItem(STORAGE_KEYS.MEALS);
  const meals: Meal[] = data ? JSON.parse(data) : [];
  let filtered = meals.filter(m => m.userId === userId);
  if (date) {
    filtered = filtered.filter(m => m.date === date);
  }
  return filtered;
};

export const addMeal = (meal: Omit<Meal, 'id'>): Meal => {
  const meals = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEALS) || '[]');
  const newMeal = { ...meal, id: crypto.randomUUID() };
  meals.push(newMeal);
  localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  return newMeal;
};

// User Profile
export const getUserProfile = (userId: string): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
  const profiles: UserProfile[] = data ? JSON.parse(data) : [];
  return profiles.find(p => p.userId === userId) || null;
};

export const updateUserProfile = (profile: UserProfile) => {
  const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
  const index = profiles.findIndex((p: UserProfile) => p.userId === profile.userId);
  
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  
  localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
};
