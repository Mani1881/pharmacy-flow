import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight, Users, AlertTriangle, Brain,
  Building2, Truck, FileText, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import pharmaLogo from "@/assets/pharmaflow-logo.png";

const NAV_ITEMS = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard", roles: ["super_admin", "regional_supervisor", "pharmacist", "store_assistant", "finance_user"] },
  { path: "/inventory", icon: Package, label: "Inventory", roles: ["super_admin", "regional_supervisor", "pharmacist", "store_assistant"] },
  { path: "/pos", icon: ShoppingCart, label: "Point of Sale", roles: ["super_admin", "pharmacist", "store_assistant"] },
  { path: "/orders", icon: Truck, label: "Replenishment", roles: ["super_admin", "regional_supervisor", "pharmacist"] },
  { path: "/outlets", icon: Building2, label: "Outlets", roles: ["super_admin", "regional_supervisor"] },
  { path: "/reports", icon: BarChart3, label: "Reports", roles: ["super_admin", "regional_supervisor", "finance_user"] },
  { path: "/audit", icon: FileText, label: "Audit Log", roles: ["super_admin", "finance_user"] },
  { path: "/alerts", icon: AlertTriangle, label: "Alerts", roles: ["super_admin", "regional_supervisor", "pharmacist"] },
  { path: "/ai-insights", icon: Brain, label: "AI Insights", roles: ["super_admin", "regional_supervisor", "finance_user"] },
  { path: "/users", icon: Users, label: "User Mgmt", roles: ["super_admin"] },
  { path: "/settings", icon: Settings, label: "Settings", roles: ["super_admin", "regional_supervisor", "pharmacist"] },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNav = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className={cn(
      "h-screen gradient-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 sticky top-0",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
          <img src={pharmaLogo} alt="PharmaFlow" width={28} height={28} />
        </div>
        {!collapsed && <span className="text-sidebar-foreground font-bold text-lg">PharmaFlow</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {filteredNav.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === "Alerts" && (
                <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0">3</Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">{user.avatar}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 capitalize">{user.role.replace("_", " ")}</p>
            </div>
          </div>
        )}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          {!collapsed && (
            <>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground hover:bg-sidebar-accent h-8 w-8 ml-auto">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
