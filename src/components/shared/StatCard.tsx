import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor, subtitle }: StatCardProps) {
  return (
    <div className="holo-panel stat-card-hover kpi-glow rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {change && (
            <p className={cn("text-xs font-medium", {
              "text-success": changeType === "positive",
              "text-destructive": changeType === "negative",
              "text-muted-foreground": changeType === "neutral",
            })}>
              {change}
            </p>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconColor || "bg-primary/10")}>
          <Icon className={cn("h-5 w-5", iconColor ? "text-primary-foreground" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function SectionCard({ title, children, className, action }: { title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <div className={cn("holo-panel rounded-2xl", className)}>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <h3 className="font-semibold text-sm">{title}</h3>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
