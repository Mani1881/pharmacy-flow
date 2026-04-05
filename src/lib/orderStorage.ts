export type OrderStatus = "pending" | "approved" | "dispatched" | "delivered";

export interface ReplenishmentOrder {
  id: string;
  product: string;
  outlet: string;
  qty: number;
  status: OrderStatus;
  date: string;
  requestedBy: string;
}

export const ORDERS_STORAGE_KEY = "pharmaflow_replenishment_orders";

export const INITIAL_ORDERS: ReplenishmentOrder[] = [
  { id: "RO-2025-0891", product: "Amoxicillin 500mg", outlet: "Downtown Pharmacy", qty: 200, status: "pending", date: "2025-04-02", requestedBy: "Dr. Priya Sharma" },
  { id: "RO-2025-0890", product: "Ibuprofen 400mg", outlet: "Ikeja Mall", qty: 500, status: "approved", date: "2025-04-01", requestedBy: "James Okafor" },
  { id: "RO-2025-0889", product: "Vitamin C 1000mg", outlet: "Surulere Central", qty: 300, status: "dispatched", date: "2025-03-31", requestedBy: "Mike Johnson" },
  { id: "RO-2025-0888", product: "Metformin 500mg", outlet: "Victoria Island", qty: 150, status: "delivered", date: "2025-03-30", requestedBy: "Dr. Priya Sharma" },
  { id: "RO-2025-0887", product: "Codeine Phosphate 30mg", outlet: "Downtown Pharmacy", qty: 50, status: "pending", date: "2025-04-02", requestedBy: "Dr. Priya Sharma" },
];

export function readReplenishmentOrders(): ReplenishmentOrder[] {
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }

  try {
    const parsed = JSON.parse(saved) as ReplenishmentOrder[];
    if (!Array.isArray(parsed)) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return parsed;
  } catch {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
}

export function writeReplenishmentOrders(orders: ReplenishmentOrder[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}
