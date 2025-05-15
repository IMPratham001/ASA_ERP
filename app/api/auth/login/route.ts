"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, User, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setDebugInfo(null);

    try {
      console.log("Sending login request...");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Capture details for debugging
      const responseDebugInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };

      console.log("Response received:", responseDebugInfo);

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          // It's JSON, so we can parse it
          const errorData = await response.json();
          responseDebugInfo.body = errorData;
          setDebugInfo(responseDebugInfo);

          throw new Error(
            errorData.error || 
            errorData.message || 
            `Error ${response.status}: ${response.statusText}`
          );
        } else {
          // Not JSON, might be HTML error page
          const textResponse = await response.text();
          responseDebugInfo.bodyPreview = textResponse.substring(0, 500);
          setDebugInfo(responseDebugInfo);

          console.error("Non-JSON error response:", textResponse);
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      responseDebugInfo.body = { success: data.success, hasUser: !!data.user };
      setDebugInfo(responseDebugInfo);

      if (data.success) {
        console.log("Login successful, redirecting...");
        useStore.getState().setUser(data.user);
        router.push("/dashboard");
      } else {
        console.log("Login failed:", data.error);
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Debug helper function
  const testServerConnection = async () => {
    try {
      const response = await fetch("/api/health-check", {
        method: "GET"
      });

      alert(`Server health check: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Health check response:", data);
      }
    } catch (err) {
      console.error("Health check error:", err);
      alert(`Error connecting to server: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to login</CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Developer tools section - remove in production */}
        <Card className="w-full bg-gray-50 border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Developer Tools</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="w-full text-xs"
              onClick={testServerConnection}
            >
              Test Server Connection
            </Button>

            {debugInfo && (
              <div className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-60">
                <div className="font-bold mb-1">Response Details:</div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}