import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Shield } from "lucide-react";

const USERS = [
  { id: "1", name: "Dr. Sarah Chen", email: "admin@pharmaflow.com", role: "super_admin", outlet: "All Outlets", status: "active", lastLogin: "2 min ago" },
  { id: "2", name: "James Okafor", email: "supervisor@pharmaflow.com", role: "regional_supervisor", outlet: "North Region", status: "active", lastLogin: "1 hour ago" },
  { id: "3", name: "Dr. Priya Sharma", email: "pharmacist@pharmaflow.com", role: "pharmacist", outlet: "Downtown Pharmacy", status: "active", lastLogin: "15 min ago" },
  { id: "4", name: "Mike Johnson", email: "assistant@pharmaflow.com", role: "store_assistant", outlet: "Downtown Pharmacy", status: "active", lastLogin: "30 min ago" },
  { id: "5", name: "Linda Park", email: "finance@pharmaflow.com", role: "finance_user", outlet: "HQ Finance", status: "active", lastLogin: "3 hours ago" },
];

const roleColors: Record<string, string> = {
  super_admin: "destructive",
  regional_supervisor: "default",
  pharmacist: "secondary",
  store_assistant: "outline",
  finance_user: "secondary",
};

export default function UserManagement() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="User Management" description="Manage users, roles, and access across the platform">
        <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add User</Button>
      </PageHeader>

      <SectionCard>
        <div className="overflow-x-auto -mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Outlet/Region</TableHead>
                <TableHead className="hidden sm:table-cell">Last Login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USERS.map(u => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleColors[u.role] as any} className="text-[10px] capitalize">
                      {u.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.outlet}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{u.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
