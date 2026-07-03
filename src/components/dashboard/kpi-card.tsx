import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-secondary p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              trend.positive ? "text-green-600" : "text-accent",
            )}
          >
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
