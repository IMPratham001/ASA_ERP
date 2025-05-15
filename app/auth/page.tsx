"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { AlertCircle, ChevronRight, User, Lock, BarChart2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      if (data.success) {
        setUser(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col md:flex-row">
      {/* Left panel for branding */}
      <div className="hidden md:flex md:w-1/2 bg-blue-800 text-white flex-col justify-center p-12">
        <div className="mb-8 flex items-center">
          <BarChart2 size={36} className="mr-3" />
          <h1 className="text-3xl font-bold">Enterprise ERP</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-6">
          Business Management Platform
        </h2>
        <p className="text-blue-100 mb-8">
          Access your company's resources, manage operations, and monitor
          performance metrics all from one central dashboard.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            <span>Financial Management</span>
          </div>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            <span>Inventory Control</span>
          </div>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            <span>CRM Tools</span>
          </div>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 mr-2" />
            <span>HR Management</span>
          </div>
        </div>
      </div>

      {/* Right panel for login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="pb-6 space-y-1 border-b">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to access your company's ERP system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-50 text-red-800 border border-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Contact your administrator
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
