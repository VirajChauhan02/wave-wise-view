import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Home, Briefcase } from "lucide-react";

interface PrepStep {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  completed?: boolean;
}

const preparednessSteps: PrepStep[] = [
  {
    id: "1",
    title: "Create Emergency Kit",
    description: "Pack essentials: water, food, flashlight, radio, batteries, first aid supplies",
    priority: "high"
  },
  {
    id: "2", 
    title: "Plan Evacuation Route",
    description: "Know multiple routes to higher ground and designated evacuation centers",
    priority: "high"
  },
  {
    id: "3",
    title: "Sign Up for Alerts",
    description: "Register for local emergency notification systems and weather alerts",
    priority: "medium",
    completed: true
  },
  {
    id: "4",
    title: "Protect Important Documents",
    description: "Keep copies in waterproof containers or cloud storage",
    priority: "medium"
  },
  {
    id: "5",
    title: "Install Flood Sensors",
    description: "Consider basement water sensors and sump pump maintenance",
    priority: "low"
  }
];

const priorityStyles = {
  high: "border-l-4 border-l-destructive bg-destructive/5",
  medium: "border-l-4 border-l-warning bg-warning/5",
  low: "border-l-4 border-l-accent bg-accent/5"
};

export function FloodPreparedness() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Flood Preparedness
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-water-light/20 to-water-secondary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-water-primary" />
              <span className="font-semibold text-sm">Emergency Readiness Checklist</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Complete these steps to improve your flood preparedness
            </p>
          </div>
          
          <div className="space-y-3">
            {preparednessSteps.map((step) => (
              <div key={step.id} className={`p-3 rounded-lg ${priorityStyles[step.priority]} transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : step.priority === "high" ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium text-sm ${step.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {!step.completed && (
                    <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                      {step.priority === "high" ? "Urgent" : "Plan"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <Button 
              variant="water" 
              size="sm" 
              className="w-full"
              onClick={() => {
                const element = document.createElement('a');
                const file = new Blob(['EMERGENCY FLOOD GUIDE\n\n1. Emergency Kit Checklist\n- Water (1 gallon per person per day)\n- Non-perishable food (3-day supply)\n- Flashlight and extra batteries\n- First aid kit\n- Medications\n- Important documents in waterproof container\n\n2. Evacuation Plan\n- Know your evacuation routes\n- Identify higher ground locations\n- Keep vehicle fueled\n- Have emergency meeting points\n\n3. During a Flood\n- Move to higher ground immediately\n- Avoid walking/driving through flood water\n- Stay away from downed power lines\n- Listen to emergency broadcasts\n\n4. After a Flood\n- Return only when authorities say it is safe\n- Avoid flood water - it may be contaminated\n- Document damage with photos\n- Contact insurance company\n\nEmergency Contacts:\n- Emergency Services: 112\n- NDRF: 011-26701700\n- Local Emergency: 1077'], 
                  { type: 'text/plain' });
                element.href = URL.createObjectURL(file);
                element.download = 'Emergency_Flood_Guide.txt';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download Full Emergency Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}