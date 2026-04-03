import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "super_admin" | "regional_supervisor" | "pharmacist" | "store_assistant" | "finance_user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  outletId?: string;
  outletName?: string;
  regionId?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo users for prototype
const DEMO_USERS: Record<string, AuthUser> = {
  "admin@pharmaflow.com": { id: "1", email: "admin@pharmaflow.com", name: "Dr. Sarah Chen", role: "super_admin", avatar: "SC" },
  "supervisor@pharmaflow.com": { id: "2", email: "supervisor@pharmaflow.com", name: "James Okafor", role: "regional_supervisor", regionId: "north", avatar: "JO" },
  "pharmacist@pharmaflow.com": { id: "3", email: "pharmacist@pharmaflow.com", name: "Dr. Priya Sharma", role: "pharmacist", outletId: "outlet-1", outletName: "Downtown Pharmacy", avatar: "PS" },
  "assistant@pharmaflow.com": { id: "4", email: "assistant@pharmaflow.com", name: "Mike Johnson", role: "store_assistant", outletId: "outlet-1", outletName: "Downtown Pharmacy", avatar: "MJ" },
  "finance@pharmaflow.com": { id: "5", email: "finance@pharmaflow.com", name: "Linda Park", role: "finance_user", avatar: "LP" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("pharmaflow_user");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (!demoUser) throw new Error("Invalid credentials. Use a demo account.");
    setUser(demoUser);
    localStorage.setItem("pharmaflow_user", JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pharmaflow_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
