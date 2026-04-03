import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, CheckCircle, Clock, Plus, ArrowRight } from "lucide-react";

const ORDERS = [
  { id: "RO-2025-0891", product: "Amoxicillin 500mg", outlet: "Downtown Pharmacy", qty: 200, status: "pending", date: "2025-04-02", requestedBy: "Dr. Priya Sharma" },
  { id: "RO-2025-0890", product: "Ibuprofen 400mg", outlet: "Ikeja Mall", qty: 500, status: "approved", date: "2025-04-01", requestedBy: "James Okafor" },
  { id: "RO-2025-0889", product: "Vitamin C 1000mg", outlet: "Surulere Central", qty: 300, status: "dispatched", date: "2025-03-31", requestedBy: "Mike Johnson" },
  { id: "RO-2025-0888", product: "Metformin 500mg", outlet: "Victoria Island", qty: 150, status: "delivered", date: "2025-03-30", requestedBy: "Dr. Priya Sharma" },
  { id: "RO-2025-0887", product: "Codeine Phosphate 30mg", outlet: "Downtown Pharmacy", qty: 50, status: "pending", date: "2025-04-02", requestedBy: "Dr. Priya Sharma" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "default" },
  approved: { label: "Approved", variant: "secondary" },
  dispatched: { label: "Dispatched", variant: "outline" },
  delivered: { label: "Delivered", variant: "secondary" },
};

export default function Replenishment() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Replenishment Orders" description="Manage stock replenishment across outlets">
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Order</Button>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs text-muted-foreground">In Transit</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">47</p>
          <p className="text-xs text-muted-foreground">Delivered (MTD)</p>
        </div>
      </div>

      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Outlet</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORDERS.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="text-sm font-medium">{o.product}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{o.outlet}</TableCell>
                  <TableCell className="text-sm">{o.qty}</TableCell>
                  <TableCell><Badge variant={statusConfig[o.status].variant} className="text-xs">{statusConfig[o.status].label}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="text-right">
                    {o.status === "pending" && <Button variant="ghost" size="sm" className="text-xs">Approve</Button>}
                    {o.status === "approved" && <Button variant="ghost" size="sm" className="text-xs">Dispatch</Button>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
