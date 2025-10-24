import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser, signOut, getWorkouts, getMeals } from "@/lib/storage";
import { Activity, Apple, Dumbbell, TrendingUp, LogOut, Menu, Camera } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    signOut();
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) return null;

  const workouts = getWorkouts(user.id);
  const todayMeals = getMeals(user.id, new Date().toISOString().split('T')[0]);
  const totalCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const weeklyWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="gradient-primary text-white p-6 shadow-glow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-white/80">Ready for today's workout?</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-primary" />
              <span className="text-3xl font-bold">{weeklyWorkouts.length}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Workouts This Week</h3>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <Apple className="w-8 h-8 text-accent" />
              <span className="text-3xl font-bold">{totalCalories}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Calories Today</h3>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-success" />
              <span className="text-3xl font-bold">{workouts.length}</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Total Workouts</h3>
          </Card>

          <Card className="p-6 shadow-card hover:shadow-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <Dumbbell className="w-8 h-8 text-secondary" />
              <span className="text-3xl font-bold">0</span>
            </div>
            <h3 className="text-sm text-muted-foreground">Current Streak</h3>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/posture">
            <Card className="p-8 text-center hover:shadow-glow transition-all cursor-pointer gradient-card">
              <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Posture Check</h3>
              <p className="text-muted-foreground">Analyze your form with AI</p>
            </Card>
          </Link>

          <Link to="/exercises">
            <Card className="p-8 text-center hover:shadow-glow transition-all cursor-pointer gradient-card">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-bold mb-2">Browse Exercises</h3>
              <p className="text-muted-foreground">Explore our full exercise library</p>
            </Card>
          </Link>

          <Link to="/workout-log">
            <Card className="p-8 text-center hover:shadow-glow transition-all cursor-pointer gradient-card">
              <Activity className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-bold mb-2">Log Workout</h3>
              <p className="text-muted-foreground">Track your training session</p>
            </Card>
          </Link>

          <Link to="/nutrition">
            <Card className="p-8 text-center hover:shadow-glow transition-all cursor-pointer gradient-card">
              <Apple className="w-12 h-12 mx-auto mb-4 text-success" />
              <h3 className="text-xl font-bold mb-2">Log Meal</h3>
              <p className="text-muted-foreground">Track your daily nutrition</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-around p-4">
          <Link to="/dashboard" className="flex flex-col items-center text-primary">
            <Activity className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link to="/exercises" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
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

export default Dashboard;
