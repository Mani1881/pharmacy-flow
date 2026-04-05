import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { StatCard } from "@/components/shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Package, Search, Filter, AlertTriangle, Download, Plus, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  batchNo: string;
  expiryDate: string;
  stock: number;
  reorderLevel: number;
  unitPrice: number;
  costPrice: number;
  outlet: string;
  isControlled: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", sku: "AMX500", name: "Amoxicillin 500mg", category: "Prescription", batchNo: "B2024-0891", expiryDate: "2025-06-15", stock: 24, reorderLevel: 50, unitPrice: 1500, costPrice: 800, outlet: "Downtown Pharmacy", isControlled: false },
  { id: "2", sku: "IBU400", name: "Ibuprofen 400mg", category: "OTC", batchNo: "B2024-1203", expiryDate: "2026-03-20", stock: 340, reorderLevel: 100, unitPrice: 500, costPrice: 200, outlet: "Downtown Pharmacy", isControlled: false },
  { id: "3", sku: "MET500", name: "Metformin 500mg", category: "Prescription", batchNo: "B2024-0456", expiryDate: "2025-09-10", stock: 156, reorderLevel: 80, unitPrice: 1200, costPrice: 650, outlet: "Ikeja Mall", isControlled: false },
  { id: "4", sku: "COD30", name: "Codeine Phosphate 30mg", category: "Controlled", batchNo: "B2024-0102", expiryDate: "2025-04-30", stock: 8, reorderLevel: 20, unitPrice: 3500, costPrice: 2200, outlet: "Downtown Pharmacy", isControlled: true },
  { id: "5", sku: "OMP20", name: "Omeprazole 20mg", category: "Prescription", batchNo: "B2024-0789", expiryDate: "2025-12-01", stock: 210, reorderLevel: 60, unitPrice: 800, costPrice: 350, outlet: "Victoria Island", isControlled: false },
  { id: "6", sku: "PCM500", name: "Paracetamol 500mg", category: "OTC", batchNo: "B2024-1567", expiryDate: "2026-08-15", stock: 890, reorderLevel: 200, unitPrice: 200, costPrice: 80, outlet: "Downtown Pharmacy", isControlled: false },
  { id: "7", sku: "AZT250", name: "Azithromycin 250mg", category: "Prescription", batchNo: "B2024-0334", expiryDate: "2025-05-20", stock: 45, reorderLevel: 40, unitPrice: 2800, costPrice: 1500, outlet: "Lekki Phase 1", isControlled: false },
  { id: "8", sku: "DIA5", name: "Diazepam 5mg", category: "Controlled", batchNo: "B2024-0055", expiryDate: "2025-07-31", stock: 15, reorderLevel: 10, unitPrice: 4500, costPrice: 3000, outlet: "Downtown Pharmacy", isControlled: true },
  { id: "9", sku: "VTC1000", name: "Vitamin C 1000mg", category: "OTC", batchNo: "B2024-2001", expiryDate: "2027-01-10", stock: 520, reorderLevel: 150, unitPrice: 1200, costPrice: 400, outlet: "Surulere Central", isControlled: false },
  { id: "10", sku: "CIP500", name: "Ciprofloxacin 500mg", category: "Prescription", batchNo: "B2024-0612", expiryDate: "2025-11-05", stock: 78, reorderLevel: 50, unitPrice: 2200, costPrice: 1100, outlet: "Ikeja Mall", isControlled: false },
];

const PRODUCTS_STORAGE_KEY = "pharmaflow_products";

function getStockStatus(stock: number, reorder: number) {
  if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
  if (stock <= reorder * 0.5) return { label: "Critical", variant: "destructive" as const };
  if (stock <= reorder) return { label: "Low", variant: "default" as const };
  return { label: "In Stock", variant: "secondary" as const };
}

function getExpiryStatus(date: string) {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Expired", color: "text-destructive" };
  if (days <= 30) return { label: `${days}d left`, color: "text-destructive" };
  if (days <= 90) return { label: `${days}d left`, color: "text-warning" };
  return { label: `${days}d`, color: "text-muted-foreground" };
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!saved) return MOCK_PRODUCTS;

    try {
      const parsed = JSON.parse(saved) as Product[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [productCategory, setProductCategory] = useState("Prescription");
  const [batchNo, setBatchNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [stock, setStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [outlet, setOutlet] = useState("");
  const [isControlled, setIsControlled] = useState("no");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "all" && p.category !== category) return false;
      if (stockFilter === "low" && p.stock > p.reorderLevel) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      if (stockFilter === "controlled" && !p.isControlled) return false;
      return true;
    });
  }, [search, category, stockFilter, products]);

  const lowStock = products.filter(p => p.stock <= p.reorderLevel).length;
  const expiringSoon = products.filter(p => {
    const days = Math.ceil((new Date(p.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 90;
  }).length;

  const resetForm = () => {
    setSku("");
    setName("");
    setProductCategory("Prescription");
    setBatchNo("");
    setExpiryDate("");
    setStock("");
    setReorderLevel("");
    setUnitPrice("");
    setCostPrice("");
    setOutlet("");
    setIsControlled("no");
  };

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedSku = sku.trim().toUpperCase();
    const normalizedName = name.trim();
    const normalizedBatch = batchNo.trim().toUpperCase();
    const normalizedOutlet = outlet.trim();
    const stockValue = Number(stock);
    const reorderValue = Number(reorderLevel);
    const unitPriceValue = Number(unitPrice);
    const costPriceValue = Number(costPrice);

    if (!normalizedSku || !normalizedName || !productCategory || !normalizedBatch || !expiryDate || !normalizedOutlet) {
      toast({
        title: "Missing required fields",
        description: "Fill all product details before saving.",
        variant: "destructive",
      });
      return;
    }

    if ([stockValue, reorderValue, unitPriceValue, costPriceValue].some((n) => Number.isNaN(n) || n < 0)) {
      toast({
        title: "Invalid numeric values",
        description: "Stock, reorder level, and prices must be valid positive numbers.",
        variant: "destructive",
      });
      return;
    }

    if (products.some((p) => p.sku.toLowerCase() === normalizedSku.toLowerCase())) {
      toast({
        title: "SKU already exists",
        description: "Use a unique SKU for each product.",
        variant: "destructive",
      });
      return;
    }

    const nextProduct: Product = {
      id: crypto.randomUUID(),
      sku: normalizedSku,
      name: normalizedName,
      category: productCategory,
      batchNo: normalizedBatch,
      expiryDate,
      stock: stockValue,
      reorderLevel: reorderValue,
      unitPrice: unitPriceValue,
      costPrice: costPriceValue,
      outlet: normalizedOutlet,
      isControlled: isControlled === "yes",
    };

    setProducts((prev) => [nextProduct, ...prev]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "Product added", description: `${normalizedName} is now in inventory.` });
  };

  const handleExport = () => {
    const rows = products.map((p) => [
      p.id,
      p.sku,
      p.name,
      p.category,
      p.batchNo,
      p.expiryDate,
      p.stock,
      p.reorderLevel,
      p.unitPrice,
      p.costPrice,
      p.outlet,
      p.isControlled ? "yes" : "no",
    ]);

    const header = ["id", "sku", "name", "category", "batchNo", "expiryDate", "stock", "reorderLevel", "unitPrice", "costPrice", "outlet", "isControlled"];
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast({ title: "Export complete", description: `Downloaded ${products.length} products as CSV.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Inventory Management" description="Track stock levels, batches, and expiry across all outlets">
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Enter product details to add it to inventory.</DialogDescription>
            </DialogHeader>

            <form id="add-product-form" className="grid gap-4" onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-sku">SKU</Label>
                  <Input id="product-sku" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. AMX500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-batch">Batch No</Label>
                  <Input id="product-batch" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} placeholder="e.g. B2026-1001" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Amoxicillin 500mg" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger id="product-category"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prescription">Prescription</SelectItem>
                      <SelectItem value="OTC">OTC</SelectItem>
                      <SelectItem value="Controlled">Controlled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-expiry">Expiry Date</Label>
                  <Input id="product-expiry" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock</Label>
                  <Input id="product-stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-reorder">Reorder Level</Label>
                  <Input id="product-reorder" type="number" min="0" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-cost">Cost Price</Label>
                  <Input id="product-cost" type="number" min="0" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-unit">Unit Price</Label>
                  <Input id="product-unit" type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="product-outlet">Outlet</Label>
                  <Input id="product-outlet" value={outlet} onChange={(e) => setOutlet(e.target.value)} placeholder="e.g. Downtown Pharmacy" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-controlled">Controlled Drug</Label>
                  <Select value={isControlled} onValueChange={setIsControlled}>
                    <SelectTrigger id="product-controlled"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" form="add-product-form">Save Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total SKUs" value={products.length.toLocaleString()} icon={Package} />
        <StatCard title="Low Stock Items" value={lowStock} changeType="negative" change="Needs attention" icon={AlertTriangle} />
        <StatCard title="Expiring Soon (90d)" value={expiringSoon} changeType="negative" change="Review required" icon={Calendar} />
        <StatCard title="Inventory Value" value="₦48.2M" change="+3.2% this month" changeType="positive" icon={Package} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[160px]"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Prescription">Prescription</SelectItem>
            <SelectItem value="OTC">OTC</SelectItem>
            <SelectItem value="Controlled">Controlled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-full sm:w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
            <SelectItem value="controlled">Controlled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Batch</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="hidden sm:table-cell">Expiry</TableHead>
                <TableHead className="hidden lg:table-cell">Outlet</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => {
                const status = getStockStatus(p.stock, p.reorderLevel);
                const expiry = getExpiryStatus(p.expiryDate);
                return (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-accent/50">
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.name}</span>
                          {p.isControlled && <Badge variant="destructive" className="text-[10px] px-1 py-0">Ctrl</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground">{p.sku} · {p.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{p.batchNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{p.stock}</span>
                        <Badge variant={status.variant} className="text-[10px] px-1.5 py-0">{status.label}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className={cn("hidden sm:table-cell text-xs", expiry.color)}>{expiry.label}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{p.outlet}</TableCell>
                    <TableCell className="text-right text-sm">₦{p.unitPrice.toLocaleString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
