import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, MapPin } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  icon?: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-destructive" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-success" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {getTrendIcon()}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function FloodStats() {
  const stats = [
    {
      title: "Active Monitoring Stations",
      value: "847",
      change: "+12 from last month",
      trend: "up" as const,
      icon: <MapPin className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Current Alerts",
      value: "3",
      change: "-2 from yesterday",
      trend: "down" as const,
      icon: <Activity className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Risk Level",
      value: "Moderate",
      change: "Stable conditions",
      trend: "stable" as const,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Areas Monitored",
      value: "1,247",
      change: "+5 new areas",
      trend: "up" as const,
      icon: <MapPin className="h-4 w-4 text-muted-foreground" />
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}