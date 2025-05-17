"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Bell,
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
  MessageSquare,
  HelpCircle,
  Info,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    label: "Custom Orders",
    icon: Package,
    href: "/custom-orders", 
    color: "text-purple-600 dark:text-purple-400"
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/documents",
    color: "text-amber-600 dark:text-amber-400"
  },
  {
    label: "Activity Logs",
    icon: Clock,
    href: "/logs",
    color: "text-cyan-600 dark:text-cyan-400"
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/create-invoice",
    color: "text-indigo-600 dark:text-indigo-400",
    subItems: [
      {
        label: "Create Invoice",
        href: "/create-invoice",
      },
      {
        label: "All Invoices",
        href: "/invoices",
      }
    ]
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/reports",
    color: "text-sky-600 dark:text-sky-400"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-600 dark:text-slate-400",
    subItems: [
      {
        label: "Profile",
        href: "/settings/profile",
      },
      {
        label: "Security",
        href: "/settings/security",
      }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleExpanded = useCallback((label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label.toLowerCase()]: !prev[label.toLowerCase()]
    }));
  }, []);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        const results = [];
        sidebarItems.forEach((item) => {
            if (item.label.toLowerCase().includes(query.toLowerCase())) {
                results.push(item);
            }
            if (item.subItems) {
                item.subItems.forEach((subItem) => {
                    if (subItem.label.toLowerCase().includes(query.toLowerCase())) {
                        results.push({
                            ...subItem,
                            parentLabel: item.label,
                        });
                    }
                });
            }
        });

        setSearchResults(results);
        setShowSearchResults(true);
    }, []);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-slate-800 p-2 rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        ) : (
          <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
          x: isMobileOpen ? 0 : isMobile ? -280 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-screen z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-800 dark:text-white">ERP System</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Business Dashboard</span>
                </div>
              )}
            </div>
          </div>

            <div className={cn("px-4 pt-4 pb-2", isCollapsed && "px-2")}>
                <div className="relative">
                    <Search
                        className={cn(
                            "absolute text-slate-400 z-10",
                            isCollapsed
                                ? "left-2.5 top-2.5 h-5 w-5"
                                : "left-3 top-3 h-4 w-4",
                        )}
                    />
                    <input
                        type="text"
                        placeholder={isCollapsed ? "" : "Search..."}
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={cn(
                            "w-full rounded-md bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 focus:ring-0 transition-colors",
                            isCollapsed
                                ? "pl-9 pr-2 py-2 text-sm"
                                : "pl-9 pr-4 py-2.5 text-sm",
                        )}
                    />

                    {showSearchResults && searchResults.length > 0 && !isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-50"
                        >
                            <div className="p-2 max-h-64 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <Link
                                        key={`${result.href}-${index}`}
                                        href={result.href}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        onClick={() => setShowSearchResults(false)}
                                    >
                                        <result.icon
                                            className={cn("w-4 h-4", result.color)}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {result.label}
                                            </span>
                                            {result.parentLabel && (
                                                <span className="text-xs text-slate-500">
                                                    in {result.parentLabel}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

          <nav className="flex-1 overflow-y-auto py-2 px-3">
            {/* Quick Actions */}
            <div className={cn("p-4 space-y-2", isCollapsed && "p-2")}>
              {!isCollapsed && <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Quick Actions</div>}
              <div className={cn("grid gap-2", isCollapsed ? "grid-cols-1" : "grid-cols-2")}>
                <Link
                  href="/items/create"
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md transition-colors text-sm group",
                    "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    isCollapsed && "justify-center"
                  )}
                  title="New Item"
                >
                  <PlusCircle className="w-6 h-6 text-blue-500" />
                  {!isCollapsed && <span>New Item</span>}
                </Link>
                <Link
                  href="/create-invoice"
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md transition-colors text-sm group",
                    "hover:bg-green-50 dark:hover:bg-green-900/20",
                    isCollapsed && "justify-center"
                  )}
                  title="New Invoice"
                >
                  <FilePlus className="w-6 h-6 text-green-500" />
                  {!isCollapsed && <span>New Invoice</span>}
                </Link>
                <Link
                  href="/customers/create"
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md transition-colors text-sm group",
                    "hover:bg-purple-50 dark:hover:bg-purple-900/20",
                    isCollapsed && "justify-center"
                  )}
                  title="New Customer"
                >
                  <UserPlus className="w-6 h-6 text-purple-500" />
                  {!isCollapsed && <span>New Customer</span>}
                </Link>
                <Link
                  href="/custom-orders/create"
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-md transition-colors text-sm group",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
                    isCollapsed && "justify-center"
                  )}
                  title="New Custom Order"
                >
                  <PackagePlus className="w-6 h-6 text-indigo-500" />
                  {!isCollapsed && <span>Custom Order</span>}
                </Link>
              </div>
            </div>

            {/* Mobile menu overlay */}
            <div className="space-y-0.5">
              {sidebarItems.map((item) => (
                <div key={item.href}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors rounded-lg",
                          expandedItems[item.label.toLowerCase()]
                            ? "bg-slate-100 dark:bg-slate-800"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5", item.color)} />
                        <span className="flex-1">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedItems[item.label.toLowerCase()] && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedItems[item.label.toLowerCase()] && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-2 text-sm transition-colors rounded-lg ml-6",
                                  pathname === subItem.href
                                    ? "bg-slate-100 dark:bg-slate-800"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                              >
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 text-sm transition-colors rounded-lg",
                        pathname === item.href
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform",
                    isCollapsed && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

        <div
            className={cn(
                "transition-all duration-300 ease-in-out",
                isCollapsed ? "ml-20" : "ml-0 md:ml-[280px]",
            )}
        />
    </>
  );
}