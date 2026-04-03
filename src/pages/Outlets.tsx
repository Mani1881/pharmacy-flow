import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Phone } from "lucide-react";

const OUTLETS = [
  { id: "1", name: "Downtown Pharmacy", region: "Lagos Central", address: "42 Marina Rd, Lagos Island", staff: 8, status: "online", phone: "+234 801 234 5678" },
  { id: "2", name: "Ikeja Mall Branch", region: "Lagos North", address: "Ikeja City Mall, Alausa", staff: 6, status: "online", phone: "+234 802 345 6789" },
  { id: "3", name: "Victoria Island", region: "Lagos Central", address: "1A Adeola Odeku, VI", staff: 7, status: "online", phone: "+234 803 456 7890" },
  { id: "4", name: "Lekki Phase 1", region: "Lagos East", address: "15 Admiralty Way, Lekki", staff: 5, status: "offline", phone: "+234 804 567 8901" },
  { id: "5", name: "Surulere Central", region: "Lagos West", address: "28 Adeniran Ogunsanya", staff: 6, status: "online", phone: "+234 805 678 9012" },
  { id: "6", name: "Ajah Gateway", region: "Lagos East", address: "Abraham Adesanya, Ajah", staff: 4, status: "limited", phone: "+234 806 789 0123" },
];

export default function Outlets() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Outlets" description="Manage your 38 pharmacy outlets across all regions" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {OUTLETS.map(o => (
          <div key={o.id} className="glass-card stat-card-hover rounded-xl p-5 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{o.name}</h3>
                  <p className="text-xs text-muted-foreground">{o.region}</p>
                </div>
              </div>
              <Badge variant={o.status === "online" ? "secondary" : o.status === "offline" ? "destructive" : "default"} className="text-[10px]">
                {o.status}
              </Badge>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{o.address}</div>
              <div className="flex items-center gap-2"><Users className="h-3 w-3" />{o.staff} staff members</div>
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{o.phone}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
