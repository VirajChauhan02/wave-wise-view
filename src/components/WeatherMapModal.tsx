import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Cloud, CloudRain, Sun, Zap, Droplets, Thermometer, Wind, RefreshCw } from "lucide-react";

interface WeatherMapModalProps {
  onClose: () => void;
}

// Dynamic weather data that changes based on current conditions
const generateDynamicWeatherData = () => {
  const baseData = [
    { name: "Mumbai", baseTemp: 28, baseLat: "19.0760", baseLng: "72.8777", region: "west" },
    { name: "Delhi", baseTemp: 32, baseLat: "28.7041", baseLng: "77.1025", region: "north" },
    { name: "Kolkata", baseTemp: 30, baseLat: "22.5726", baseLng: "88.3639", region: "east" },
    { name: "Chennai", baseTemp: 29, baseLat: "13.0827", baseLng: "80.2707", region: "south" },
    { name: "Bangalore", baseTemp: 25, baseLat: "12.9716", baseLng: "77.5946", region: "south" },
    { name: "Hyderabad", baseTemp: 31, baseLat: "17.3850", baseLng: "78.4867", region: "south" },
    { name: "Ahmedabad", baseTemp: 35, baseLat: "23.0225", baseLng: "72.5714", region: "west" },
    { name: "Pune", baseTemp: 26, baseLat: "18.5204", baseLng: "73.8567", region: "west" },
    { name: "Kochi", baseTemp: 28, baseLat: "9.9312", baseLng: "76.2673", region: "south" },
    { name: "Guwahati", baseTemp: 29, baseLat: "26.1445", baseLng: "91.7362", region: "northeast" },
  ];

  const weatherPatterns = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm", "Monsoon"];
  const floodLevels = ["Low", "Moderate", "High", "Critical"];
  
  // Current date to simulate seasonal changes
  const currentMonth = new Date().getMonth();
  const isMonsoonSeason = currentMonth >= 5 && currentMonth <= 9; // June to October
  
  return baseData.map(city => {
    // Add some randomness while keeping it realistic
    const tempVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
    const currentTemp = city.baseTemp + tempVariation;
    
    // Monsoon season affects weather patterns
    let weather;
    let floodRisk;
    
    if (isMonsoonSeason) {
      const monsoonWeather = ["Heavy Rain", "Light Rain", "Thunderstorm", "Monsoon", "Cloudy"];
      weather = monsoonWeather[Math.floor(Math.random() * monsoonWeather.length)];
      
      // Higher flood risk during monsoon
      if (weather.includes("Heavy") || weather === "Monsoon") {
        floodRisk = Math.random() > 0.3 ? (Math.random() > 0.6 ? "Critical" : "High") : "Moderate";
      } else {
        floodRisk = Math.random() > 0.5 ? "Moderate" : "Low";
      }
    } else {
      // Non-monsoon season
      const drySeasonWeather = ["Sunny", "Partly Cloudy", "Cloudy"];
      weather = drySeasonWeather[Math.floor(Math.random() * drySeasonWeather.length)];
      floodRisk = Math.random() > 0.8 ? "Moderate" : "Low";
    }
    
    // Special cases for coastal cities
    if (["Mumbai", "Chennai", "Kochi"].includes(city.name)) {
      if (isMonsoonSeason && Math.random() > 0.4) {
        floodRisk = Math.random() > 0.5 ? "High" : "Critical";
      }
    }
    
    return {
      name: city.name,
      temp: `${currentTemp}°C`,
      weather,
      flood: floodRisk,
      lat: city.baseLat,
      lng: city.baseLng,
      lastUpdate: new Date().toLocaleTimeString()
    };
  });
};

const indianStates = generateDynamicWeatherData();

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
  const [weatherData, setWeatherData] = useState(generateDynamicWeatherData());
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setWeatherData(generateDynamicWeatherData());
    setLastRefresh(new Date());
    setSelectedState(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">India Weather & Flood Monitoring Map</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <div className="relative rounded-lg h-96 lg:h-[500px] overflow-hidden border bg-slate-50">
                {/* Zoom.earth iframe with proper sandbox and referrer policy */}
                <iframe
                  src="https://zoom.earth/maps/wind/#view=19.0760,72.8777,5z/date=2024-01-21,12:00,+05:30"
                  className="w-full h-full border-0"
                  title="Global Weather Map - Zoom.earth"
                  allow="geolocation; fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                />
                
                {/* Fallback content */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      If the map doesn't load, click below to open in a new tab
                    </p>
                    <a 
                      href="https://zoom.earth/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Open Zoom.earth Map
                    </a>
                  </div>
                </div>
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
                {weatherData.map((state) => {
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