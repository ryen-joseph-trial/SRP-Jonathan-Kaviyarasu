import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, getMeals, addMeal, Meal } from "@/lib/storage";
import { Activity, Apple, Dumbbell, Menu, Plus, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Nutrition = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [mealForm, setMealForm] = useState({
    type: 'breakfast' as Meal['type'],
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    setMeals(getMeals(user.id, today));
  }, [user, navigate]);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newMeal = addMeal({
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      type: mealForm.type,
      name: mealForm.name,
      calories: Number(mealForm.calories),
      protein: Number(mealForm.protein),
      carbs: Number(mealForm.carbs),
      fat: Number(mealForm.fat),
    });

    setMeals([...meals, newMeal]);
    setMealForm({
      type: 'breakfast',
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
    setShowAddMeal(false);
    toast.success("Meal logged successfully!");
  };

  const totalNutrition = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="gradient-primary text-white p-6 shadow-glow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Nutrition Tracker</h1>
          <p className="text-white/80">Track your daily intake</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Daily Summary */}
        <Card className="p-6 mb-8 shadow-card">
          <h2 className="text-2xl font-bold mb-6">Today's Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalNutrition.calories}</div>
              <div className="text-sm text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{totalNutrition.protein}g</div>
              <div className="text-sm text-muted-foreground">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{totalNutrition.carbs}g</div>
              <div className="text-sm text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{totalNutrition.fat}g</div>
              <div className="text-sm text-muted-foreground">Fat</div>
            </div>
          </div>
        </Card>

        {/* Add Meal Button */}
        {!showAddMeal && (
          <Button
            onClick={() => setShowAddMeal(true)}
            className="w-full mb-6 gradient-primary text-white shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Meal
          </Button>
        )}

        {/* Add Meal Form */}
        {showAddMeal && (
          <Card className="p-6 mb-8 shadow-card">
            <h3 className="text-xl font-bold mb-4">Log New Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Meal Type</Label>
                <Select value={mealForm.type} onValueChange={(value) => setMealForm({...mealForm, type: value as Meal['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <Input
                  id="name"
                  value={mealForm.name}
                  onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                  required
                  placeholder="e.g., Grilled Chicken Salad"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={mealForm.calories}
                    onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={mealForm.protein}
                    onChange={(e) => setMealForm({...mealForm, protein: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={mealForm.carbs}
                    onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={mealForm.fat}
                    onChange={(e) => setMealForm({...mealForm, fat: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 gradient-primary text-white">
                  Add Meal
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddMeal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Meals List */}
        <h2 className="text-2xl font-bold mb-4">Today's Meals</h2>
        <div className="space-y-4">
          {meals.map(meal => (
            <Card key={meal.id} className="p-6 shadow-card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{meal.name}</h3>
                <span className="text-sm text-muted-foreground capitalize">{meal.type}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Cal:</span> {meal.calories}
                </div>
                <div>
                  <span className="text-muted-foreground">P:</span> {meal.protein}g
                </div>
                <div>
                  <span className="text-muted-foreground">C:</span> {meal.carbs}g
                </div>
                <div>
                  <span className="text-muted-foreground">F:</span> {meal.fat}g
                </div>
              </div>
            </Card>
          ))}

          {meals.length === 0 && (
            <Card className="p-12 text-center shadow-card">
              <Apple className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No meals logged today</p>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-around p-4">
          <Link to="/dashboard" className="flex flex-col items-center text-muted-foreground hover:text-foreground">
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
          <Link to="/nutrition" className="flex flex-col items-center text-primary">
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

export default Nutrition;
