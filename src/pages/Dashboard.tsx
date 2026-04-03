import { useAuth } from "@/contexts/AuthContext";
import { StatCard, PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp, TrendingDown,
  Clock, Building2, Activity
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const salesData = [
  { name: "Mon", sales: 42500, target: 40000 },
  { name: "Tue", sales: 38200, target: 40000 },
  { name: "Wed", sales: 45100, target: 40000 },
  { name: "Thu", sales: 51300, target: 40000 },
  { name: "Fri", sales: 48700, target: 40000 },
  { name: "Sat", sales: 55200, target: 40000 },
  { name: "Sun", sales: 31400, target: 40000 },
];

const hourlyTraffic = [
  { hour: "8am", customers: 12 }, { hour: "9am", customers: 28 },
  { hour: "10am", customers: 35 }, { hour: "11am", customers: 42 },
  { hour: "12pm", customers: 55 }, { hour: "1pm", customers: 48 },
  { hour: "2pm", customers: 38 }, { hour: "3pm", customers: 32 },
  { hour: "4pm", customers: 45 }, { hour: "5pm", customers: 68 },
  { hour: "6pm", customers: 82 }, { hour: "7pm", customers: 75 },
  { hour: "8pm", customers: 45 }, { hour: "9pm", customers: 20 },
];

const categoryData = [
  { name: "Prescription", value: 45, color: "hsl(168, 70%, 35%)" },
  { name: "OTC", value: 28, color: "hsl(217, 91%, 60%)" },
  { name: "Personal Care", value: 15, color: "hsl(38, 92%, 50%)" },
  { name: "Supplements", value: 12, color: "hsl(142, 71%, 45%)" },
];

const topOutlets = [
  { name: "Downtown Pharmacy", sales: "₦2.4M", margin: "32%", status: "excellent" },
  { name: "Ikeja Mall Branch", sales: "₦1.9M", margin: "28%", status: "good" },
  { name: "Victoria Island", sales: "₦1.7M", margin: "35%", status: "excellent" },
  { name: "Lekki Phase 1", sales: "₦1.5M", margin: "24%", status: "warning" },
  { name: "Surulere Central", sales: "₦1.2M", margin: "30%", status: "good" },
];

const alerts = [
  { type: "expiry", msg: "47 products expiring within 30 days across 12 outlets", severity: "destructive" as const },
  { type: "stockout", msg: "Amoxicillin 500mg critically low at 5 outlets", severity: "destructive" as const },
  { type: "anomaly", msg: "Unusual sales pattern detected at Surulere branch", severity: "default" as const },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}`}
        description="Here's what's happening across your pharmacy chain today"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value="₦3.2M" change="+12.5% vs yesterday" changeType="positive" icon={DollarSign} />
        <StatCard title="Active SKUs" value="4,832" change="38 new this week" changeType="positive" icon={Package} />
        <StatCard title="Transactions" value="1,247" change="+8.3% vs last week" changeType="positive" icon={ShoppingCart} />
        <StatCard title="Stock Alerts" value="52" change="12 critical" changeType="negative" icon={AlertTriangle} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Weekly Sales Performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(215, 10%, 50%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 10%, 50%)" tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, ""]} />
              <Bar dataKey="sales" fill="hsl(168, 70%, 35%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="hsl(168, 70%, 35%, 0.2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Sales by Category">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {categoryData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-muted-foreground">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Traffic & Outlets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Customer Traffic (Today)" action={
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> <span>Peak: 6PM</span>
          </div>
        }>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(215, 10%, 50%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(215, 10%, 50%)" />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="hsl(168, 70%, 35%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Top Performing Outlets">
          <div className="space-y-3">
            {topOutlets.map((o, i) => (
              <div key={o.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{o.name}</p>
                    <p className="text-xs text-muted-foreground">Margin: {o.margin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{o.sales}</span>
                  {o.status === "excellent" ? <TrendingUp className="h-3.5 w-3.5 text-success" /> : 
                   o.status === "warning" ? <TrendingDown className="h-3.5 w-3.5 text-warning" /> :
                   <Activity className="h-3.5 w-3.5 text-info" />}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Alerts */}
      <SectionCard title="Active Alerts" action={<Badge variant="secondary" className="text-xs">3 active</Badge>}>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.severity === "destructive" ? "text-destructive" : "text-warning"}`} />
              <p className="text-sm">{a.msg}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
