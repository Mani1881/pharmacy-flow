import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, Bell, Shield, Database, Wifi } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Configure platform preferences and system settings" />

      <div className="grid gap-6 max-w-2xl">
        <SectionCard title="Notifications">
          <div className="space-y-4">
            {[
              { label: "Low stock alerts", desc: "Get notified when products fall below reorder level", default: true },
              { label: "Expiry warnings", desc: "Alert for products expiring within 90 days", default: true },
              { label: "Anomaly detection", desc: "AI-powered fraud and pattern detection alerts", default: true },
              { label: "Daily summary", desc: "Receive daily sales and performance digest", default: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch defaultChecked={item.default} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Offline mode</p>
                <p className="text-xs text-muted-foreground">Queue transactions when connectivity is limited</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-reorder</p>
                <p className="text-xs text-muted-foreground">Automatically submit reorder requests for critical stock</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Tax rate (%)</Label>
              <Input type="number" defaultValue="7.5" className="w-32" />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
