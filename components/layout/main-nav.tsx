"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  Clock,
  BarChart2,
  Settings,
  ChevronDown,
  PlusCircle,
  User,
  Lock,
  Menu,
  X,
  ChevronRight,
  Search,
  LogOut,
  Store,
  Check,
  Sun,
  Moon,
  ChevronLeft,
  Plus,
  Download,
} from "lucide-react";

// Types for sidebar items
type SubItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  permissions?: string[];
};

type SidebarItem = {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  badge?: number | string;
  subItems?: SubItem[];
  permissions?: string[];
};

type Store = {
  id: string;
  name: string;
  icon?: string;
  themeColor?: string;
};

// Configuration - moved to separate file/component pattern
const sidebarConfig = useSidebarConfig();

// Tooltip component - extracted for reusability
const Tooltip = ({
  children,
  content,
  side = "right",
}: {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
}) => {
  const [show, setShow] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use a delay to prevent flickering
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isHovering) {
      timeout = setTimeout(() => setShow(true), 300);
    } else {
      setShow(false);
    }

    return () => clearTimeout(timeout);
  }, [isHovering]);

  return (
    <div
      className="relative flex"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-slate-800 rounded-md whitespace-nowrap",
            "shadow-lg transition-all duration-200 scale-100 opacity-100",
            side === "right" && "left-full ml-2",
            side === "left" && "right-full mr-2",
            side === "top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
            side === "bottom" && "top-full mt-2 left-1/2 -translate-x-1/2",
          )}
        >
          {content}
          <div
            className={cn(
              "absolute h-2 w-2 bg-slate-800 rotate-45",
              side === "right" &&
                "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
              side === "left" &&
                "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
              side === "top" &&
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
              side === "bottom" &&
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
            )}
          />
        </div>
      )}
    </div>
  );
};

// Store data - ideally this would come from an API or context
function useStores() {
  // In a real app, this would likely be a data fetch hook
  return [
    { id: "store-1", name: "Main Store", themeColor: "#3b82f6" },
    { id: "store-2", name: "Secondary Store", themeColor: "#10b981" },
    { id: "store-3", name: "Test Store", themeColor: "#8b5cf6" },
  ];
}

// Sidebar config - moved to a custom hook for better organization
function useSidebarConfig() {
  return [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Custom Orders",
      icon: Package,
      href: "/custom-orders",
      color: "text-purple-600 dark:text-purple-400",
      subItems: [
        {
          label: "All Orders",
          icon: Package,
          href: "/custom-orders",
          color: "text-purple-600 dark:text-purple-400",
        },
        {
          label: "Create Order",
          icon: Plus,
          href: "/custom-orders/create",
          color: "text-purple-600 dark:text-purple-400",
        },
      ],
    },
    {
      label: "Document Vault",
      icon: FileText,
      href: "/documents",
      color: "text-amber-600 dark:text-amber-400",
      subItems: [
        {
          label: "All Documents",
          icon: FileText,
          href: "/documents",
          color: "text-amber-600 dark:text-amber-400",
        },
        {
          label: "Upload",
          icon: Plus,
          href: "/documents/upload",
          color: "text-amber-600 dark:text-amber-400",
        },
        {
          label: "Version History",
          icon: Clock,
          href: "/documents/history",
          color: "text-amber-600 dark:text-amber-400",
        },
      ],
    },
    {
      label: "Activity Logs",
      icon: Clock,
      href: "/logs",
      color: "text-cyan-600 dark:text-cyan-400",
      subItems: [
        {
          label: "All Logs",
          icon: Clock,
          href: "/logs",
          color: "text-cyan-600 dark:text-cyan-400",
        },
        {
          label: "Export",
          icon: Download,
          href: "/logs/export",
          color: "text-cyan-600 dark:text-cyan-400",
        },
      ],
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Items",
      icon: Package,
      href: "/items",
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Billing",
      icon: FileText,
      href: "/create-invoice",
      color: "text-indigo-600 dark:text-indigo-400",
      subItems: [
        {
          label: "Create Invoice",
          icon: FileText,
          href: "/create-invoice",
          color: "text-indigo-600 dark:text-indigo-400",
        },
        {
          label: "All Invoices",
          icon: FileText,
          href: "/invoices",
          color: "text-indigo-600 dark:text-indigo-400",
        },
      ],
    },
    {
      label: "Payments",
      icon: CreditCard,
      href: "/payments",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Time Tracking",
      icon: Clock,
      href: "/time-tracking",
      color: "text-teal-600 dark:text-teal-400",
    },
    {
      label: "Reports",
      icon: BarChart2,
      href: "/reports",
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-slate-600 dark:text-slate-400",
      subItems: [
        {
          label: "Profile",
          icon: User,
          href: "/settings/profile",
          color: "text-slate-600 dark:text-slate-400",
        },
        {
          label: "Security",
          icon: Lock,
          href: "/settings/security",
          color: "text-slate-600 dark:text-slate-400",
        },
        {
          label: "Users",
          icon: Users,
          href: "/settings/users",
          color: "text-slate-600 dark:text-slate-400",
        },
      ],
    },
    {
      label: "Stores",
      icon: Store,
      href: "/stores",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];
}

// Hook for managing sidebar state - centralizes state management logic
function useSidebarState(pathname: string) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    settings: pathname.includes("/settings"),
  });
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize the function to prevent unnecessary re-renders
  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label.toLowerCase()]: !prev[label.toLowerCase()],
    }));
  }, []);

  return {
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
    expandedItems,
    toggleExpanded,
    isStoreDropdownOpen,
    setIsStoreDropdownOpen,
    searchQuery,
    setSearchQuery,
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const stores = useStores();

  // Current user info - in a real app, this would come from a user context
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "/avatar.png",
    role: "admin",
  };

  // Centralized state management
  const sidebarState = useSidebarState(pathname);
  const {
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
    expandedItems,
    toggleExpanded,
    isStoreDropdownOpen,
    setIsStoreDropdownOpen,
    searchQuery,
    setSearchQuery,
  } = sidebarState;

  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [filteredRoutes, setFilteredRoutes] = useState(sidebarConfig);

  // Filter routes when search query changes - with debounce for performance
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!searchQuery) {
        setFilteredRoutes(sidebarConfig);
        return;
      }

      const filtered = sidebarConfig.filter(
        (route) =>
          route.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.subItems?.some((subItem) =>
            subItem.label.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );

      setFilteredRoutes(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  // Check if user has permission for a route
  const hasPermission = useCallback(
    (permissions?: string[]) => {
      if (!permissions || permissions.length === 0) return true;
      return permissions.includes(user.role);
    },
    [user.role],
  );

  // Handle store change
  const handleStoreChange = useCallback(
    (store: Store) => {
      setSelectedStore(store);
      setIsStoreDropdownOpen(false);

      // Redirect to the new store route
      const currentPath = pathname.split("/").filter(Boolean);
      if (currentPath[0] === "store" && currentPath.length > 2) {
        // Already on a store path, replace the store ID
        const newPath = `/store/${store.id}/${currentPath.slice(2).join("/")}`;
        router.push(newPath);
      } else {
        // Not on a store path, add the store ID
        const newPath = `/store/${store.id}/${currentPath.join("/")}`;
        router.push(newPath);
      }
    },
    [pathname, router, setIsStoreDropdownOpen],
  );

  // Check if a route is active
  const isRouteActive = useCallback(
    (href: string) => {
      if (href === "/dashboard" && pathname === "/") return true;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  // Check if a parent with subitems has any active child
  const hasActiveChild = useCallback(
    (item: SidebarItem) => {
      return !!item.subItems?.some((subItem) => isRouteActive(subItem.href));
    },
    [isRouteActive],
  );

  // Toggle sidebar collapsed state
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed, setIsCollapsed]);

  // Mobile sidebar toggle
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(!isMobileOpen);
  }, [isMobileOpen, setIsMobileOpen]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Optimized rendering of sidebar items
  const renderSidebarItems = useMemo(() => {
    return filteredRoutes.map((route) => {
      // Skip routes user doesn't have permission for
      if (!hasPermission(route.permissions)) return null;

      const isActive = isRouteActive(route.href);
      const hasActiveSubItem = hasActiveChild(route);
      const isExpanded = expandedItems[route.label.toLowerCase()];

      if (route.subItems) {
        return (
          <div key={route.href} className="space-y-1">
            <button
              onClick={() => toggleExpanded(route.label)}
              className={cn(
                "w-full flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                isActive || hasActiveSubItem
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300",
                isCollapsed && "justify-center",
              )}
            >
              {isCollapsed ? (
                <Tooltip content={route.label}>
                  <div className="flex items-center justify-center">
                    <route.icon className={cn("h-5 w-5", route.color)} />
                  </div>
                </Tooltip>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-500 transition-transform",
                      isExpanded ? "rotate-180" : "",
                    )}
                  />
                </>
              )}
            </button>

            {/* Display submenu items when expanded or when hovered in collapsed mode */}
            {((isExpanded && !isCollapsed) ||
              (isCollapsed && (isActive || hasActiveSubItem))) && (
              <div
                className={cn(
                  "space-y-1 pt-1",
                  isCollapsed
                    ? "absolute left-full ml-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 min-w-48 top-auto z-50"
                    : "pl-4",
                )}
              >
                {route.subItems.map((subItem) => {
                  // Skip subitems user doesn't have permission for
                  if (!hasPermission(subItem.permissions)) return null;

                  const isSubItemActive = isRouteActive(subItem.href);

                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-x-3 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                        isSubItemActive
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400",
                      )}
                    >
                      <subItem.icon className={cn("h-4 w-4", subItem.color)} />
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-x-3 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
            isActive
              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
              : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300",
            isCollapsed && "justify-center relative",
          )}
        >
          {isCollapsed ? (
            <Tooltip content={route.label}>
              <div className="relative">
                <route.icon className={cn("h-5 w-5", route.color)} />

                {/* Badge in collapsed mode */}
                {route.badge && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {typeof route.badge === "number" && route.badge > 9
                      ? "9+"
                      : route.badge}
                  </span>
                )}
              </div>
            </Tooltip>
          ) : (
            <>
              <route.icon
                className={cn("h-5 w-5 flex-shrink-0", route.color)}
              />
              <span className="flex-1 truncate">{route.label}</span>

              {/* Badge */}
              {typeof route.badge !== "undefined" && (
                <span className="ml-auto bg-blue-600 text-xs text-white rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                  {typeof route.badge === "number" && route.badge > 99
                    ? "99+"
                    : route.badge}
                </span>
              )}
            </>
          )}
        </Link>
      );
    });
  }, [
    filteredRoutes,
    hasPermission,
    isRouteActive,
    hasActiveChild,
    expandedItems,
    toggleExpanded,
    isCollapsed,
  ]);

  return (
    <>
      {/* Mobile Menu Button - Improved accessibility */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-40 md:hidden bg-white dark:bg-slate-800 p-2 rounded-md shadow-md hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle menu"
        aria-expanded={isMobileOpen}
      >
        <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* Mobile Overlay - Added animation */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation overlay"
        />
      )}

      {/* Sidebar - Improved animations and accessibility */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out overflow-hidden",
          isCollapsed ? "w-20" : "w-[280px]",
          isMobileOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full md:translate-x-0",
        )}
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <div className="flex-1">
              {/* Store Switcher - Enhanced with better hover states */}
              <div className="relative">
                <button
                  onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                    isCollapsed ? "justify-center w-full" : "w-full",
                  )}
                  aria-expanded={isStoreDropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    className="flex-shrink-0 h-8 w-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: selectedStore.themeColor }}
                  >
                    <Store className="h-5 w-5 text-white" />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {selectedStore.name}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-slate-500 transition-transform",
                          isStoreDropdownOpen && "rotate-180",
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Store Dropdown - Added focus management and improved animation */}
                {isStoreDropdownOpen && (
                  <div
                    className={cn(
                      "absolute mt-1 z-50 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 animate-fadeIn",
                      isCollapsed
                        ? "left-full ml-1 top-0"
                        : "top-full left-0 w-full",
                    )}
                    role="menu"
                  >
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreChange(store)}
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-700",
                          isCollapsed ? "w-48" : "w-full",
                        )}
                        role="menuitem"
                      >
                        <div
                          className="flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: store.themeColor }}
                        >
                          <Store className="h-4 w-4 text-white" />
                        </div>
                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-200">
                          {store.name}
                        </span>
                        {selectedStore.id === store.id && (
                          <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={toggleCollapsed}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              )}
            </button>
          </div>

          {/* Sidebar Search - Improved UX with better focus states */}
          <div
            className={cn(
              "p-4 border-b border-slate-200 dark:border-slate-700",
              isCollapsed && "px-2",
            )}
          >
            <div className="relative">
              <Search
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none",
                  isCollapsed ? "left-1/2 -translate-x-1/2" : "left-3",
                )}
                aria-hidden="true"
              />
              {!isCollapsed && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  aria-label="Search navigation"
                />
              )}
            </div>
          </div>

          {/* Sidebar Navigation - Using memoized rendering for better performance */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {renderSidebarItems}
          </nav>

          {/* Quick Action Button - Enhanced with better hover effects */}
          <div
            className={cn("px-4 py-2", isCollapsed && "flex justify-center")}
          >
            {isCollapsed ? (
              <Tooltip content="Create New Invoice">
                <Link
                  href="/create-invoice"
                  className="flex items-center justify-center text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white p-2 rounded-lg transition-colors w-10 h-10 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <PlusCircle className="h-5 w-5" />
                </Link>
              </Tooltip>
            ) : (
              <Link
                href="/create-invoice"
                className="flex items-center gap-x-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white px-3 py-2 rounded-lg transition-colors w-full justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <PlusCircle className="h-4 w-4" />
                Create New Invoice
              </Link>
            )}
          </div>

          {/* Sidebar Footer - Improved organization */}
          <div
            className={cn(
              "p-4 border-t border-slate-200 dark:border-slate-700 mt-auto",
              isCollapsed ? "flex flex-col items-center" : "",
            )}
          >
            {/* Theme Toggle Button - Enhanced with better hover effects */}
            <div
              className={cn(
                "flex items-center justify-between mb-4",
                isCollapsed && "mb-4 justify-center",
              )}
            >
              {!isCollapsed && (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Theme
                </span>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {isCollapsed ? (
                  <Tooltip
                    content={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-700" />
                    )}
                  </Tooltip>
                ) : (
                  <>
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-slate-700" />
                    )}
                  </>
                )}
              </button>
            </div>

            {/* User Profile Section - Enhanced with better hover states */}
            <div className="flex items-center gap-x-3">
              {isCollapsed ? (
                <Tooltip content={user.name}>
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </div>
                </Tooltip>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Close button for mobile sidebar */}
      {isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(false)}
          className="fixed top-4 left-64 z-50 md:hidden"
          aria-label="Close menu"
        >
          <X className="h-6 w-6 text-white" />
        </button>
      )}
    </>
  );
}
