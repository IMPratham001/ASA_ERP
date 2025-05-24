"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  Mail,
  Building,
  Loader2,
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  HelpCircle,
  ShieldCheck,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [systemStatus, setSystemStatus] = useState({
    status: "operational",
    message: "",
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes

  // Check system status on load
  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const res = await fetch("/api/system/status");
        if (res.ok) {
          const data = await res.json();
          setSystemStatus(data);
        }
      } catch (error) {
        console.error("Failed to check system status:", error);
        setSystemStatus({
          status: "warning",
          message: "Could not verify system status",
        });
      }
    };

    checkSystemStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent further attempts if account is locked
    if (isLocked) {
      setError("Account temporarily locked. Please contact IT support.");
      return;
    }

    setLoading(true);
    setError("");

    // Enhanced validation
    if (!validateEmail(email)) {
      setError("Please enter a valid corporate email address");
      setLoading(false);
      handleFailedAttempt();
      return;
    }

    // Skip client-side validation since we're using demo credentials
    // The actual validation will happen on the server

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Timeout": sessionTimeout.toString(),
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
          deviceInfo: await collectDeviceInfo(),
        }),
      });

      if (res.ok) {
        // Success animation before redirect
        const data = await res.json();

        // Reset login attempts on successful login
        setLoginAttempts(0);

        // Record login for audit trail
        await recordAuditEvent("login_success", email);

        // Redirect with delay for animation
        setTimeout(() => {
          router.push(data.redirectUrl || "/dashboard");
          router.refresh();
        }, 600);
      } else {
        const data = await res.json();
        setError(data.message || "Authentication failed");
        handleFailedAttempt();
        await recordAuditEvent("login_failure", email, data.message);
      }
    } catch (error) {
      setError("Authentication service unavailable. Please try again later.");
      console.error("Login failed:", error);
      handleFailedAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setLoading(true);
    await recordAuditEvent("sso_attempt", email);

    try {
      const res = await fetch("/api/auth/sso-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const { redirectUrl } = await res.json();
        window.location.href = redirectUrl;
      } else {
        const data = await res.json();
        setError(data.message || "SSO initialization failed");
        setLoading(false);
      }
    } catch (error) {
      setError("SSO service unavailable. Please try again later.");
      console.error("SSO failed:", error);
      setLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    // Lock account after 5 failed attempts
    if (newAttempts >= 5) {
      setIsLocked(true);
      setError(
        "Account temporarily locked due to multiple failed attempts. Please contact IT support.",
      );
      recordAuditEvent("account_locked", email);
    }
  };

  const validateEmail = (email) => {
    // Corporate email validation - customize regex for your domain requirements
    const regex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|[a-zA-Z]{2,})$/i;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    // Basic password validation
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  };

  const collectDeviceInfo = async () => {
    // Collect basic device info for security logs
    return {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    };
  };

  const recordAuditEvent = async (eventType, username, details = "") => {
    try {
      await fetch("/api/audit/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType,
          username,
          details,
          ipAddress: "logged-server-side",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to record audit event:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* System Status Banner */}
      {systemStatus.status !== "operational" && (
        <div
          className={`w-full max-w-[500px] mb-4 ${
            systemStatus.status === "warning"
              ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
              : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
          } border rounded-lg p-2 text-center text-sm`}
        >
          <p
            className={`font-medium ${
              systemStatus.status === "warning"
                ? "text-amber-700 dark:text-amber-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            <AlertCircle className="inline-block w-4 h-4 mr-1 mb-0.5" />
            {systemStatus.message ||
              "System maintenance in progress. Some features may be unavailable."}
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[480px] space-y-6"
      >
        {/* Logo and Header */}
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg">
            <Building className="w-12 h-12 text-white" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              RetailCorp
              <span className="text-blue-600 dark:text-blue-400">ERP</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Enterprise Resource Planning System
            </p>
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 relative border border-slate-200 dark:border-slate-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="firstname.lastname@retailcorp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-800"
                  required
                  aria-label="Email"
                  autoComplete="email"
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 pr-10 rounded-lg border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-slate-50 dark:bg-slate-800"
                  required
                  aria-label="Password"
                  autoComplete="current-password"
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLocked}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Session Timeout */}
            <div className="space-y-1">
              <label className="flex justify-between items-center">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Session Timeout
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Info className="h-4 w-4 text-slate-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs w-48">
                        For security reasons, your session will automatically
                        expire after this period of inactivity
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
              <Select
                value={sessionTimeout.toString()}
                onValueChange={(value) => setSessionTimeout(parseInt(value))}
              >
                <SelectTrigger className="w-full h-10 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Session Timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options Row */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  disabled={isLocked}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                >
                  Remember this device
                </label>
              </div>
              <Link
                href="/account-recovery"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm font-semibold text-red-800 dark:text-red-400">
                  Authentication Error
                </AlertTitle>
                <AlertDescription className="text-xs text-red-600 dark:text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className={`w-full h-11 text-base rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:translate-y-[-1px] shadow-md hover:shadow-lg focus:ring focus:ring-blue-300 dark:focus:ring-blue-800 ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading || isLocked}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </span>
              ) : isLocked ? (
                <span className="flex items-center justify-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Account Locked
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Secure Sign In
                </span>
              )}
            </Button>

            

            {/* Help and Support */}
            <div className="absolute bottom-3 right-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() =>
                        window.open("/support/login-help", "_blank")
                      }
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      aria-label="Get help with login"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Need help logging in?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </motion.div>

        {/* Company Branding and Support */}
        <div className="text-center mt-6 flex flex-col space-y-2">
          <div className="flex items-center justify-center space-x-3">
            <a
              href="/privacy-policy"
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Privacy Policy
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Terms of Use
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="/help"
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              Support
            </a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2025 RetailCorp International. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            v4.2.1 | Last System Update: May 15, 2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}
