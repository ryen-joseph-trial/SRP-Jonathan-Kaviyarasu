import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Activity, Apple, Dumbbell, Menu, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PostureAnalysis = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [setCount, setSetCount] = useState(1);
  const [feedback, setFeedback] = useState<{type: 'good' | 'warning', message: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
        setIsStreaming(true);
        toast({
          title: "Camera Started",
          description: "Position yourself in frame and start monitoring",
        });
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use posture analysis",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
      setAnalyzing(false);
      setIsMonitoring(false);
      setFeedback(null);
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
        monitoringInterval.current = null;
      }
    }
  };

  const analyzePosture = () => {
    setAnalyzing(true);
    setFeedback(null);
    
    // Simulate AI analysis
    setTimeout(() => {
      const feedbacks = [
        { type: 'good' as const, message: 'Great posture! Your spine alignment looks excellent. Keep it up!' },
        { type: 'warning' as const, message: 'Try to keep your shoulders back and chest open. Avoid slouching forward.' },
        { type: 'good' as const, message: 'Perfect form! Your core is engaged and your back is straight.' },
        { type: 'warning' as const, message: 'Tilt your head slightly up. Looking down can strain your neck.' },
        { type: 'good' as const, message: 'Excellent! Your weight is evenly distributed. Maintain this position.' },
        { type: 'warning' as const, message: 'Keep your knees slightly bent to reduce lower back tension.' },
      ];
      
      const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
      setFeedback(randomFeedback);
      setAnalyzing(false);
    }, 2000);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setRepCount(0);
    toast({
      title: "Monitoring Started",
      description: "Real-time posture monitoring active",
    });

    // Simulate real-time rep counting
    monitoringInterval.current = setInterval(() => {
      const shouldCountRep = Math.random() > 0.7;
      if (shouldCountRep) {
        setRepCount(prev => {
          const newRep = prev + 1;
          if (newRep % 10 === 0) {
            setSetCount(s => s + 1);
            toast({
              title: "Set Complete!",
              description: `Great job! Moving to set ${Math.floor(newRep / 10) + 1}`,
            });
          }
          return newRep;
        });
      }

      // Simulate feedback
      const feedbacks = [
        { type: 'good' as const, message: 'Perfect form! Keep your core tight.' },
        { type: 'warning' as const, message: 'Lower your hips slightly for better form.' },
        { type: 'good' as const, message: 'Excellent range of motion!' },
        { type: 'warning' as const, message: 'Keep your back straight throughout the movement.' },
      ];
      
      if (Math.random() > 0.5) {
        const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        setFeedback(randomFeedback);
      }
    }, 3000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }
    toast({
      title: "Monitoring Stopped",
      description: `Session complete: ${repCount} reps across ${setCount} sets`,
    });
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="gradient-primary text-white p-6 shadow-glow">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Posture Analysis</h1>
          <p className="text-white/80">Real-time AI-powered posture feedback</p>
        </div>
      </header>

      {/* Camera View */}
      <div className="max-w-4xl mx-auto px-6 mt-6">
        <Card className="p-6 shadow-card">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-video mb-6">
            {isStreaming ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ display: 'block' }}
                />
                {analyzing && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                      <p className="text-lg font-semibold">Analyzing your posture...</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Camera is off</p>
                  <p className="text-sm mt-2">Click "Start Camera" to begin</p>
                </div>
              </div>
            )}
          </div>

          {/* Rep Counter */}
          {isStreaming && isMonitoring && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 text-center bg-primary/10">
                <div className="text-4xl font-bold text-primary">{repCount}</div>
                <div className="text-sm text-muted-foreground">Reps</div>
              </Card>
              <Card className="p-4 text-center bg-secondary/10">
                <div className="text-4xl font-bold text-secondary">{setCount}</div>
                <div className="text-sm text-muted-foreground">Sets</div>
              </Card>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 mb-6">
            {!isStreaming ? (
              <Button 
                onClick={startCamera} 
                className="gradient-primary text-white flex-1"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button 
                  onClick={stopCamera} 
                  variant="outline" 
                  className="flex-1"
                >
                  <CameraOff className="w-5 h-5 mr-2" />
                  Stop Camera
                </Button>
                {!isMonitoring ? (
                  <>
                    <Button 
                      onClick={analyzePosture} 
                      disabled={analyzing}
                      variant="outline"
                      className="flex-1"
                    >
                      {analyzing ? 'Analyzing...' : 'Quick Check'}
                    </Button>
                    <Button 
                      onClick={startMonitoring} 
                      className="gradient-primary text-white flex-1"
                    >
                      Start Monitoring
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={stopMonitoring} 
                    className="gradient-accent text-white flex-1"
                  >
                    Stop Monitoring
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <Card className={`p-4 ${feedback.type === 'good' ? 'bg-success/10 border-success' : 'bg-secondary/10 border-secondary'}`}>
              <div className="flex items-start gap-3">
                {feedback.type === 'good' ? (
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-semibold mb-1">
                    {feedback.type === 'good' ? 'Good Posture!' : 'Posture Tip'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feedback.message}</p>
                </div>
              </div>
            </Card>
          )}
        </Card>

        {/* Tips */}
        <Card className="p-6 mt-6 shadow-card">
          <h3 className="text-xl font-bold mb-4">Posture Analysis Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-primary mt-1">1</Badge>
              <p className="text-sm text-muted-foreground">Position yourself in a well-lit area for best results</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-primary mt-1">2</Badge>
              <p className="text-sm text-muted-foreground">Stand or sit with your full upper body visible in frame</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-primary mt-1">3</Badge>
              <p className="text-sm text-muted-foreground">Take the analysis while maintaining your natural posture</p>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-primary mt-1">4</Badge>
              <p className="text-sm text-muted-foreground">Regular posture checks can help prevent injuries and improve form</p>
            </div>
          </div>
        </Card>
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
          <Link to="/posture" className="flex flex-col items-center text-primary">
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

export default PostureAnalysis;
