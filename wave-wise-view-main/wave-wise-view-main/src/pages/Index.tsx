import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { RegistrationForm } from "@/components/RegistrationForm";
import { AlertDetailsModal } from "@/components/AlertDetailsModal";
import { FloodAlert, FloodAlertData } from "@/components/FloodAlert";
import { FloodStats } from "@/components/FloodStats";
import { FloodMap } from "@/components/FloodMap";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { FloodPreparedness } from "@/components/FloodPreparedness";
import { Waves, AlertTriangle, Shield, RefreshCw } from "lucide-react";
import heroImage from "@/assets/flood-hero.jpg";

const currentAlerts: FloodAlertData[] = [
  {
    id: "1",
    level: "critical",
    title: "Flash Flood Warning",
    description: "Immediate evacuation recommended for Agricultural Valley area. Water levels rising rapidly.",
    location: "Agricultural Valley",
    time: "2 minutes ago"
  },
  {
    id: "2", 
    level: "warning",
    title: "Flood Watch Active",
    description: "Heavy rainfall expected. Monitor conditions and prepare for possible evacuation.",
    location: "Residential Area North",
    time: "15 minutes ago"
  },
  {
    id: "3",
    level: "safe",
    title: "All Clear",
    description: "Water levels returning to normal. Cleanup operations can begin safely.",
    location: "Industrial Zone East",
    time: "1 hour ago"
  }
];

const Index = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<FloodAlertData | null>(null);

  const handleAlertClick = (alert: FloodAlertData) => {
    setSelectedAlert(alert);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-water-light/20 to-background">
      <Navbar onRegisterClick={() => setShowRegistrationForm(true)} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-80 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-water-primary/80 to-water-secondary/60" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-bold mb-4">
                Advanced Flood Monitoring & Alert System
              </h1>
              <p className="text-lg mb-6 text-white/90">
                Real-time water level monitoring, early warning alerts, and emergency response coordination 
                to protect communities from flood disasters.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" size="lg">
                  <Shield className="h-4 w-4" />
                  Emergency Info
                </Button>
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  View Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        {/* Critical Alerts */}
        {currentAlerts.some(alert => alert.level === "critical") && (
          <div className="mb-8">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                <h2 className="font-bold text-lg">Critical Flood Alerts</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Immediate attention required. Follow emergency procedures.
              </p>
              <div className="space-y-3">
                {currentAlerts
                  .filter(alert => alert.level === "critical")
                  .map(alert => (
                    <FloodAlert 
                      key={alert.id} 
                      alert={alert}
                      onClick={handleAlertClick}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="mb-8">
          <FloodStats />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Alerts and Map */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Alerts */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Waves className="h-6 w-6 text-water-primary" />
                Current Flood Alerts
              </h2>
              <div className="space-y-3">
                {currentAlerts.map(alert => (
                  <FloodAlert 
                    key={alert.id} 
                    alert={alert} 
                    onClick={handleAlertClick}
                  />
                ))}
              </div>
            </div>

            {/* Flood Risk Map */}
            <div>
              <FloodMap />
            </div>
          </div>

          {/* Right Column - Emergency Info and Preparedness */}
          <div className="space-y-6">
            <EmergencyContacts />
            <FloodPreparedness />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <p>© 2024 FloodWatch System. Last updated: {new Date().toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                API Status: Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                Data Accuracy: 99.2%
              </Badge>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      {showRegistrationForm && (
        <RegistrationForm onClose={() => setShowRegistrationForm(false)} />
      )}
      
      {selectedAlert && (
        <AlertDetailsModal 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)} 
        />
      )}
    </div>
  );
};

export default Index;