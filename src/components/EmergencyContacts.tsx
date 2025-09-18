import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, AlertCircle, Shield } from "lucide-react";

interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
  priority: "emergency" | "urgent" | "general";
}

const contacts: Contact[] = [
  {
    name: "Emergency Response Center",
    role: "24/7 Flood Emergency",
    phone: "911",
    email: "emergency@floodwatch.gov",
    priority: "emergency"
  },
  {
    name: "Flood Warning Service",
    role: "Early Warning System",
    phone: "(555) 123-FLOOD", 
    email: "warnings@floodwatch.gov",
    priority: "urgent"
  },
  {
    name: "Public Works Department",
    role: "Infrastructure Support",
    phone: "(555) 456-7890",
    email: "works@city.gov",
    priority: "general"
  },
  {
    name: "Red Cross Disaster Relief",
    role: "Emergency Assistance",
    phone: "(555) 987-6543",
    email: "help@redcross.local",
    priority: "urgent"
  }
];

const priorityStyles = {
  emergency: "border-destructive bg-destructive/5",
  urgent: "border-warning bg-warning/5", 
  general: "border-border"
};

export function EmergencyContacts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className={`p-4 border rounded-lg ${priorityStyles[contact.priority]} transition-all hover:shadow-md`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{contact.name}</h3>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
                {contact.priority === "emergency" && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-mono">{contact.phone}</span>
                  {contact.priority === "emergency" && (
                    <Button size="sm" variant="destructive" className="ml-auto h-6 text-xs px-2">
                      Call Now
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{contact.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}