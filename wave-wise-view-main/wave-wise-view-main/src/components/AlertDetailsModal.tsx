import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloodAlertData } from "./FloodAlert";
import { X, MapPin, Clock, AlertTriangle, Info, Phone } from "lucide-react";

interface AlertDetailsModalProps {
  alert: FloodAlertData;
  onClose: () => void;
}

const areaDetails = {
  "Agricultural Valley": {
    state: "California",
    population: "12,500",
    riskLevel: "High",
    lastFlood: "March 2023",
    evacuationRoutes: ["Highway 101 North", "County Road 15 East"],
    shelters: ["Valley Community Center", "St. Mary's Church"],
    description: "Low-lying agricultural area prone to rapid flooding due to river overflow."
  },
  "Residential Area North": {
    state: "California", 
    population: "8,200",
    riskLevel: "Medium",
    lastFlood: "January 2022",
    evacuationRoutes: ["Main Street West", "Oak Avenue South"],
    shelters: ["North Elementary School", "City Recreation Center"],
    description: "Suburban residential area with moderate flood risk from seasonal rainfall."
  },
  "Industrial Zone East": {
    state: "California",
    population: "3,800",
    riskLevel: "Low",
    lastFlood: "2019",
    evacuationRoutes: ["Industrial Parkway", "Commerce Drive"],
    shelters: ["East Side Fire Station", "Commerce Plaza"],
    description: "Industrial district with good drainage infrastructure and lower flood risk."
  },
  "Downtown District": {
    state: "California",
    population: "15,000",
    riskLevel: "Medium",
    lastFlood: "2021",
    evacuationRoutes: ["Central Avenue", "First Street Bridge"],
    shelters: ["City Hall", "Downtown Library"],
    description: "Urban center with mixed commercial and residential areas."
  }
};

export const AlertDetailsModal = ({ alert, onClose }: AlertDetailsModalProps) => {
  const details = areaDetails[alert.location as keyof typeof areaDetails] || {
    state: "California",
    population: "Unknown",
    riskLevel: "Medium",
    lastFlood: "Unknown",
    evacuationRoutes: ["Check local authorities"],
    shelters: ["Contact emergency services"],
    description: "Area details not available."
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive/10 border-destructive text-destructive';
      case 'warning': return 'bg-warning/10 border-warning text-warning';
      case 'safe': return 'bg-success/10 border-success text-success';
      default: return 'bg-muted/10 border-muted text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-bold">{alert.location}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{details.state}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Alert Status */}
          <div className={`p-4 rounded-lg border ${getAlertColor(alert.level)}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-semibold text-lg">{alert.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {alert.level.toUpperCase()}
              </Badge>
            </div>
            <p className="mb-3">{alert.description}</p>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              <span>{alert.time}</span>
            </div>
          </div>

          {/* Area Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Area Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Population:</span>
                  <span className="font-medium">{details.population}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <span className={`font-medium ${getRiskColor(details.riskLevel)}`}>
                    {details.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Major Flood:</span>
                  <span className="font-medium">{details.lastFlood}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Details
              </h3>
              <p className="text-sm text-muted-foreground">
                {details.description}
              </p>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency Information
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-sm mb-2">Evacuation Routes</h4>
                <ul className="space-y-1">
                  {details.evacuationRoutes.map((route, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {route}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Emergency Shelters</h4>
                <ul className="space-y-1">
                  {details.shelters.map((shelter, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {shelter}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1" variant="default">
              Get Directions
            </Button>
            <Button className="flex-1" variant="outline">
              Call Emergency Services
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};