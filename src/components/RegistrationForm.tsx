import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Phone, Mail, MapPin, User, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationFormProps {
  onClose: () => void;
}

export const RegistrationForm = ({ onClose }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    state: "",
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

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const locations = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
    "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur", 
    "Nagpur", "Visakhapatnam", "Indore", "Thane", "Bhopal", "Patna",
    "Vadodara", "Ghaziabad", "Ludhiana", "Coimbatore", "Agra", "Madurai"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.location || !formData.state) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including state.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('user_registrations')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location,
          notification_email: formData.notificationTypes.email,
          notification_sms: formData.notificationTypes.sms,
          notification_push: formData.notificationTypes.push,
          alert_critical: formData.alertLevels.critical,
          alert_warning: formData.alertLevels.warning,
          alert_safe: formData.alertLevels.safe,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: "Error",
          description: "Failed to save registration. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Send confirmation email
      const notificationPreferences = Object.entries(formData.notificationTypes)
        .filter(([_, enabled]) => enabled)
        .map(([type, _]) => type.charAt(0).toUpperCase() + type.slice(1));
      
      const alertLevels = Object.entries(formData.alertLevels)
        .filter(([_, enabled]) => enabled)
        .map(([level, _]) => level.charAt(0).toUpperCase() + level.slice(1));

      const { error: emailError } = await supabase.functions.invoke('send-registration-email', {
        body: {
          name: formData.name,
          email: formData.email,
          location: formData.location,
          state: formData.state,
          notificationPreferences,
          alertLevels
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't show error to user as registration was successful
      }

      toast({
        title: "Registration Successful!",
        description: "You have been registered for flood alerts. Check your email for confirmation.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        state: "",
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

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
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
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name *
                </Label>
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
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  City *
                </Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
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

              {/* State Selection */}
              <div>
                <Label htmlFor="state" className="flex items-center gap-2">
                  <Map className="h-4 w-4" />
                  State *
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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