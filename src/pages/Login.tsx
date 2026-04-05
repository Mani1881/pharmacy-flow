import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import pharmaLogo from "@/assets/pharmaflow-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(217, 91%, 55%) 0%, hsl(240, 70%, 45%) 40%, hsl(260, 80%, 50%) 70%, hsl(199, 89%, 48%) 100%)",
      }}
    >
      {/* 3D floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl animate-pulse-soft" />
        <div className="absolute top-[60%] right-[15%] w-48 h-48 rounded-full bg-white/8 blur-2xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[20%] left-[30%] w-24 h-24 rounded-full bg-white/5 blur-lg animate-pulse-soft" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[30%] right-[30%] w-16 h-16 rounded-2xl bg-white/10 blur-md rotate-45 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="w-full max-w-md space-y-6 animate-fade-in relative z-10">
        {/* Logo & Brand */}
        <div className="text-center space-y-3">
          <div className="inline-block p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-lg"
            style={{ transform: "perspective(800px) rotateY(-5deg)" }}>
            <img src={pharmaLogo} alt="PharmaFlow Logo" width={64} height={64} className="drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-white drop-shadow-md">PharmaFlow</h1>
          <p className="text-white/80 text-sm">Pharmacy Chain Management Platform</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl"
          style={{ transform: "perspective(1000px) rotateX(1deg)" }}>
          <Tabs defaultValue="login">
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="gap-1.5"><LogIn className="h-3.5 w-3.5" />Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" />Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@pharmaflow.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-white" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Dr. Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@pharmaflow.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
                  </div>
                  <Button type="submit" className="w-full gradient-primary text-white" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
          <Shield className="h-3.5 w-3.5" />
          <span>Secured with end-to-end encryption</span>
        </div>
      </div>
    </div>
  );
}
