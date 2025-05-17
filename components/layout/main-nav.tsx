"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  User,
  Lock,
  Menu,
  X,
  Search,
  LogOut,
  Moon,
  Sun,
  PlusCircle,
  FilePlus,
  UserPlus,
  PackagePlus,
  FileCheck,
  ChevronRight,
} from "lucide-react";

// Configuration
const sidebarItems = [
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
  },
  {
    label: "Document Vault",
    icon: FileText,
    href: "/documents",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    label: "Activity Logs",
    icon: Clock,
    href: "/logs",
    color: "text-cyan-600 dark:text-cyan-400",
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
    subItems: [
      {
        label: "All Items",
        icon: Package,
        href: "/items",
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        label: "Add Item",
        icon: PackagePlus,
        href: "/items/create",
        color: "text-violet-600 dark:text-violet-400",
      },
      {
        label: "Categories",
        icon: FileCheck,
        href: "/items/categories",
        color: "text-violet-600 dark:text-violet-400",
      },
    ],
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
    ],
  },
];

const quickActions = [
  {
    label: "New Invoice",
    icon: FilePlus,
    href: "/create-invoice",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Add Customer",
    icon: UserPlus,
    href: "/customers/create",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    label: "Add Item",
    icon: PackagePlus,
    href: "/items/create",
    color: "bg-purple-600 hover:bg-purple-700",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label.toLowerCase()]: !prev[label.toLowerCase()],
    }));
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-50 bg-white dark:bg-slate-900 border-r transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen
            ? "translate-x-0 shadow-xl"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Company Name */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="font-semibold text-lg">Company Name</span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className={cn("p-4", isCollapsed && "px-2")}>
            <div className="relative">
              <Search
                className={cn(
                  "absolute text-muted-foreground h-4 w-4",
                  isCollapsed ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" : "left-3 top-1/2 -translate-y-1/2"
                )}
              />
              {!isCollapsed && (
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-md bg-slate-100 dark:bg-slate-800"
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-b">
            <h3 className={cn("text-sm font-medium mb-2 px-1", isCollapsed && "text-center")}>
              {!isCollapsed && "Quick Actions"}
            </h3>
            <div className={cn("space-y-1", isCollapsed && "flex flex-col items-center")}>
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md text-white transition-colors",
                    action.color,
                    isCollapsed && "w-10 h-10 justify-center"
                  )}
                >
                  <action.icon className="w-4 h-4" />
                  {!isCollapsed && <span className="text-sm">{action.label}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <div key={item.href}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "w-full flex items-center gap-2 p-2 rounded-md transition-colors",
                          pathname.startsWith(item.href)
                            ? "bg-slate-100 dark:bg-slate-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", item.color)} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-sm">{item.label}</span>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform",
                                expandedItems[item.label.toLowerCase()] && "rotate-180"
                              )}
                            />
                          </>
                        )}
                      </button>
                      {expandedItems[item.label.toLowerCase()] && !isCollapsed && (
                        <div className="pl-9 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-md text-sm transition-colors",
                                pathname === subItem.href
                                  ? "bg-slate-100 dark:bg-slate-800"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              )}
                            >
                              <subItem.icon className={cn("w-4 h-4", subItem.color)} />
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md transition-colors",
                        pathname === item.href
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      {!isCollapsed && (
                        <span className="text-sm">{item.label}</span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight
                  className={cn(
                    "w-5 h-5 transition-transform",
                    isCollapsed && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}