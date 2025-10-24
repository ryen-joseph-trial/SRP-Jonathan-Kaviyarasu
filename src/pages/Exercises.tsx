import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exercises, Exercise } from "@/lib/exercises";
import { Activity, Apple, Dumbbell, Menu, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Exercises = () => {
  const [selectedCategory, setSelectedCategory] = useState<Exercise['category'] | 'all'>('all');

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const categories = [
    { value: 'all' as const, label: 'All', color: 'bg-muted' },
    { value: 'strength' as const, label: 'Strength', color: 'bg-primary' },
    { value: 'cardio' as const, label: 'Cardio', color: 'bg-secondary' },
    { value: 'yoga' as const, label: 'Yoga', color: 'bg-accent' },
    { value: 'mobility' as const, label: 'Mobility', color: 'bg-success' },
  ];

  const difficultyColors = {
    beginner: 'bg-success',
    intermediate: 'bg-secondary',
    advanced: 'bg-accent',
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="gradient-primary text-white p-6 shadow-glow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Exercise Library</h1>
          <p className="text-white/80">Explore and master your fitness journey</p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {categories.map(category => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              className={selectedCategory === category.value ? 'gradient-primary text-white' : ''}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <Card key={exercise.id} className="p-6 shadow-card hover:shadow-glow transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{exercise.name}</h3>
                <Badge className={difficultyColors[exercise.difficulty]}>
                  {exercise.difficulty}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">{exercise.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {exercise.muscleGroups.map(muscle => (
                  <Badge key={muscle} variant="outline" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>~{exercise.caloriesPerMinute} cal/min</span>
                <Badge className="capitalize">{exercise.category}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-around p-4">
          <Link to="/dashboard" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link to="/exercises" className="flex flex-col items-center text-primary">
            <Dumbbell className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Exercises</span>
          </Link>
          <Link to="/posture" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Posture</span>
          </Link>
          <Link to="/nutrition" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
            <Apple className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Nutrition</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
            <Menu className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">More</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Exercises;
