import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormProps {
  onClose: () => void;
}

export const RegistrationForm = ({ onClose }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    notificationTypes: {
      email: false,
      sms: false,
      push: false
    },
    alertLevels: {
      critical: true,
      warning: false,
      safe: false
    }
  });

  const { toast } = useToast();

  const locations = [
    "Agricultural Valley",
    "Residential Area North", 
    "Industrial Zone East",
    "Downtown District",
    "Riverside Community",
    "Highland Suburbs",
    "Coastal Region"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.notificationTypes.email && !formData.notificationTypes.sms && !formData.notificationTypes.push) {
      toast({
        title: "Notification Method Required", 
        description: "Please select at least one notification method.",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration
    toast({
      title: "Registration Successful!",
      description: `Welcome ${formData.name}! You'll receive flood alerts for ${formData.location}.`,
    });

    // Reset form and close
    setFormData({
      name: "",
      email: "", 
      phone: "",
      location: "",
      notificationTypes: { email: false, sms: false, push: false },
      alertLevels: { critical: true, warning: false, safe: false }
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (category: 'notificationTypes' | 'alertLevels', field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: checked
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Register for Flood Alerts</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Personal Information
              </h3>
              
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select your area" />
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
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Notification Methods
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-notifications"
                    checked={formData.notificationTypes.email}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('notificationTypes', 'email', checked as boolean)
                    }
                  />
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms-notifications"
                    checked={formData.notificationTypes.sms}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('notificationTypes', 'sms', checked as boolean)
                    }
                  />
                  <Label htmlFor="sms-notifications">SMS Alerts</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push-notifications"
                    checked={formData.notificationTypes.push}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('notificationTypes', 'push', checked as boolean)
                    }
                  />
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                </div>
              </div>
            </div>

            {/* Alert Level Preferences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Alert Levels
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="critical-alerts"
                    checked={formData.alertLevels.critical}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('alertLevels', 'critical', checked as boolean)
                    }
                  />
                  <Label htmlFor="critical-alerts" className="text-destructive font-medium">
                    Critical Alerts (Recommended)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="warning-alerts"
                    checked={formData.alertLevels.warning}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('alertLevels', 'warning', checked as boolean)
                    }
                  />
                  <Label htmlFor="warning-alerts" className="text-amber-600">
                    Warning Alerts
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="safe-alerts"
                    checked={formData.alertLevels.safe}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('alertLevels', 'safe', checked as boolean)
                    }
                  />
                  <Label htmlFor="safe-alerts" className="text-green-600">
                    All Clear Notifications
                  </Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full bg-gradient-water hover:opacity-90 text-white">
                Register for Alerts
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};