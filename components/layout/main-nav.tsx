"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import {
  Package,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Store,
  Clock,
  Menu,
  X,
  ChevronDown,
  Bell,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "New order", read: false },
    { id: 2, title: "Stock alert", read: true },
  ]);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Inventory",
      icon: Package,
      href: "/inventory",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/invoices",
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Custom Orders",
      icon: Package,
      href: "/custom-orders",
      color: "text-purple-600 dark:text-purple-400",
      subItems: [
        { label: "Create Order", href: "/custom-orders/create" },
        { label: "View Orders", href: "/custom-orders" },
      ],
    },
    {
      label: "Customers",
      icon: Users,
      href: "/customers",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/documents",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Stores",
      icon: Store,
      href: "/stores",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Time Tracking",
      icon: Clock,
      href: "/time-tracking",
      color: "text-rose-600 dark:text-rose-400",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600 dark:text-gray-400",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 rounded-full p-2 bg-white dark:bg-slate-900 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <motion.nav
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Store className="h-6 w-6" />
              <span className="text-xl font-bold">ASA-ERP</span>
            </Link>
          </div>

          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-6 py-3 text-sm font-medium",
                    pathname === item.href
                      ? "bg-slate-50 dark:bg-slate-800/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    item.color,
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.subItems && <ChevronDown className="ml-auto h-4 w-4" />}
                </Link>
                {item.subItems && (
                  <div className="ml-6 border-l border-slate-200 dark:border-slate-700">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-6 py-2 text-sm",
                          pathname === subItem.href
                            ? "text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Notification icon */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
