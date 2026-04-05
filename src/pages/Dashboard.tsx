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
  { name: "Prescription", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "OTC", value: 28, color: "hsl(199, 89%, 48%)" },
  { name: "Personal Care", value: 15, color: "hsl(280, 65%, 60%)" },
  { name: "Supplements", value: 12, color: "hsl(152, 69%, 45%)" },
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

const statCards = [
  { title: "Today's Revenue", value: "₦3.2M", change: "+12.5% vs yesterday", changeType: "positive" as const, icon: DollarSign, gradient: "from-primary to-info" },
  { title: "Active SKUs", value: "4,832", change: "38 new this week", changeType: "positive" as const, icon: Package, gradient: "from-info to-primary" },
  { title: "Transactions", value: "1,247", change: "+8.3% vs last week", changeType: "positive" as const, icon: ShoppingCart, gradient: "from-chart-5 to-primary" },
  { title: "Stock Alerts", value: "52", change: "12 critical", changeType: "negative" as const, icon: AlertTriangle, gradient: "from-destructive to-warning" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}`}
        description="Here's what's happening across your pharmacy chain today"
      />

      {/* 3D KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="card-3d group relative overflow-hidden rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md p-5 cursor-default"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Gradient glow background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500`} />
              {/* Floating orb */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-all duration-500 group-hover:scale-125`} />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                  <p className="text-3xl font-extrabold tracking-tight">{card.value}</p>
                  <p className={`text-xs font-semibold ${card.changeType === "positive" ? "text-success" : "text-destructive"}`}>
                    {card.change}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300`}>
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row with 3D depth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-3d rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h3 className="font-bold text-sm">Weekly Sales Performance</h3>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">Live</Badge>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 48%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 48%)" tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                <Bar dataKey="sales" fill="url(#salesGrad)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" fill="url(#targetGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-3d rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h3 className="font-bold text-sm">Sales by Category</h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <defs>
                  {categoryData.map((entry, i) => (
                    <filter key={i} id={`shadow-${i}`}>
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                    </filter>
                  ))}
                </defs>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 4px 6px ${entry.color}40)` }} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-3">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.color, boxShadow: `0 2px 8px ${c.color}60` }} />
                  <span className="text-muted-foreground font-medium">{c.name} ({c.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Traffic & Outlets with 3D effects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-3d rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
            <h3 className="font-bold text-sm">Customer Traffic (Today)</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
              <Clock className="h-3 w-3" /> <span>Peak: 6PM</span>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyTraffic}>
                <defs>
                  <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(280, 65%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 88%)" strokeOpacity={0.5} />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 48%)" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 48%)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} />
                <Line type="monotone" dataKey="customers" stroke="hsl(280, 65%, 60%)" strokeWidth={3} dot={false} fill="url(#trafficGrad)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-3d rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 border-b border-border/30">
            <h3 className="font-bold text-sm">Top Performing Outlets</h3>
          </div>
          <div className="p-6 space-y-2">
            {topOutlets.map((o, i) => (
              <div key={o.name} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-accent/50 transition-all duration-200 group cursor-default">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center text-xs font-bold text-primary-foreground shadow-md shadow-primary/20">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{o.name}</p>
                    <p className="text-xs text-muted-foreground">Margin: {o.margin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{o.sales}</span>
                  {o.status === "excellent" ? <TrendingUp className="h-4 w-4 text-success" /> : 
                   o.status === "warning" ? <TrendingDown className="h-4 w-4 text-warning" /> :
                   <Activity className="h-4 w-4 text-info" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts with 3D glass effect */}
      <div className="card-3d rounded-2xl border border-border/30 bg-card/80 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <h3 className="font-bold text-sm">Active Alerts</h3>
          <Badge className="bg-destructive/10 text-destructive border-0 text-xs font-semibold">3 active</Badge>
        </div>
        <div className="p-6 space-y-3">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/60 to-muted/30 border border-border/20 hover:border-border/40 transition-all duration-200">
              <div className={`p-1.5 rounded-lg ${a.severity === "destructive" ? "bg-destructive/10" : "bg-warning/10"}`}>
                <AlertTriangle className={`h-4 w-4 ${a.severity === "destructive" ? "text-destructive" : "text-warning"}`} />
              </div>
              <p className="text-sm font-medium">{a.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
