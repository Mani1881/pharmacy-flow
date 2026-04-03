import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, FileText, Shield, AlertTriangle } from "lucide-react";

const AUDIT_ENTRIES = [
  { id: "1", timestamp: "2025-04-02 18:45:23", user: "Dr. Priya Sharma", action: "SALE_COMPLETED", entity: "Sale #TX-89012", details: "Controlled medicine: Codeine 30mg × 2", severity: "high" },
  { id: "2", timestamp: "2025-04-02 17:32:11", user: "Mike Johnson", action: "STOCK_ADJUSTED", entity: "INV-4521", details: "Paracetamol 500mg: 890 → 870 (damage write-off)", severity: "medium" },
  { id: "3", timestamp: "2025-04-02 16:18:05", user: "James Okafor", action: "REORDER_APPROVED", entity: "RO-2025-0890", details: "Ibuprofen 400mg × 500 for Ikeja Mall", severity: "low" },
  { id: "4", timestamp: "2025-04-02 15:55:42", user: "Dr. Sarah Chen", action: "USER_ROLE_CHANGED", entity: "USR-0045", details: "Role changed: store_assistant → pharmacist", severity: "high" },
  { id: "5", timestamp: "2025-04-02 14:22:19", user: "System", action: "ANOMALY_DETECTED", entity: "OUT-SUR", details: "Unusual refund pattern at Surulere Central (₦45,000 in 2 hours)", severity: "critical" },
  { id: "6", timestamp: "2025-04-02 13:10:08", user: "Linda Park", action: "REPORT_EXPORTED", entity: "RPT-Q2-2025", details: "Financial summary Q2 exported as PDF", severity: "low" },
];

const severityConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
  critical: { variant: "destructive" },
  high: { variant: "default" },
  medium: { variant: "secondary" },
  low: { variant: "outline" },
};

export default function AuditLog() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Audit Log" description="Complete audit trail for compliance and traceability">
        <Badge variant="secondary" className="gap-1"><Shield className="h-3 w-3" /> Tamper-proof logging</Badge>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search audit entries..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Entity</TableHead>
                <TableHead className="hidden lg:table-cell">Details</TableHead>
                <TableHead>Severity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AUDIT_ENTRIES.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">{e.timestamp}</TableCell>
                  <TableCell className="text-sm">{e.user}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-mono">{e.action}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{e.entity}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs max-w-[250px] truncate">{e.details}</TableCell>
                  <TableCell><Badge variant={severityConfig[e.severity].variant} className="text-[10px]">{e.severity}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
