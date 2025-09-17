import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export interface FloodAlertData {
  id: string;
  level: "critical" | "warning" | "watch" | "safe";
  title: string;
  description: string;
  location: string;
  time: string;
}

interface FloodAlertProps {
  alert: FloodAlertData;
  onClick?: (alert: FloodAlertData) => void;
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    variant: "destructive" as const,
    badge: "Critical",
    className: "border-alert-critical shadow-alert"
  },
  warning: {
    icon: AlertCircle,
    variant: "default" as const,
    badge: "Warning", 
    className: "border-warning bg-warning/5"
  },
  watch: {
    icon: AlertCircle,
    variant: "default" as const,
    badge: "Watch",
    className: "border-accent bg-accent/5"
  },
  safe: {
    icon: CheckCircle,
    variant: "default" as const,
    badge: "Safe",
    className: "border-success bg-success/5"
  }
};

export function FloodAlert({ alert, onClick }: FloodAlertProps) {
  const config = alertConfig[alert.level];
  const Icon = config.icon;

  return (
    <Alert 
      variant={config.variant} 
      className={`${config.className} transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={() => onClick?.(alert)}
    >
      <Icon className="h-4 w-4" />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <AlertTitle className="flex items-center gap-2">
            {alert.title}
            <Badge variant="secondary" className="text-xs">
              {config.badge}
            </Badge>
          </AlertTitle>
          <AlertDescription className="mt-1">
            {alert.description}
          </AlertDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">{alert.location}</span> • {alert.time}
          </div>
        </div>
      </div>
    </Alert>
  );
}