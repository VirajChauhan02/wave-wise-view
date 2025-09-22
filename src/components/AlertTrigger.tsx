import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AlertTriggerProps {
  onClose?: () => void;
}

export const AlertTrigger = ({ onClose }: AlertTriggerProps) => {
  const [alertData, setAlertData] = useState({
    location: "",
    alertLevel: "warning" as 'critical' | 'warning' | 'safe',
    title: "",
    message: "",
    waterLevel: "",
    rainfall: "",
    temperature: "",
    windSpeed: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
    "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur", 
    "Nagpur", "Visakhapatnam", "Indore", "Thane", "Bhopal", "Patna",
    "Vadodara", "Ghaziabad", "Ludhiana", "Coimbatore", "Agra", "Madurai"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alertData.location || !alertData.title || !alertData.message) {
      toast({
        title: "Error",
        description: "Please fill in location, title, and message fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const conditions = {
        ...(alertData.waterLevel && { waterLevel: alertData.waterLevel }),
        ...(alertData.rainfall && { rainfall: alertData.rainfall }),
        ...(alertData.temperature && { temperature: alertData.temperature }),
        ...(alertData.windSpeed && { windSpeed: alertData.windSpeed })
      };

      const { data, error } = await supabase.functions.invoke('send-location-alerts', {
        body: {
          location: alertData.location,
          alertLevel: alertData.alertLevel,
          title: alertData.title,
          message: alertData.message,
          conditions: Object.keys(conditions).length > 0 ? conditions : undefined
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Alert Sent Successfully!",
        description: `${data.emailsSent} users in ${alertData.location} have been notified.`,
      });

      // Reset form
      setAlertData({
        location: "",
        alertLevel: "warning",
        title: "",
        message: "",
        waterLevel: "",
        rainfall: "",
        temperature: "",
        windSpeed: ""
      });

      if (onClose) {
        setTimeout(() => onClose(), 2000);
      }
    } catch (error: any) {
      console.error('Alert sending error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAlertData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Send Location-Based Alert
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Alert Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location *
              </Label>
              <Select value={alertData.location} onValueChange={(value) => handleInputChange('location', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alertLevel">Alert Level *</Label>
              <Select value={alertData.alertLevel} onValueChange={(value: 'critical' | 'warning' | 'safe') => handleInputChange('alertLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">🚨 Critical</SelectItem>
                  <SelectItem value="warning">⚠️ Warning</SelectItem>
                  <SelectItem value="safe">✅ All Clear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Alert Title *</Label>
            <Input
              id="title"
              value={alertData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Heavy Rainfall Alert"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Alert Message *</Label>
            <Textarea
              id="message"
              value={alertData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Detailed message about the flood conditions and recommended actions..."
              className="mt-1 min-h-24"
            />
          </div>

          {/* Current Conditions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Current Conditions (Optional)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="waterLevel">Water Level</Label>
                <Input
                  id="waterLevel"
                  value={alertData.waterLevel}
                  onChange={(e) => handleInputChange('waterLevel', e.target.value)}
                  placeholder="e.g., 5.2m above normal"
                />
              </div>

              <div>
                <Label htmlFor="rainfall">Rainfall</Label>
                <Input
                  id="rainfall"
                  value={alertData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  placeholder="e.g., 150mm in last 24h"
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  value={alertData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  placeholder="e.g., 28°C"
                />
              </div>

              <div>
                <Label htmlFor="windSpeed">Wind Speed</Label>
                <Input
                  id="windSpeed"
                  value={alertData.windSpeed}
                  onChange={(e) => handleInputChange('windSpeed', e.target.value)}
                  placeholder="e.g., 45 km/h"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-water hover:opacity-90 text-white"
              disabled={isLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Sending Alert..." : "Send Alert to Location"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};