import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Cloud, AlertTriangle, CheckCircle, Thermometer, Droplets, Wind, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WeatherResult {
  location: string;
  status: string;
  alertLevel?: 'critical' | 'warning' | 'safe';
  weather?: {
    temperature: number;
    rainfall: number;
    windSpeed: number;
    humidity: number;
    description: string;
  };
}

export const WeatherMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [results, setResults] = useState<WeatherResult[]>([]);
  const { toast } = useToast();

  const runWeatherCheck = async () => {
    setIsMonitoring(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('weather-monitor');
      
      if (error) {
        throw error;
      }

      setResults(data.results || []);
      setLastCheck(new Date().toLocaleString());
      
      const alertCount = data.results?.filter((r: WeatherResult) => r.status === 'alert_sent').length || 0;
      
      toast({
        title: "Weather Check Complete",
        description: `Checked ${data.locationsChecked} locations. ${alertCount} alerts sent.`,
      });
    } catch (error: any) {
      console.error('Weather monitoring error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to run weather check",
        variant: "destructive",
      });
    } finally {
      setIsMonitoring(false);
    }
  };

  const getStatusIcon = (status: string, alertLevel?: string) => {
    if (status === 'alert_sent') {
      return alertLevel === 'critical' ? 
        <AlertTriangle className="h-4 w-4 text-red-500" /> :
        <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
    if (status === 'normal') {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <Cloud className="h-4 w-4 text-gray-500" />;
  };

  const getStatusBadge = (status: string, alertLevel?: string) => {
    if (status === 'alert_sent') {
      return (
        <Badge variant={alertLevel === 'critical' ? 'destructive' : 'default'} className="ml-2">
          {alertLevel?.toUpperCase()} ALERT
        </Badge>
      );
    }
    if (status === 'normal') {
      return <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">NORMAL</Badge>;
    }
    return <Badge variant="outline" className="ml-2">ERROR</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Automatic Weather Monitoring
          </div>
          <Button 
            onClick={runWeatherCheck}
            disabled={isMonitoring}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isMonitoring ? 'animate-spin' : ''}`} />
            {isMonitoring ? 'Checking...' : 'Check Now'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          This system automatically monitors weather conditions for all registered locations and sends alerts when dangerous conditions are detected.
        </div>

        {lastCheck && (
          <div className="text-sm text-muted-foreground">
            Last check: {lastCheck}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Latest Weather Check Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status, result.alertLevel)}
                  <div>
                    <div className="font-medium flex items-center">
                      {result.location}
                      {getStatusBadge(result.status, result.alertLevel)}
                    </div>
                    {result.weather && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {result.weather.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {result.weather && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      {result.weather.temperature}°C
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {result.weather.rainfall}mm
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      {result.weather.windSpeed.toFixed(1)} km/h
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {result.weather.humidity}%
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">How Automatic Alerts Work:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Critical Alert:</strong> Rainfall ≥50mm/hr OR Wind ≥80km/h OR Humidity ≥95%</li>
            <li>• <strong>Warning Alert:</strong> Rainfall ≥25mm/hr OR Wind ≥50km/h OR Humidity ≥85%</li>
            <li>• Real-time weather data from OpenWeatherMap API</li>
            <li>• Alerts sent automatically to registered users in affected areas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};