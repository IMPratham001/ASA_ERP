
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Demo login with better error handling
      if (email === "admin@example.com" && password === "admin") {
        const adminUser = {
          id: "1",
          email,
          name: "Super Admin",
          role: "super_admin" as Role,
          storeId: null,
          moduleAccess: [
            { module: "dashboard", permissions: ["view", "edit"] },
            { module: "inventory", permissions: ["view", "create", "edit", "delete"] },
            { module: "orders", permissions: ["view", "create", "edit", "delete"] },
            { module: "users", permissions: ["view", "create", "edit", "delete"] },
            { module: "finance", permissions: ["view", "create", "edit"] },
            { module: "stores", permissions: ["view", "create", "edit", "delete"] },
          ],
          lastLogin: new Date().toISOString(),
        };
        setUser(adminUser);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(adminUser));
        }
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as admin",
        });
        router.push("/dashboard");
      } else if (email === "manager@example.com" && password === "manager") {
        const managerUser = {
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
        };
        setUser(managerUser);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(managerUser));
        }
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as manager",
        });
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials",
        });
      }
    } catch (err) {
      setError("An error occurred during login");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Login failed. Please try again.",
      });
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
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
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
