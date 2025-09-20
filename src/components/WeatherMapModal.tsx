import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Cloud, CloudRain, Sun, Zap, Droplets, Thermometer, Wind } from "lucide-react";

interface WeatherMapModalProps {
  onClose: () => void;
}

const indianStates = [
  { name: "Mumbai", temp: "28°C", weather: "Heavy Rain", flood: "High", lat: "19.0760", lng: "72.8777" },
  { name: "Delhi", temp: "35°C", weather: "Cloudy", flood: "Low", lat: "28.7041", lng: "77.1025" },
  { name: "Kolkata", temp: "32°C", weather: "Thunderstorm", flood: "Critical", lat: "22.5726", lng: "88.3639" },
  { name: "Chennai", temp: "30°C", weather: "Sunny", flood: "Moderate", lat: "13.0827", lng: "80.2707" },
  { name: "Bangalore", temp: "26°C", weather: "Light Rain", flood: "Low", lat: "12.9716", lng: "77.5946" },
  { name: "Hyderabad", temp: "29°C", weather: "Partly Cloudy", flood: "Low", lat: "17.3850", lng: "78.4867" },
  { name: "Ahmedabad", temp: "38°C", weather: "Sunny", flood: "Low", lat: "23.0225", lng: "72.5714" },
  { name: "Pune", temp: "27°C", weather: "Heavy Rain", flood: "High", lat: "18.5204", lng: "73.8567" },
  { name: "Kochi", temp: "29°C", weather: "Monsoon", flood: "Critical", lat: "9.9312", lng: "76.2673" },
  { name: "Guwahati", temp: "31°C", weather: "Heavy Rain", flood: "High", lat: "26.1445", lng: "91.7362" }
];

const getWeatherIcon = (weather: string) => {
  if (weather.includes("Rain") || weather.includes("Monsoon")) return CloudRain;
  if (weather.includes("Thunder")) return Zap;
  if (weather.includes("Cloudy")) return Cloud;
  return Sun;
};

const getFloodColor = (flood: string) => {
  switch (flood) {
    case "Critical": return "bg-destructive text-destructive-foreground";
    case "High": return "bg-warning text-warning-foreground";
    case "Moderate": return "bg-accent text-accent-foreground";
    default: return "bg-success text-success-foreground";
  }
};

export const WeatherMapModal = ({ onClose }: WeatherMapModalProps) => {
  const [selectedState, setSelectedState] = useState<typeof indianStates[0] | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">India Weather & Flood Monitoring Map</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg h-96 lg:h-[500px] overflow-hidden border">
                {/* Zoom.earth iframe */}
                <iframe
                  src="https://zoom.earth/"
                  className="w-full h-full border-0"
                  title="Global Weather Map - Zoom.earth"
                  allow="geolocation"
                />
              </div>
            </div>

            {/* Details Panel */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Current Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  Live weather and flood monitoring across major Indian cities
                </p>
              </div>

              {selectedState ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{selectedState.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Temperature: {selectedState.temp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const WeatherIcon = getWeatherIcon(selectedState.weather);
                        return <WeatherIcon className="h-4 w-4 text-blue-600" />;
                      })()}
                      <span className="text-sm">Weather: {selectedState.weather}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Flood Risk: </span>
                      <Badge className={getFloodColor(selectedState.flood)} variant="secondary">
                        {selectedState.flood}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Click on any weather point on the map to view detailed information
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">All Cities Status</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {indianStates.map((state) => {
                    const WeatherIcon = getWeatherIcon(state.weather);
                    return (
                      <div 
                        key={state.name}
                        className="flex items-center justify-between p-2 rounded border hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedState(state)}
                      >
                        <div className="flex items-center gap-2">
                          <WeatherIcon className="h-3 w-3" />
                          <span className="text-sm font-medium">{state.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{state.temp}</span>
                          <Badge className={`text-xs ${getFloodColor(state.flood)}`} variant="secondary">
                            {state.flood}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};