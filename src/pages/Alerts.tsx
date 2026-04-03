import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";

const ALERTS = [
  { id: "1", type: "stockout", title: "Critical Stock: Amoxicillin 500mg", msg: "Stock at 24 units across Downtown, Ikeja, and V.Island. Estimated 2.9 days supply remaining.", time: "12 min ago", status: "active" },
  { id: "2", type: "expiry", title: "47 Products Expiring in 30 Days", msg: "Codeine Phosphate 30mg (Batch B2024-0102) expires Apr 30 at Downtown Pharmacy. 8 units remain.", time: "1 hour ago", status: "active" },
  { id: "3", type: "anomaly", title: "Unusual Refund Pattern Detected", msg: "Surulere Central processed ₦45,000 in refunds within 2 hours — 3x above normal. Flagged for review.", time: "3 hours ago", status: "active" },
  { id: "4", type: "connectivity", title: "Lekki Phase 1 Offline", msg: "POS terminal has been unreachable for 45 minutes. Last sync: 2:15 PM. Queued transactions: 3.", time: "45 min ago", status: "active" },
  { id: "5", type: "reorder", title: "Auto-Reorder Triggered", msg: "Automatic reorder for Ibuprofen 400mg (500 units) submitted for Ikeja Mall based on demand forecast.", time: "2 hours ago", status: "resolved" },
];

const typeConfig: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  stockout: { icon: AlertTriangle, color: "text-destructive" },
  expiry: { icon: Clock, color: "text-warning" },
  anomaly: { icon: XCircle, color: "text-destructive" },
  connectivity: { icon: XCircle, color: "text-warning" },
  reorder: { icon: CheckCircle, color: "text-success" },
};

export default function Alerts() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Alerts & Notifications" description="Real-time alerts for stock, expiry, anomalies, and connectivity" />

      <div className="space-y-3">
        {ALERTS.map(a => {
          const config = typeConfig[a.type];
          return (
            <div key={a.id} className={`glass-card rounded-xl p-5 ${a.status === "resolved" ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-4">
                <config.icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{a.title}</h3>
                    <Badge variant={a.status === "active" ? "destructive" : "secondary"} className="text-[10px]">{a.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.msg}</p>
                  <p className="text-xs text-muted-foreground mt-2">{a.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
