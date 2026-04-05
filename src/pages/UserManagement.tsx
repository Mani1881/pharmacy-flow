import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageHeader, SectionCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

type UserRole = "super_admin" | "regional_supervisor" | "pharmacist" | "store_assistant" | "finance_user";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  outlet: string;
  status: "active";
  lastLogin: string;
}

const INITIAL_USERS: UserRecord[] = [
  { id: "1", name: "Dr. Sarah Chen", email: "admin@pharmaflow.com", role: "super_admin", outlet: "All Outlets", status: "active", lastLogin: "2 min ago" },
  { id: "2", name: "James Okafor", email: "supervisor@pharmaflow.com", role: "regional_supervisor", outlet: "North Region", status: "active", lastLogin: "1 hour ago" },
  { id: "3", name: "Dr. Priya Sharma", email: "pharmacist@pharmaflow.com", role: "pharmacist", outlet: "Downtown Pharmacy", status: "active", lastLogin: "15 min ago" },
  { id: "4", name: "Mike Johnson", email: "assistant@pharmaflow.com", role: "store_assistant", outlet: "Downtown Pharmacy", status: "active", lastLogin: "30 min ago" },
  { id: "5", name: "Linda Park", email: "finance@pharmaflow.com", role: "finance_user", outlet: "HQ Finance", status: "active", lastLogin: "3 hours ago" },
];

const USERS_STORAGE_KEY = "pharmaflow_users";

const roleColors: Record<string, string> = {
  super_admin: "destructive",
  regional_supervisor: "default",
  pharmacist: "secondary",
  store_assistant: "outline",
  finance_user: "secondary",
};

export default function UserManagement() {
  const [users, setUsers] = useState<UserRecord[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (!saved) return INITIAL_USERS;

    try {
      const parsed = JSON.parse(saved) as UserRecord[];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [outlet, setOutlet] = useState("");
  const [role, setRole] = useState<UserRole>("pharmacist");
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const hasDuplicateEmail = useMemo(
    () => users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()),
    [email, users],
  );

  const resetForm = () => {
    setName("");
    setEmail("");
    setOutlet("");
    setRole("pharmacist");
  };

  const handleAddUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOutlet = outlet.trim();

    if (!normalizedName || !normalizedEmail || !normalizedOutlet) {
      toast({
        title: "Missing required fields",
        description: "Name, email, and outlet/region are required.",
        variant: "destructive",
      });
      return;
    }

    if (hasDuplicateEmail) {
      toast({
        title: "Email already exists",
        description: "Use a different email address for the new user.",
        variant: "destructive",
      });
      return;
    }

    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      name: normalizedName,
      email: normalizedEmail,
      role,
      outlet: normalizedOutlet,
      status: "active",
      lastLogin: "Just now",
    };

    setUsers((prev) => [newUser, ...prev]);
    setDialogOpen(false);
    resetForm();
    toast({ title: "User added", description: `${normalizedName} was added successfully.` });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="User Management" description="Manage users, roles, and access across the platform">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a user and assign an access role.</DialogDescription>
            </DialogHeader>

            <form id="add-user-form" className="space-y-4" onSubmit={handleAddUser}>
              <div className="space-y-2">
                <Label htmlFor="new-user-name">Full Name</Label>
                <Input
                  id="new-user-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Amina Bello"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-user-email">Email</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@pharmaflow.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-user-role">Role</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger id="new-user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="regional_supervisor">Regional Supervisor</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="store_assistant">Store Assistant</SelectItem>
                    <SelectItem value="finance_user">Finance User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-user-outlet">Outlet / Region</Label>
                <Input
                  id="new-user-outlet"
                  value={outlet}
                  onChange={(e) => setOutlet(e.target.value)}
                  placeholder="e.g. Downtown Pharmacy"
                />
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" form="add-user-form">Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              {users.map(u => (
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
