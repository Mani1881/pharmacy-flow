import { PageHeader, SectionCard, StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, TrendingUp, DollarSign, Package, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";

const monthlySales = [
  { month: "Jan", revenue: 28500000, cost: 18200000, margin: 36 },
  { month: "Feb", revenue: 31200000, cost: 19800000, margin: 37 },
  { month: "Mar", revenue: 34100000, cost: 21500000, margin: 37 },
  { month: "Apr", revenue: 29800000, cost: 19100000, margin: 36 },
  { month: "May", revenue: 36500000, cost: 22800000, margin: 38 },
  { month: "Jun", revenue: 38200000, cost: 23500000, margin: 39 },
];

const wastageData = [
  { month: "Jan", expired: 450000, damaged: 120000, returned: 85000 },
  { month: "Feb", expired: 380000, damaged: 95000, returned: 110000 },
  { month: "Mar", expired: 520000, damaged: 150000, returned: 70000 },
  { month: "Apr", expired: 290000, damaged: 80000, returned: 95000 },
  { month: "May", expired: 340000, damaged: 110000, returned: 120000 },
  { month: "Jun", expired: 410000, damaged: 130000, returned: 65000 },
];

const outletPerformance = [
  { name: "Downtown", revenue: 6200000, target: 5500000, score: 92 },
  { name: "Ikeja", revenue: 5100000, target: 5000000, score: 85 },
  { name: "V.Island", revenue: 4800000, target: 4500000, score: 88 },
  { name: "Lekki", revenue: 4200000, target: 4800000, score: 72 },
  { name: "Surulere", revenue: 3900000, target: 4000000, score: 78 },
];

export default function Reports() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="BI Reports" description="Sales, margin, wastage, and outlet performance analytics">
        <Select defaultValue="30d">
          <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="ytd">Year to date</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (YTD)" value="₦198.3M" change="+14.2% vs last year" changeType="positive" icon={DollarSign} />
        <StatCard title="Avg. Margin" value="37.2%" change="+1.8pp" changeType="positive" icon={TrendingUp} />
        <StatCard title="Total Wastage" value="₦3.4M" change="-12% vs last quarter" changeType="positive" icon={AlertTriangle} />
        <StatCard title="Active Products" value="4,832" change="38 new" changeType="positive" icon={Package} />
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
          <TabsTrigger value="outlets">Outlet Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SectionCard title="Monthly Revenue & Cost">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₦${(v/1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => [`₦${(v/1000000).toFixed(1)}M`, ""]} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(168, 70%, 35%)" fill="hsl(168, 70%, 35%, 0.3)" />
                <Area type="monotone" dataKey="cost" stackId="2" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%, 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </TabsContent>

        <TabsContent value="wastage">
          <SectionCard title="Monthly Wastage Breakdown">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={wastageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, ""]} />
                <Bar dataKey="expired" fill="hsl(0, 72%, 51%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="damaged" fill="hsl(38, 92%, 50%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="returned" fill="hsl(217, 91%, 60%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </TabsContent>

        <TabsContent value="outlets">
          <SectionCard title="Outlet Revenue vs Target">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={outletPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis type="number" tickFormatter={v => `₦${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(v: number) => [`₦${(v/1000000).toFixed(1)}M`, ""]} />
                <Bar dataKey="revenue" fill="hsl(168, 70%, 35%)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="hsl(168, 70%, 35%, 0.2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
