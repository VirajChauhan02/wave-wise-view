import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Video, ExternalLink } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "video" | "document" | "website";
  url?: string;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Flood Safety Guidelines",
    description: "Complete guide on flood safety measures and evacuation procedures",
    type: "guide"
  },
  {
    id: "2",
    title: "Emergency Contact Directory",
    description: "Comprehensive list of emergency services and helpline numbers",
    type: "document"
  },
  {
    id: "3",
    title: "Flood Preparedness Video",
    description: "Step-by-step video guide for flood preparation",
    type: "video"
  },
  {
    id: "4",
    title: "India Meteorological Department",
    description: "Official weather forecasts and flood warnings",
    type: "website",
    url: "https://mausam.imd.gov.in"
  },
  {
    id: "5",
    title: "NDRF Guidelines",
    description: "National Disaster Response Force safety protocols",
    type: "document"
  }
];

const typeIcons = {
  guide: BookOpen,
  video: Video,
  document: FileText,
  website: ExternalLink
};

export function Resources() {
  return (
    <Card className="h-full" id="resources">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Emergency Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Essential resources for flood preparedness and emergency response
          </p>
          
          <div className="space-y-3">
            {resources.map((resource) => {
              const IconComponent = typeIcons[resource.type];
              return (
                <div key={resource.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium text-sm">{resource.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                      {resource.type === "website" ? "Visit" : "View"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}