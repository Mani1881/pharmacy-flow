import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { readReplenishmentOrders, writeReplenishmentOrders } from "@/lib/orderStorage";

type OrderStatus = "pending" | "approved" | "dispatched" | "delivered";

interface ReplenishmentOrder {
  id: string;
  product: string;
  outlet: string;
  qty: number;
  status: OrderStatus;
  date: string;
  requestedBy: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "default" },
  approved: { label: "Approved", variant: "secondary" },
  dispatched: { label: "Dispatched", variant: "outline" },
  delivered: { label: "Delivered", variant: "secondary" },
};

export default function Replenishment() {
  const [orders, setOrders] = useState<ReplenishmentOrder[]>(() => readReplenishmentOrders());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [outlet, setOutlet] = useState("");
  const [qty, setQty] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    writeReplenishmentOrders(orders);
  }, [orders]);

  const counters = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const approved = orders.filter((o) => o.status === "approved").length;
    const inTransit = orders.filter((o) => o.status === "dispatched").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return { pending, approved, inTransit, delivered };
  }, [orders]);

  const resetForm = () => {
    setProduct("");
    setOutlet("");
    setQty("");
    setRequestedBy("");
  };

  const createOrderId = () => {
    const year = new Date().getFullYear();
    const maxSeq = orders
      .map((o) => Number(o.id.split("-").pop()))
      .filter((n) => Number.isFinite(n))
      .reduce((max, current) => Math.max(max, current), 0);
    const next = String(maxSeq + 1).padStart(4, "0");
    return `RO-${year}-${next}`;
  };

  const handleNewOrder = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedProduct = product.trim();
    const normalizedOutlet = outlet.trim();
    const normalizedRequestedBy = requestedBy.trim();
    const parsedQty = Number(qty);

    if (!normalizedProduct || !normalizedOutlet || !normalizedRequestedBy) {
      toast({
        title: "Missing required fields",
        description: "Product, outlet, requester, and quantity are required.",
        variant: "destructive",
      });
      return;
    }

    if (Number.isNaN(parsedQty) || parsedQty <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Quantity must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    const nextOrder: ReplenishmentOrder = {
      id: createOrderId(),
      product: normalizedProduct,
      outlet: normalizedOutlet,
      qty: parsedQty,
      status: "pending",
      date: new Date().toISOString().slice(0, 10),
      requestedBy: normalizedRequestedBy,
    };

    setOrders((prev) => [nextOrder, ...prev]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Order created", description: `${nextOrder.id} has been added.` });
  };

  const approveOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "approved" } : o)));
    toast({ title: "Order approved", description: `${orderId} moved to approved.` });
  };

  const dispatchOrder = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "dispatched" } : o)));
    toast({ title: "Order dispatched", description: `${orderId} moved to dispatched.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Replenishment Orders" description="Manage stock replenishment across outlets">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Replenishment Order</DialogTitle>
              <DialogDescription>Fill in order details to create a new request.</DialogDescription>
            </DialogHeader>

            <form id="new-order-form" className="space-y-4" onSubmit={handleNewOrder}>
              <div className="space-y-2">
                <Label htmlFor="order-product">Product</Label>
                <Input id="order-product" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Amoxicillin 500mg" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-outlet">Outlet</Label>
                <Input id="order-outlet" value={outlet} onChange={(e) => setOutlet(e.target.value)} placeholder="e.g. Downtown Pharmacy" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-qty">Quantity</Label>
                <Input id="order-qty" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-requested-by">Requested By</Label>
                <Input id="order-requested-by" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="e.g. Dr. Priya Sharma" />
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" form="new-order-form">Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counters.pending}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counters.approved}</p>
          <p className="text-xs text-muted-foreground">Approved</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counters.inTransit}</p>
          <p className="text-xs text-muted-foreground">In Transit</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{counters.delivered}</p>
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
              {orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="text-sm font-medium">{o.product}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{o.outlet}</TableCell>
                  <TableCell className="text-sm">{o.qty}</TableCell>
                  <TableCell><Badge variant={statusConfig[o.status].variant} className="text-xs">{statusConfig[o.status].label}</Badge></TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{o.date}</TableCell>
                  <TableCell className="text-right">
                    {o.status === "pending" && <Button variant="ghost" size="sm" className="text-xs" onClick={() => approveOrder(o.id)}>Approve</Button>}
                    {o.status === "approved" && <Button variant="ghost" size="sm" className="text-xs" onClick={() => dispatchOrder(o.id)}>Dispatch</Button>}
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
