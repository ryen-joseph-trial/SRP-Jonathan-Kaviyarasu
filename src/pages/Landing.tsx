import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, TrendingUp, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Fitness</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            SmartFitness
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your intelligent fitness companion that analyzes posture, tracks progress, and guides you to achieve your goals
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-white shadow-glow hover:opacity-90 transition-all text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/exercises">
              <Button size="lg" variant="outline" className="border-2 text-lg px-8 py-6">
                Explore Exercises
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to <span className="gradient-primary bg-clip-text text-transparent">Succeed</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-2xl gradient-card backdrop-blur-sm border border-border shadow-card hover:shadow-glow transition-all">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 gradient-accent opacity-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join SmartFitness today and experience the future of fitness tracking
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-primary text-white shadow-glow text-lg px-8 py-6">
              Start Free Today <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <Dumbbell className="w-6 h-6 text-white" />,
    title: "Exercise Library",
    description: "Access hundreds of exercises with video guides and form tips",
  },
  {
    icon: <Target className="w-6 h-6 text-white" />,
    title: "AI Posture Check",
    description: "Real-time posture analysis to perfect your form and prevent injury",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "Progress Tracking",
    description: "Detailed analytics and insights on your fitness journey",
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "Smart Nutrition",
    description: "Track calories and macros with personalized recommendations",
  },
];

export default Landing;
