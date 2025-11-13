import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill, Bell, Calendar } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Stay on track with your medicines
          </p>
        </div>

        <div className="grid gap-4">
          <Card className="p-6 rounded-xl shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Pill className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  No medicines added yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add your first medicine to start tracking
                </p>
                <Button className="rounded-xl">
                  Add Medicine
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-foreground">Reminders</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">Active today</p>
            </Card>

            <Card className="p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Streak</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">0 days</p>
              <p className="text-sm text-muted-foreground">Keep it up!</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
