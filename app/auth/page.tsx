
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [isResetMode, setIsResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (email === "admin@example.com" && password === "admin") {
        const adminUser = {
          id: "1",
          email,
          name: "Super Admin",
          role: "super_admin" as const,
          storeId: null,
          moduleAccess: [
            { module: "dashboard", permissions: ["view", "edit"] },
            { module: "inventory", permissions: ["view", "create", "edit", "delete"] },
            { module: "orders", permissions: ["view", "create", "edit", "delete"] },
            { module: "users", permissions: ["view", "create", "edit", "delete"] },
          ],
          lastLogin: new Date().toISOString(),
        };
        setUser(adminUser);
        if (rememberMe) {
          localStorage.setItem("user", JSON.stringify(adminUser));
          localStorage.setItem("rememberedEmail", email);
        }
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as admin",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In a real app, this would call an API endpoint
      toast({
        title: "Password reset email sent",
        description: "Please check your email for further instructions",
      });
      setIsResetMode(false);
    } catch (err) {
      setError("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isResetMode ? "Reset Password" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isResetMode 
              ? "Enter your email to receive reset instructions" 
              : "Enter your credentials to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="space-y-4">
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
            {!isResetMode && (
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
            )}
            {!isResetMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={() => setIsResetMode(true)}
                >
                  Forgot password?
                </Button>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading 
                ? "Please wait..." 
                : isResetMode 
                  ? "Send Reset Link" 
                  : "Sign in"}
            </Button>
            {isResetMode && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsResetMode(false)}
              >
                Back to Login
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
