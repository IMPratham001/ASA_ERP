"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("from") || "/";

  useEffect(() => {
    if (window.location.pathname !== "/auth/login") {
      router.replace("/auth/login" + window.location.search);
    }
  }, [router]);
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email === "admin@example.com" && password === "admin") {
        setUser({
          id: "1",
          email,
          name: "Super Admin",
          role: "super_admin",
          storeId: null,
          moduleAccess: [
            { module: "dashboard", permissions: ["view"] },
            {
              module: "inventory",
              permissions: ["view", "create", "edit", "delete"],
            },
            {
              module: "orders",
              permissions: ["view", "create", "edit", "delete"],
            },
            {
              module: "users",
              permissions: ["view", "create", "edit", "delete"],
            },
          ],
          lastLogin: new Date().toISOString(),
        });
        router.push(redirectPath);
      } else if (email === "manager@example.com" && password === "manager") {
        setUser({
          id: "2",
          email,
          name: "Store Manager",
          role: "manager",
          storeId: "1",
          moduleAccess: [
            { module: "dashboard", permissions: ["view"] },
            { module: "inventory", permissions: ["view", "edit"] },
            { module: "orders", permissions: ["view", "create", "edit"] },
          ],
          lastLogin: new Date().toISOString(),
        });
        router.push(redirectPath);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo Accounts:</p>
            <p>Super Admin: admin@example.com / admin</p>
            <p>Store Manager: manager@example.com / manager</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
