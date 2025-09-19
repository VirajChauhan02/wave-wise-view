import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Droplets, AlertTriangle, Cloud, Sun, CloudRain } from "lucide-react";

interface FloodZone {
  id: string;
  name: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  waterLevel: string;
  lastUpdate: string;
  weather: string;
  temperature: string;
}

const zones: FloodZone[] = [
  {
    id: "1",
    name: "Downtown River District",
    riskLevel: "moderate",
    waterLevel: "4.2m",
    lastUpdate: "2 min ago",
    weather: "Cloudy",
    temperature: "28°C"
  },
  {
    id: "2", 
    name: "Industrial Zone East",
    riskLevel: "low",
    waterLevel: "2.8m",
    lastUpdate: "5 min ago",
    weather: "Sunny",
    temperature: "32°C"
  },
  {
    id: "3",
    name: "Residential Area North",
    riskLevel: "high",
    waterLevel: "6.1m", 
    lastUpdate: "1 min ago",
    weather: "Heavy Rain",
    temperature: "25°C"
  },
  {
    id: "4",
    name: "Agricultural Valley",
    riskLevel: "critical",
    waterLevel: "8.3m",
    lastUpdate: "Just now",
    weather: "Thunderstorm",
    temperature: "24°C"
  }
];

const riskColors = {
  low: "bg-success text-success-foreground",
  moderate: "bg-accent text-accent-foreground", 
  high: "bg-warning text-warning-foreground",
  critical: "bg-destructive text-destructive-foreground"
};

const riskIcons = {
  low: "text-success",
  moderate: "text-accent",
  high: "text-warning", 
  critical: "text-destructive"
};

export function FloodMap() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Weather & Flood Map
          </div>
          <Button variant="outline" size="sm" className="text-red-500">
            View Full Map
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-muted-foreground text-center">
              Real-time weather conditions and flood monitoring with water levels and risk assessments
            </p>
          </div>
          
          <div className="space-y-3">
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Droplets className={`h-4 w-4 ${riskIcons[zone.riskLevel]}`} />
                    {zone.riskLevel === "critical" && (
                      <AlertTriangle className="h-3 w-3 text-destructive absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Water: {zone.waterLevel} • {zone.weather} • {zone.temperature}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {zone.lastUpdate}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className={`${riskColors[zone.riskLevel]} text-xs`}>
                  {zone.riskLevel.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}