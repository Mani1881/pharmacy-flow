import { useState } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Receipt, Barcode } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  isControlled: boolean;
}

const CATALOG = [
  { id: "1", name: "Amoxicillin 500mg", sku: "AMX500", unitPrice: 1500, stock: 24, isControlled: false },
  { id: "2", name: "Ibuprofen 400mg", sku: "IBU400", unitPrice: 500, stock: 340, isControlled: false },
  { id: "3", name: "Paracetamol 500mg", sku: "PCM500", unitPrice: 200, stock: 890, isControlled: false },
  { id: "4", name: "Omeprazole 20mg", sku: "OMP20", unitPrice: 800, stock: 210, isControlled: false },
  { id: "5", name: "Codeine Phosphate 30mg", sku: "COD30", unitPrice: 3500, stock: 8, isControlled: true },
  { id: "6", name: "Vitamin C 1000mg", sku: "VTC1000", unitPrice: 1200, stock: 520, isControlled: false },
  { id: "7", name: "Metformin 500mg", sku: "MET500", unitPrice: 1200, stock: 156, isControlled: false },
  { id: "8", name: "Ciprofloxacin 500mg", sku: "CIP500", unitPrice: 2200, stock: 78, isControlled: false },
];

export default function POS() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");

  const filteredCatalog = CATALOG.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: typeof CATALOG[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) {
        return prev.map(c => c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { id: product.id, name: product.name, sku: product.sku, unitPrice: product.unitPrice, quantity: 1, isControlled: product.isControlled }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;
  const hasControlled = cart.some(c => c.isControlled);

  const handleCheckout = () => {
    if (hasControlled && !customerName.trim()) {
      toast({ title: "Customer info required", description: "Controlled medicines require customer identification", variant: "destructive" });
      return;
    }
    toast({ title: "Sale completed!", description: `Total: ₦${total.toLocaleString()} — Receipt #${Date.now().toString(36).toUpperCase()}` });
    setCart([]);
    setCustomerName("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Point of Sale" description="Process sales and generate receipts">
        <Badge variant="secondary" className="gap-1"><Barcode className="h-3 w-3" /> Outlet: Downtown Pharmacy</Badge>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Product Search */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Scan barcode or search product..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-12 text-base" autoFocus />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCatalog.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all text-left"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.isControlled && <Badge variant="destructive" className="text-[9px] px-1 py-0">Ctrl</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{p.sku} · Stock: {p.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₦{p.unitPrice.toLocaleString()}</p>
                  <Plus className="h-4 w-4 text-primary ml-auto" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-2">
          <SectionCard title="Current Sale" action={<Badge variant="outline" className="text-xs gap-1"><ShoppingCart className="h-3 w-3" />{cart.length} items</Badge>}>
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No items in cart</p>
                <p className="text-xs">Search and add products to begin</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₦{item.unitPrice.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, -1)}><Minus className="h-3 w-3" /></Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(item.id, 1)}><Plus className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <p className="text-sm font-semibold w-20 text-right">₦{(item.unitPrice * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                {hasControlled && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
                    <p className="text-xs font-medium text-destructive">⚠ Controlled medicine — Customer ID required</p>
                    <Input placeholder="Customer name / ID" value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-8 text-sm" />
                  </div>
                )}

                <Separator />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>VAT (7.5%)</span><span>₦{tax.toLocaleString()}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₦{total.toLocaleString()}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="gap-1"><Receipt className="h-4 w-4" />Hold</Button>
                  <Button className="gap-1" onClick={handleCheckout}><CreditCard className="h-4 w-4" />Pay ₦{total.toLocaleString()}</Button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
