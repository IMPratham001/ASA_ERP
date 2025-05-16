"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  CreditCard,
  Settings,
  ChevronDown,
  Store,
  BarChart2,
  Menu,
  X,
  Search,
} from "lucide-react";

// Simplified sidebar config
const sidebarConfig = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-blue-600",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-emerald-600",
  },
  {
    label: "Sales",
    icon: CreditCard,
    href: "/invoices",
    color: "text-violet-600",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/customers",
    color: "text-amber-600",
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/reports",
    color: "text-indigo-600",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-slate-600",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(sidebarConfig);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredRoutes(sidebarConfig);
      return;
    }
    const filtered = sidebarConfig.filter((route) =>
      route.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchQuery]);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-white dark:bg-slate-800 p-2 rounded-md shadow-md"
      >
        <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      </button>

      <aside
        className={cn(
          "fixed h-screen z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Store className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">ASA-ERP</span>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {filteredRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                  pathname === route.href
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <route.icon className={cn("h-5 w-5", route.color)} />
                <span className="text-sm font-medium">{route.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                A
              </div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-slate-500">admin@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}