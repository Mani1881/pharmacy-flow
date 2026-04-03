import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEMO_ACCOUNTS = [
  { email: "admin@pharmaflow.com", role: "Super Admin", desc: "Full system access" },
  { email: "supervisor@pharmaflow.com", role: "Regional Supervisor", desc: "North region outlets" },
  { email: "pharmacist@pharmaflow.com", role: "Pharmacist", desc: "Downtown Pharmacy" },
  { email: "assistant@pharmaflow.com", role: "Store Assistant", desc: "Downtown Pharmacy" },
  { email: "finance@pharmaflow.com", role: "Finance", desc: "Financial reports" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    try {
      await login(demoEmail, "demo");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 gradient-primary px-4 py-2 rounded-lg">
            <Activity className="h-6 w-6 text-primary-foreground" />
            <span className="text-xl font-bold text-primary-foreground">PharmaFlow</span>
          </div>
          <p className="text-muted-foreground text-sm">Pharmacy Chain Management Platform</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@pharmaflow.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Demo Accounts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.email}
                onClick={() => quickLogin(acc.email)}
                className="w-full flex items-center justify-between p-2.5 rounded-md border border-border hover:bg-accent transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium">{acc.email}</p>
                  <p className="text-xs text-muted-foreground">{acc.desc}</p>
                </div>
                <Badge variant="secondary" className="text-xs">{acc.role}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
