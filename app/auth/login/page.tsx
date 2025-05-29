"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Wifi,
  WifiOff,
  Circle,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginCredentials extends FormData {
  remember_me: boolean;
  session_timeout: number;
}

interface SystemStatus {
  status: "operational" | "warning" | "maintenance";
  message: string;
  lastChecked: Date | null;
}

interface PingResult {
  time: Date;
  responseTime: number | null;
}

interface AuditEvent {
  event_type: string;
  username: string;
  ip_address?: string;
  details?: string;
  timestamp: string;
}

// Constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30; // minutes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// CSRF Token Management
const csrfManager = {
  token: null as string | null,

  async fetchCSRFToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Laravel stores CSRF token in a cookie, we need to extract it
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'XSRF-TOKEN') {
            this.token = decodeURIComponent(value);
            return this.token;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
    }
    return null;
  },

  async getToken(): Promise<string | null> {
    if (!this.token) {
      await this.fetchCSRFToken();
    }
    return this.token;
  },

  clearToken(): void {
    this.token = null;
  }
};

// Validation utilities
const validators = {
  email: (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|mil|co|[a-zA-Z]{2,})$/i;
    return regex.test(email.trim());
  },

  password: (password: string): boolean => {
    return password.length >= 8 &&
           /[A-Za-z]/.test(password) &&
           /[0-9]/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
};

// API utilities
const apiClient = {
  async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      // Get CSRF token for POST/PUT/DELETE requests
      let headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(options.headers as Record<string, string> || {}),
      };

      // For requests that modify data, include CSRF token
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
        const csrfToken = await csrfManager.getToken();
        if (csrfToken) {
          headers['X-XSRF-TOKEN'] = csrfToken;
        }
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Important for Laravel sessions and CSRF
        headers,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        // If CSRF token is invalid, try to refresh it once
        if (res.status === 419 && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
          csrfManager.clearToken();
          const newToken = await csrfManager.getToken();

          if (newToken) {
            headers['X-XSRF-TOKEN'] = newToken;

            // Retry the request with new token
            const retryRes = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              credentials: 'include',
              headers,
            });

            if (retryRes.ok) {
              return await retryRes.json();
            }
          }
        }

        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<any> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async initSSO(): Promise<any> {
    return this.request('/api/auth/sso-init', {
      method: 'POST',
    });
  },

  async auditLog(event: AuditEvent): Promise<void> {
    try {
      await this.request('/api/audit/log', {
        method: 'POST',
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.warn('Audit logging failed:', error);
    }
  }
};

// Custom hooks
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

const useBackendConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastPing, setLastPing] = useState<PingResult | null>(null);

  const pingBackend = useCallback(async () => {
    setConnectionStatus('checking');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const startTime = Date.now();
      const res = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (res.ok) {
        setConnectionStatus('connected');
        setLastPing({ time: new Date(), responseTime });
      } else {
        setConnectionStatus('disconnected');
        setLastPing({ time: new Date(), responseTime: null });
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setLastPing({ time: new Date(), responseTime: null });
    }
  }, []);

  useEffect(() => {
    pingBackend();
    const interval = setInterval(pingBackend, 10000);
    return () => clearInterval(interval);
  }, [pingBackend]);

  return { connectionStatus, lastPing, pingBackend };
};

const useSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "operational",
    message: "",
    lastChecked: null,
  });

  const checkSystemStatus = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${API_BASE_URL}/api/system/status`, {
        signal: controller.signal,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        setSystemStatus({
          ...data,
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.warn("System status check failed:", error);
        setSystemStatus({
          status: "warning",
          message: "Could not verify system status",
          lastChecked: new Date(),
        });
      }
    }
  }, []);

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSystemStatus]);

  return systemStatus;
};

const useLoginAttempts = () => {
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const isLocked = useMemo(() => {
    if (!lockoutUntil) return false;
    return Date.now() < lockoutUntil;
  }, [lockoutUntil]);

  const incrementAttempts = useCallback(() => {
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION);
      }
      return newAttempts;
    });
  }, []);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setLockoutUntil(null);
  }, []);

  const getRemainingLockoutTime = useCallback(() => {
    if (!lockoutUntil) return 0;
    return Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 60000));
  }, [lockoutUntil]);

  return { attempts, isLocked, incrementAttempts, resetAttempts, getRemainingLockoutTime };
};

export default function OptimizedLoginPage() {
  const router = useRouter();
  const isOnline = useNetworkStatus();
  const systemStatus = useSystemStatus();
  const { connectionStatus, lastPing, pingBackend } = useBackendConnection();
  const { attempts, isLocked, incrementAttempts, resetAttempts, getRemainingLockoutTime } = useLoginAttempts();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Initialize CSRF token on component mount
  useEffect(() => {
    csrfManager.fetchCSRFToken();
  }, []);

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (formData.email && !validators.email(formData.email)) {
      errors.email = "Please enter a valid corporate email address";
    }

    if (formData.password && !validators.password(formData.password)) {
      errors.password = "Password must be at least 8 characters with letters, numbers, and special characters";
    }

    return errors;
  }, [formData.email, formData.password]);

  const isFormValid = useMemo(() => {
    return formData.email &&
           formData.password &&
           Object.keys(validationErrors).length === 0;
  }, [formData, validationErrors]);

  // Handlers
  const handleInputChange = useCallback((field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'email' ? e.target.value.trim() : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, rememberMe: checked }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || isLocked || !isOnline) return;

    if (!isFormValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const credentials: LoginCredentials = {
        email: formData.email,
        password: formData.password,
        remember_me: formData.rememberMe,
        rememberMe: formData.rememberMe,
        session_timeout: SESSION_TIMEOUT,
      };

      const response = await apiClient.login(credentials);

      resetAttempts();

      // Store token and user data in cookies if provided
      if (response.token) {
        document.cookie = `token=${response.token}; path=/; max-age=${SESSION_TIMEOUT * 60}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      }
      
      if (response.user) {
        document.cookie = `user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${SESSION_TIMEOUT * 60}; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
      }

      await apiClient.auditLog({
        event_type: 'login_success',
        username: formData.email,
        ip_address: 'logged-server-side',
        timestamp: new Date().toISOString(),
      });

      // Handle redirect with proper fallback
      const redirectUrl = response.redirect_url || '/dashboard';
      
      // Use window.location for immediate redirect to ensure middleware runs
      window.location.href = redirectUrl;

    } catch (error) {
      incrementAttempts();

      const errorMessage = (error as Error).message || 'Authentication failed';
      setErrors({ general: errorMessage });

      await apiClient.auditLog({
        event_type: 'login_failure',
        username: formData.email,
        details: errorMessage,
        ip_address: 'logged-server-side',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [formData, loading, isLocked, isOnline, isFormValid, validationErrors, incrementAttempts, resetAttempts, router]);

  const handleSSOLogin = useCallback(async () => {
    if (loading || !isOnline) return;

    setLoading(true);

    try {
      const response = await apiClient.initSSO();

      await apiClient.auditLog({
        event_type: 'sso_attempt',
        username: formData.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      window.location.href = response.redirect_url;
    } catch (error) {
      setErrors({ general: (error as Error).message || 'SSO initialization failed' });
    } finally {
      setLoading(false);
    }
  }, [loading, isOnline, formData.email]);

  const handleForgotPassword = useCallback(async () => {
    if (forgotPasswordLoading || !validators.email(forgotPasswordEmail)) return;

    setForgotPasswordLoading(true);

    try {
      await apiClient.request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      setForgotPasswordSuccess(true);
    } catch (error) {
      setErrors({ forgotPassword: (error as Error).message || 'Failed to send password reset link' });
    } finally {
      setForgotPasswordLoading(false);
    }
  }, [forgotPasswordEmail, forgotPasswordLoading]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const lockoutMessage = isLocked ?
    `Account locked due to ${MAX_LOGIN_ATTEMPTS} failed attempts. Try again in ${getRemainingLockoutTime()} minutes.` :
    null;

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">

        {/* Network Status */}
        {!isOnline && (
          <div className="w-full max-w-[500px] mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 border rounded-lg p-3 text-center">
            <div className="flex items-center justify-center text-red-700 dark:text-red-400">
              <WifiOff className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">No internet connection</span>
            </div>
          </div>
        )}

        {/* System Status Banner */}
        <AnimatePresence>
          {systemStatus.status !== "operational" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-[500px] mb-4"
            >
              <div
                className={`${
                  systemStatus.status === "warning"
                    ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                } border rounded-lg p-3 text-center`}
              >
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span
                    className={`text-sm font-medium ${
                      systemStatus.status === "warning"
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {systemStatus.message || "System maintenance in progress"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg relative">
              <Building className="w-12 h-12 text-white" />

              {/* Backend Connection Status Indicator */}
              <div className="absolute -top-1 -right-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Circle
                        className={`w-4 h-4 ${
                          connectionStatus === 'connected'
                            ? 'text-green-500 fill-green-500'
                            : connectionStatus === 'disconnected'
                            ? 'text-red-500 fill-red-500'
                            : 'text-yellow-500 fill-yellow-500'
                        } transition-colors duration-300`}
                      />
                      {connectionStatus === 'checking' && (
                        <div className="absolute inset-0">
                          <Circle className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                        </div>
                      )}
                      {connectionStatus === 'connected' && (
                        <div className="absolute inset-0">
                          <Circle className="w-4 h-4 text-green-400 animate-ping opacity-30" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">
                        Backend: {connectionStatus === 'connected' ? 'Connected' :
                                 connectionStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
                      </p>
                      {lastPing && (
                        <div className="text-slate-400">
                          <p>Last check: {lastPing.time.toLocaleTimeString()}</p>
                          {lastPing.responseTime && (
                            <p>Response: {lastPing.responseTime}ms</p>
                          )}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
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
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block font-medium mb-2 text-slate-700 dark:text-slate-300">
                Corporate Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@retailcorp.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={loading || isLocked}
                  required
                  className={errors.email ? "border-red-500" : ""}
                />
                <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block font-medium mb-2 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  disabled={loading || isLocked}
                  required
                  className={errors.password ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Session Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  disabled={loading || isLocked}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-slate-500 cursor-help">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    <span className="text-xs">30min session</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">
                    For security, sessions automatically expire after 30 minutes of inactivity
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Error Messages */}
            <AnimatePresence>
              {(errors.general || lockoutMessage) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                      {lockoutMessage || errors.general}
                      {attempts > 0 && attempts < MAX_LOGIN_ATTEMPTS && (
                        <div className="mt-1 text-xs">
                          {MAX_LOGIN_ATTEMPTS - attempts} attempts remaining
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isLocked || !isOnline || !isFormValid || connectionStatus === 'disconnected'}
              className="w-full mb-3"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>

            {/* SSO Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSSOLogin}
              disabled={loading || isLocked || !isOnline || connectionStatus === 'disconnected'}
              className="w-full"
            >
              <Building className="mr-2 h-4 w-4" />
              Sign in with Corporate SSO
            </Button>

            {/* Footer Links */}
            <div className="flex justify-between items-center mt-6 text-sm">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
                tabIndex={loading || isLocked ? -1 : 0}
              >
                Forgot password?
              </button>
              <Link
                href="/support"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline"
                tabIndex={loading || isLocked ? -1 : 0}
              >
                Need help?
              </Link>
            </div>
          </motion.form>

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 space-y-2">
            <p>&copy; {new Date().getFullYear()} RetailCorp. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-4">
              {/* Network Status */}
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="w-3 h-3 text-green-500" />) : (
                  <WifiOff className="w-3 h-3 text-red-500" />
                )}
                <span className={isOnline ? "text-green-500" : "text-red-500"}>
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {/* Backend Connection Status */}
              <div className="flex items-center space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected'
                      ? 'bg-green-500'
                      : connectionStatus === 'disconnected'
                      ? 'bg-red-500'
                      : 'bg-yellow-500 animate-pulse'
                  }`}
                />
                <span>Backend {connectionStatus}</span>
              </div>

              {/* Retry Connection Button */}
              {connectionStatus === 'disconnected' && (
                <button
                  onClick={pingBackend}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Retry
                </button>
              )}
            </div>

            {/* Legal Links */}
            <div className="flex justify-center space-x-4">
              <Link
                href="/privacy"
                className="hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Forgot Password Modal */}
        <AnimatePresence>
          {showForgotPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowForgotPasswordModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">Forgot Password</h2>
                  <button
                    onClick={() => {
                      setShowForgotPasswordModal(false);
                      setForgotPasswordEmail("");
                      setForgotPasswordSuccess(false);
                      setErrors(prev => ({ ...prev, forgotPassword: '' }));
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!forgotPasswordSuccess ? (
                  <>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="mb-4">
                      <label htmlFor="forgotPasswordEmail" className="block font-medium mb-2 text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <Input
                        id="forgotPasswordEmail"
                        type="email"
                        placeholder="you@retailcorp.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value.trim())}
                        className={errors.forgotPassword ? "border-red-500" : ""}
                      />
                      {errors.forgotPassword && (
                        <p className="text-red-500 text-xs mt-1">{errors.forgotPassword}</p>
                      )}
                    </div>

                    <Button
                      onClick={handleForgotPassword}
                      disabled={forgotPasswordLoading || !validators.email(forgotPasswordEmail)}
                      className="w-full"
                    >
                      {forgotPasswordLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
                      Password Reset Email Sent
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      We've sent a password reset link to your email address. Please check your inbox.
                    </p>
                    <Button
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
