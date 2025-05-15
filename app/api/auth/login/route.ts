"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AuthPage() {
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(""); // For debugging

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDebugInfo(""); // Clear debug info
    setIsLoading(true);

    try {
      // Make sure we're using the correct API endpoint
      const apiUrl = '/api/auth/login';
      setDebugInfo(prev => prev + `\nTrying to fetch: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        // Add cache control to prevent caching issues
        cache: 'no-store'
      });

      // Check if we got HTML instead of JSON
      const contentType = response.headers.get('content-type');
      setDebugInfo(prev => prev + `\nContent-Type: ${contentType}`);

      if (contentType && contentType.includes('text/html')) {
        throw new Error('Received HTML instead of JSON. API endpoint may be incorrect or returning an error page.');
      }

      const data = await response.json();
      setDebugInfo(prev => prev + `\nResponse status: ${response.status}`);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.requires2FA) {
        // Handle 2FA flow - redirect to 2FA page
        router.push('/auth/2fa');
        return;
      }

      // Store tokens in localStorage
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // Use the user data from the response
      setUser({
        id: data.user?.userId || data.userId,
        email: data.user?.email || data.email,
        name: data.user?.name || data.name,
        role: data.user?.role || data.role,
        permissions: data.user?.permissions || data.permissions || [],
        lastLogin: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setDebugInfo(prev => prev + `\nError: ${err instanceof Error ? err.message : String(err)}`);
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
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
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Debug information section - can be removed in production */}
          {debugInfo && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600 whitespace-pre-wrap">
              <p className="font-bold">Debug Info:</p>
              {debugInfo}
            </div>
          )}

          {/* Quick login for testing */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Test credentials:</p>
            <p className="text-xs text-gray-400">Email: test@example.com / Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}